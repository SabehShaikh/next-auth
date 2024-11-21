import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    console.log("token", token);

    // Find the user with the provided token
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    // If no user found
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    console.log(user);

    // Verify the user and set isVerified to true
    user.isVerified = true;

    // Clear the verify token and its expiry
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    // Save the updated user
    await user.save();
    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Check if the error is an instance of Error for type safety
    if (error instanceof Error) {
      console.error("Verification Error:", error.message); // Log the error message
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Handle unexpected errors that are not instances of Error
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}