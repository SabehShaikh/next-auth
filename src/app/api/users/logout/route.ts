import { connectDB } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
  try {
    // Create a response to send back after the user logs out
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    // Remove the JWT token from the user's cookies to log them out
    response.cookies.set("token", "", {
      httpOnly: true, // Ensure the cookie is not accessible via JavaScript
      expires: new Date(0), // Expire the cookie immediately
    });

    return response;
  } catch (error: unknown) {
    // Log the error for debugging purposes
    if (error instanceof Error) {
      console.error("Error during logout:", error.message);
    }

    // Return a generic error response
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
