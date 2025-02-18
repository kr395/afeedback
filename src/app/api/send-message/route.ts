import User from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User.model";

export async function POST(req: Request) {
  await dbConnect();
  const { username, message } = await req.json();
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    if (!user?.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "User not accepting messages" },
        { status: 403 }
      );
    }
    const newMessage = { content: message, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { success: true, message: "Message sent Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Unexpected error",error);
    
    return Response.json(
      { success: false, message: "Unexpected error" },
      { status: 500 }
    );
  }
}
