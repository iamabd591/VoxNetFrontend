import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequest } from "../../../lib/api";
import Prompt from "../../components/common/Prompt/Prompt";
import Loader from "../../components/common/Loader/Loader";
import { FiUserCheck } from "react-icons/fi";
import toast from "react-hot-toast";

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
  const incommingRequests = freiendRequests?.incomingRequests || [];
  const acceptedRequests = freiendRequests?.acceptedSentRequests || [];

  return (
    <div className="p-4 sm:p-4 lg:p-8" data-theme="synthwave">
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
                                  Native: {request?.sender?.language}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => accepteFriendRequest(request?._id)}
                            className="btn btn-primary btn-sm"
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>
                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification.recipient.fullName}
                            </h3>
                            <p className="text-sm my-1">
                              {notification.recipient.fullName} accepted your
                              friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
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
