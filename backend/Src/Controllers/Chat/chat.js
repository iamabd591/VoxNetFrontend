import { generateStramToken } from "../../Client/Stream.js";

export const getChatStreamToken = async (req, res) => {
  try {
    const token = generateStramToken(req.user._id);
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
};
