import { generateStramToken } from "../../Client/Stream.js";

export const getChatStreamToken = async (req, res) => {
  try {
    const token = await generateStramToken(req.user._id);
    console.log("Stream Token:", token);
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
