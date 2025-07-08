import FriendCard from "../../components/FriendCard/FriendCard";
import Spinner from "../../components/common/Spinner/Spinner";
import Prompt from "../../components/common/Prompt/Prompt";
import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../../../lib/api";

const Friends = () => {
  const { data: UserfriendList = [], isLoading } = useQuery({
    queryKey: ["friendsList"],
    queryFn: getFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen" data-theme="synthwave">
      <h2 className="text-2xl font-bold mb-6">My Friends</h2>

      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : UserfriendList.length === 0 ? (
        <Prompt
          title={"No friend yet"}
          description={"Connect with friends below to and start chat"}
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {UserfriendList?.map((friend) => (
            <FriendCard key={friend?._id} friend={friend}></FriendCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;
