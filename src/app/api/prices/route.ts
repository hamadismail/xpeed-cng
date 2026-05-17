/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Prices from '@/src/models/Prices';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [prices, total] = await Promise.all([
      Prices.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Prices.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: prices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/prices:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const newPrices = await Prices.create(body);
    return NextResponse.json({ success: true, data: newPrices }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/prices:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
