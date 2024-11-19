import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// This function will take a request and get user data from the token
export const getDataFromToken = (request: NextRequest) => {
  try {
    // Step 1: Get the token from the cookies in the request
    const token = request.cookies.get("token")?.value || ""; // Get the token or an empty string if not found

    // Step 2: Decode the token to get the information inside it
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!); // Verify and decode the token using the secret key

    // Step 3: Return the user's ID from the decoded token
    return decodedToken.id;
  } catch (error: any) {
    // If there's an error (e.g., no token or invalid token), throw an error message
    throw new Error(error.message);
  }
};
