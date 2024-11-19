import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDB();

export async function GET(request: NextRequest) {
  try {
    // Step 1: Extract user ID from the token in the request
    const userID = await getDataFromToken(request);

    // Step 2: Use the user ID to find the user in the database, excluding the password field
    const user = await User.findOne({ _id: userID }).select("-password");

    // Step 3: If user is found, respond with a success message and user data (without the password)
    return NextResponse.json({
      message: "User found", // Let the client know that we found the user
      data: user, // Send back the user's data without the password
    });
  } catch (error: any) {
    // Step 4: If there's an error (e.g., token error, user not found), respond with an error message
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
