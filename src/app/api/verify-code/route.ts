import User from "@/model/User.model";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";

const verifyCodeSchema = z.object({
  username: usernameValidation,
  code: z.string(),
});

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, code } = await req.json();
    const decodedUsername = decodeURIComponent(username);
    // validate with zod
    const result = verifyCodeSchema.safeParse({
      username: decodedUsername,
      code,
    });
    console.log(result);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      const codeError = result.error.format().code?._errors || [];
      return Response.json(
        { success: false, message: result.error.message },
        { status: 400 }
      );
    }
    const { checkedUsername, checkedCode } = result.data;

    const user = await User.findOne({ username: checkedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "user not found" },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === checkedCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid || isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification Code expired Please signup again",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Invalid code" },
        { status: 400 }
      );
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error while signing up", error);
    return Response.json(
      { success: false, message: "Error while signing up  " },
      { status: 500 }
    );
  }
}
