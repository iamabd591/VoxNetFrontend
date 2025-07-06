import RecomendedUserCard from "../../components/RecomendedUserCard/RecomendedUserCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FriendCard from "../../components/FriendCard/FriendCard";
import Prompt from "../../components/common/Prompt/Prompt";
import Loader from "../../components/common/Loader/Loader";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import {
  getRecomendeUsers,
  SendFriendRequest,
  friendRequest,
  getFriends,
} from "../../../lib/api";
import { FiUser } from "react-icons/fi";

const Home = () => {
  const queryClient = useQueryClient();
  const [requestIds, setRequestIds] = useState(new Set());
  const [sendingToUserId, setSendingToUserId] = useState(null);

  const { data: friends = [], isLoading: friendsLoding } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  const { data: recomendedUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["Users"],
    queryFn: getRecomendeUsers,
  });

  const { data: freiendRequest } = useQuery({
    queryKey: ["friendRequest"],
    queryFn: friendRequest,
  });

  const { mutate: sendRequest, isPending } = useMutation({
    mutationFn: SendFriendRequest,
    onMutate: (userId) => {
      setSendingToUserId(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequest"] });
      toast.success("Request sent successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Send Request Failed");
      console.error("Send Request Failed", error);
    },
    onSettled: () => {
      setSendingToUserId(null);
    },
  });

  useEffect(() => {
    const friendRequestIds = new Set();
    if (freiendRequest && freiendRequest?.outgoingRequests?.length > 0) {
      freiendRequest?.outgoingRequests?.forEach((req) => {
        friendRequestIds.add(req?.recipent?._id);
      });
      setRequestIds(friendRequestIds);
    }
  }, [freiendRequest]);

  return (
    <div className="p-4 sm:p-6 lg:p-8" data-theme="synthwave">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notification" className="btn btn-outline btn-sm">
            <FiUser className="mr-2 size4" />
            Friend Request
          </Link>
        </div>

        {friendsLoding ? (
          <Loader />
        ) : friends?.length === 0 ? (
          <Prompt
            title={"No friend yet"}
            description={"Connect with friends below to and start chat"}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends?.map((friend) => (
              <FriendCard key={friend?._id} friend={friend} />
            ))}
          </div>
        )}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Friends
                </h2>
                <p className="opacity-70">
                  Discover new friends and start meaningful conversations with
                  people around the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {usersLoading ? (
          <Loader />
        ) : recomendedUsers.length === 0 ? (
          <Prompt
            title={"No recomendation available"}
            description={"Check back later for new friends"}
          />
        ) : (
          <RecomendedUserCard
            recomendedUsers={recomendedUsers}
            sendingToUserId={sendingToUserId}
            sendRequest={sendRequest}
            requestIds={requestIds}
            isPending={isPending}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
