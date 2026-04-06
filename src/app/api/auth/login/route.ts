import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { verifyPassword } from "@/src/lib/auth-password";
import {
  AUTH_COOKIE_NAME,
  createAuthToken,
  getSessionCookieMaxAge,
} from "@/src/lib/auth-session";
import dbConnect from "@/src/lib/dbConnect";
import User from "@/src/models/User";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = loginSchema.parse(await req.json());
    const email = body.email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user || !verifyPassword(body.password, user.passwordHash)) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = await createAuthToken({
      sub: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getSessionCookieMaxAge(),
    });

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Login failed." },
      { status: 500 },
    );
  }
}
