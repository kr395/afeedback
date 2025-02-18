import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import { User as NextAuthUser } from "next-auth";
import mongoose from "mongoose";

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

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      {$sort: { "messages.createdAt": -1 }},
      {$group : { _id: "$_id", messages: { $push: "$messages" }}}
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User Not found" },
        { status: 401 }
      );
    }
    return Response.json(
      { success: true, message: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "Error Adding Message" },
      { status: 500 }
    );
  }
}
