import User from "@/model/User.model";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";

const checkUsernameSchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // validate with zod
    const result = checkUsernameSchema.safeParse(queryParam);
    console.log(result);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        { success: false, message: result.error.message },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await User.findOne({
      username: username.toLowerCase(),
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "Username already exists" },
        { status: 400 }
      );
    }
    return Response.json(
      { success: true, message: "Username available" },
      { status: 200 }
    );

    
  } catch (error) {
    console.error("Error Checking User Name", error);
    return Response.json(
      { success: false, message: "Error Checking User Name" },
      { status: 500 }
    );
  }
}
