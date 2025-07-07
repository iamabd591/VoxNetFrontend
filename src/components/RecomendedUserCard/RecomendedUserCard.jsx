import { capitalize, getLanguageFlagUrl } from "../../../lib/lib";
import { FiCheckCircle, FiUser, FiUserPlus } from "react-icons/fi";
import Spinner from "../../components/common/Spinner/Spinner";
import { MdLocationPin } from "react-icons/md";

const RecomendedUserCard = ({
  recomendedUsers,
  sendingToUserId,
  requestIds,
  sendRequest,
  isPending,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {recomendedUsers?.map((user) => {
        const hasRequestId = requestIds.has(user._id);
        const flagUrl = getLanguageFlagUrl(user?.language);
        return (
          <div
            key={user?._id}
            className="card bg-base-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="card-body p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="avatar size-16 rounded-full">
                  <img src={user?.profileUrl} alt={user?.fullName} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user?.fullName}</h3>
                  {user?.location && (
                    <div className="flex items-center text-xs opacity-70 mt-1">
                      <MdLocationPin className="size-3 mr-1" />
                      {user?.location}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="badge badge-secondary text-xs">
                  {flagUrl && (
                    <img
                    className="h-3 mr-1 inline-block"
                    src={flagUrl}
                    alt="flag"
                    />
                  )}
                  Native: {capitalize(user?.language)}
                </span>
              </div>

              {user?.bio && <p className="text-sm opacity-70">{user?.bio}</p>}

              <button
                className={`btn w-full mt-2 ${
                  hasRequestId ? "btn-disabled btn-outline" : "btn-primary"
                }`}
                disabled={hasRequestId || sendingToUserId === user._id}
                onClick={() => sendRequest(user?._id)}
              >
                {isPending && sendingToUserId === user?._id ? (
                  <Spinner />
                ) : hasRequestId ? (
                  <>
                    <FiCheckCircle className="size-4 mr-2 text-white " />
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
  );
};

export default RecomendedUserCard;
