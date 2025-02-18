import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import { User as NextAuthUser } from "next-auth";

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: NextAuthUser = session?.user as NextAuthUser;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Accept message error" },
      { status: 500 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await req.json();
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status of accepting messages",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "user Updated Successfully status of accepting messages",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Failed to update status of accepting messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: NextAuthUser = session?.user as NextAuthUser;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Accept message error" },
      { status: 500 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, isAcceptingMessages: foundUser.isAcceptingMessages },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "Failed to get status of accepting messages" },
      { status: 500 }
    );
  }
}
