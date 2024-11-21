import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB(); // Connect to the database

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get email and password
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(reqBody);

    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User exists!");

    // Compare the provided password with the stored hashed password
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Check your credentials" },
        { status: 404 }
      );
    }

    // Prepare data for the JWT token
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // Generate a JWT token with a 1-day expiration
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    // Create the response
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    // Set the token in a cookie (HTTP-only for security)
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    // Ensure error type is properly handled and logged
    console.error("Error occurred:", error); // Log the error for debugging

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
