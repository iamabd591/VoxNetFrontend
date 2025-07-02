import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { capitalize, getLanguageFlagUrl } from "../../../lib/lib";
import FriendCard from "../../components/FriendCard/FriendCard";
import Loader from "../../components/common/Loader/Loader";
import Prompt from "../../components/common/Prompt/Prompt";
import toast, { CheckmarkIcon } from "react-hot-toast";
import { FiUser, FiUserPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import { MdApi } from "react-icons/md";
import { Link } from "react-router";
import {
  getRecomendeUsers,
  SendFriendRequest,
  friendRequest,
  getFriends,
} from "../../../lib/api";
import Spinner from "../../components/common/Spinner/Spinner";

const Home = () => {
  const queryClient = useQueryClient();

  const [requestIds, setRequestIds] = useState(new Set());

  const { data: friends = [], isLoading: friendsLoding } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  const { data: recomendedUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["Users"],
    queryFn: getRecomendeUsers,
  });

  const { data: freiendRequest, isLoading: requestLoading } = useQuery({
    queryKey: ["friendRequest"],
    queryFn: friendRequest,
  });

  const { mutate: sendRequest, isPending } = useMutation({
    mutationFn: SendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequest"] });
      toast.success("Request sent successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Send Request Failed");
      console.error("Send Request Failed", error);
    },
  });

  useEffect(() => {
    const friendRequestIds = new Set();
    if (freiendRequest && freiendRequest.length > 0) {
      freiendRequest.forEach((req) => {
        friendRequestIds.add(req?.recipient?._id);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recomendedUsers?.map((user) => {
              const hasRequestId = requestIds.has(user._id);
              const flagUrl = getLanguageFlagUrl(user?.language);

              return (
                <div
                  key={user._id}
                  className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="card-body p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar size-16 rounded-full">
                        <img src={user?.profileUrl} alt={user?.fullName} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {user?.fullName}
                        </h3>
                        {user?.location && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <MdApi className="size-3 mr-1" />
                            {user?.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="badge badge-secondary text-xs">
                        {flagUrl && (
                          <img
                            src={flagUrl}
                            alt="flag"
                            className="h-3 mr-1 inline-block"
                          />
                        )}
                        Native: {capitalize(user?.language)}
                      </span>
                    </div>

                    {user?.bio && (
                      <p className="text-sm opacity-70">{user?.bio}</p>
                    )}

                    <button
                      className={`btn w-full mt-2 ${
                        hasRequestId ? "btn-disabled" : "btn-primary"
                      }`}
                      onClick={() => sendRequest(user._id)}
                      disabled={hasRequestId || isPending}
                    >
                      {requestLoading ? (
                        <Spinner />
                      ) : hasRequestId ? (
                        <>
                          <CheckmarkIcon className="size-4 mr-2" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <FiUserPlus className="size-4 mr-2" />
                          Send Friend Reqest
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
