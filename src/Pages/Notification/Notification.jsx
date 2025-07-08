import { FiBell, FiClock, FiMessageSquare, FiUserCheck } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../components/common/Loader/Loader";
import Prompt from "../../components/common/Prompt/Prompt";
import toast from "react-hot-toast";
import {
  acceptFriendRequest,
  getFriendRequest,
  rejectFriendRequest,
} from "../../../lib/api";
import Spinner from "../../components/common/Spinner/Spinner";

const Notification = () => {
  const queryClient = useQueryClient();
  const { data: freiendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequest,
  });

  const { mutate: accepteFriendRequest, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Request Accept Successfully ");
    },
    onError: (error) => {
      toast.error(error.message || "Send Request Failed");
      console.error("Send Request Failed", error);
    },
  });

  const { mutate: rejectedFriendRequest, isPending:isReject } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Request Reject Successfully ");
    },
    onError: (error) => {
      toast.error(error.message || "Send Request Failed");
      console.error("Reject Request Failed", error);
    },
  });
  const incommingRequests = freiendRequests?.incomingRequests || [];
  const acceptedRequests = freiendRequests?.acceptedSentRequests || [];

  console.log("Accepted", acceptedRequests);
  console.log("Incomming", incommingRequests);

  return (
    <div className="p-4 sm:p-4 lg:p-8 min-h-dvh" data-theme="synthwave">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">
          Notifications
        </h1>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {incommingRequests?.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FiUserCheck className="size-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incommingRequests?.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {incommingRequests?.map((request) => (
                    <div
                      key={request?._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar size-14 rounded-full bg-base-300">
                              <img
                                src={request?.sender?.profileUrl}
                                alt={request?.sender?.fullName}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {request?.sender?.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  {request?.sender?.location}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center items-center gap-x-2">
                            <button
                              onClick={() => accepteFriendRequest(request?._id)}
                              className="btn btn-primary btn-sm"
                              disabled={isPending || isReject}
                            >
                              {isPending ? <Spinner /> : "Accept"}
                            </button>

                            <button
                              onClick={() =>
                                rejectedFriendRequest(request?._id)
                              }
                              className="btn btn-secondary btn-sm"
                              disabled={isReject || isPending}
                            >
                              {isReject ? <Spinner /> : "Reject"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {acceptedRequests?.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FiBell className="h-5 w-5 text-success" />
                  New Connections
                </h2>
                <div className="space-y-3">
                  {acceptedRequests?.map((notification) => (
                    <div
                      key={notification?._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification?.recipent?.profileUrl}
                              alt={notification?.recipent?.fullName}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification?.recipent?.fullName}
                            </h3>
                            <p className="text-sm my-1">
                              {notification?.recipent?.fullName} accepted your
                              friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <FiClock className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <FiMessageSquare className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {incommingRequests?.length === 0 &&
              acceptedRequests?.length === 0 && (
                <Prompt
                  title={"You're All Caught Up!"}
                  description={"There are no new friend requests right now."}
                />
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notification;
