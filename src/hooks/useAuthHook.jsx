import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../../lib/api";

const useAuthHook = () => {
  const authUser = useQuery({
    queryKey: ["auth"],
    queryFn: getAuthUser,
    retry: false,
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};

export default useAuthHook;
