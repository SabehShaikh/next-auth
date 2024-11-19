import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(reqBody);

    // Check if the user exists by looking for the email in the database

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User exists!");

    // Compare passwords, it returns a boolean: (true or false)
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Check your credentials" },
        { status: 404 }
      );
    }

    // Prepare the data to be included in the JWT token (like user id and email)
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // Generate a JWT token using the token data and a secret, with an expiration of 1 day

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    // Set the token as a cookie, so it can be used for future requests
    response.cookies.set("token", token, {
      httpOnly: true, // Make sure the cookie is not accessible from JavaScript
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
