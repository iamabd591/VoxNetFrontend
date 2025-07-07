import {getLanguageFlagUrl } from "../../../lib/lib";
import { Link } from "react-router";
const FriendCard = ({ friend }) => {
  const flagUrl = getLanguageFlagUrl(friend?.language);
  return (
    <div className="card bg-base-200 hover:shadow-sm transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend?.profileUrl} alt={friend?.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend?.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {flagUrl && (
              <img src={flagUrl} alt="flag" className="h-3 mr-1 inline-block" />
            )}
            Native: {friend?.language}
          </span>
        </div>
        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
