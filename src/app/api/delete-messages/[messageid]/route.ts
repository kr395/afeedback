import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import { User as NextAuthUser } from "next-auth";

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: NextAuthUser = session?.user as NextAuthUser;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "User Not Authorized" },
      { status: 401 }
    );
  }
  try {
    const updatedResult = await User.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount == 0) {
      return Response.json(
        { success: false, message: "Message Not Found/already Deleted" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, message: "Message Deleted" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error While Deleting Message" },
      { status: 500 }
    );
  }
}
