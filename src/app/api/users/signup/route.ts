import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json(); // Parse the incoming request body
    const { username, email, password } = reqBody; // Destructure the user details

    console.log(reqBody); // Log the received request body for debugging

    // Check if a user with the given email already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Generate a salt for hashing the password
    const salt = await bcryptjs.genSalt(10);
    // Hash the user's password with the generated salt
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a new user document in the database
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save(); // Save the new user to the database
    console.log(savedUser); // Log the saved user data for debugging

    // Send a verification email to the user
    await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id, // ID of the newly created user
    });

    // Return a success response
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: unknown) {
    // Check if the error is an instance of Error for type safety
    if (error instanceof Error) {
      console.error("Signup Error:", error.message); // Log the error message
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Handle unexpected errors that are not instances of Error
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
