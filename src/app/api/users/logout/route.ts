import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
  try {
        // Create a response to send back after the user logs out

    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

        // Remove the JWT token from the user's cookies to log them out

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;


  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
