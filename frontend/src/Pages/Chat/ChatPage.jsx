import CallButton from "../../components/CallButton/CallButton";
import Spinner from "../../components/common/Spinner/Spinner";
import useAuthHook from "../../hooks/useAuthHook";
import { getStreamToken } from "../../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import {
  ChannelHeader,
  MessageList,
  MessageInput,
  Channel,
  Thread,
  Window,
  Chat,
} from "stream-chat-react";
const ChatPage = () => {
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const [chatClient, setChatClient] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [channel, setChannel] = useState(null);
  const { authUser } = useAuthHook();
  const { id } = useParams();
  console.log(id);

  const { data } = useQuery({
    queryKey: ["steamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!data?.token || !authUser) return;
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser?._id,
            name: authUser?.fullName,
            profileUrl: authUser?.profileUrl,
          },
          data?.token
        );
        const channelId = [authUser?._id, id].sort().join("-");
        const currentChannel = client.channel("message", channelId, {
          members: [authUser?._id, id],
        });
        await currentChannel.watch();
        setChannel(currentChannel);
        setChatClient(client);
      } catch (error) {
        console.log("Error initializinf chat:", error);
        toast.error("Could not connent to chat. Please try again");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [data?.token, authUser, id, STREAM_API_KEY]);

  const handleVideoCall = () => {
    try {
      if (channel) {
        const callUrl = `${window.location.origin}/call/${channel?.id}`;
        channel.sendMessage({
          text: `I' ve started a video call. Join me here: ${callUrl}`,
        });
      }
      toast.success("Video call link sent successfully");
    } catch (error) {
      toast.error("Failed to send video call link");
      console.log(`Error to sent video call link ${error.message}`);
    }
  };
  if (isLoading || !chatClient || !channel) {
    <Spinner />;
  }
  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
