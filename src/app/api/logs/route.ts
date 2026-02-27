import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Logs from '@/src/models/Logs';
import Prices from '@/src/models/Prices';
import { PRICES } from '@/src/utils/constans';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();

    // Fetch the latest prices from the database
    const latestPrices = await Prices.findOne().sort({ createdAt: -1 });

    const pricesToUse = {
      cngPrice: latestPrices?.CNG ?? PRICES.CNG,
      dieselPrice: latestPrices?.DIESEL ?? PRICES.DIESEL,
      octanePrice: latestPrices?.OCTANE ?? PRICES.OCTANE,
      lpgPrice: latestPrices?.LPG ?? PRICES.LPG,
    };

    const logData = {
      ...body,
      ...pricesToUse,
    };

    const log = await Logs.create(logData);
    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const date = searchParams.get('date');

    let query = {};
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setUTCDate(startDate.getUTCDate() + 1);
      query = { date: { $gte: startDate, $lt: endDate } };
    }

    const logs = await Logs.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Logs.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// export async function PATCH() {
//   await dbConnect();

//   try {
//     const result = await Logs.updateMany(
//       {},
//       {
//         $set: {
//           cngPrice: PRICES.CNG,
//           dieselPrice: PRICES.DIESEL,
//           octanePrice: PRICES.OCTANE,
//           lpgPrice: PRICES.LPG,
//         },
//       }
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         data: { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json({ success: false, error }, { status: 400 });
//   }
// }
