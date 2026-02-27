import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import Prices from '@/src/models/Prices';

export async function GET() {
  await dbConnect();
  try {
    const prices = await Prices.findOne().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: prices });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const newPrices = await Prices.create(body);
    return NextResponse.json({ success: true, data: newPrices }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
