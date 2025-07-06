import CallContent from "../../components/CallContent/CallContent";
import Spinner from "../../components/common/Spinner/Spinner";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import useAuthHook from "../../hooks/useAuthHook";
import { getStreamToken } from "../../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
} from "@stream-io/video-react-sdk";

const CallPage = () => {
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const [connecting, setConnecting] = useState(true);
  const { authUser, isLoading } = useAuthHook();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!data?.token || !authUser) return;
      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profileUrl,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: data.token,
        });

        const callInstance = videoClient.call("default", id);
        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error initializing call:", error);
        toast.error("Could not connect to call. Please try again.");
      } finally {
        setConnecting(false);
      }
    };

    initCall();
  }, [data?.token, authUser, id, STREAM_API_KEY]);

  if (connecting || isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="h-screen flex flex-col items-center justify-center"
      data-theme="synthwave"
    >
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call.Please refresh and try again</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CallPage;
