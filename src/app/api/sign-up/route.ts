import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/sendEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    
  } catch (error) {
    console.log("Error connecting to database", error);
    return Response.json(
      { success: false, message: "Error while signing up  " },
      { status: 500 }
    );
  }
}
