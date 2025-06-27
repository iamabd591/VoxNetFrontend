import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API;
const secret = process.env.STREAM_SECRET;

const streamClient = StreamChat.getInstance(apiKey, secret);
export const upsertSteamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("❌ Error upserting user data", error);
  }
};

export const generateStramToken = async (userId) => {
  try {
    const strUserId = userId.toString();
    const token = streamClient.createToken(strUserId);
    console.log("✅ Stream token generated successfully");
    return token;
  } catch (error) {
    console.error("❌ Error generating stream token", error);
  }
};
