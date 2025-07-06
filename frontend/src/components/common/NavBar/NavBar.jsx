import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router";
import useAuthHook from "../../../hooks/useAuthHook";
import { MdOutlineVoiceChat } from "react-icons/md";
import { FiBell, FiLogOut } from "react-icons/fi";
import { logout } from "../../../../lib/api";
import toast from "react-hot-toast";
import Spinner from "../Spinner/Spinner";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser } = useAuthHook();
  const queryClient = useQueryClient();
  const isChatPath = location.pathname?.startsWith("/chat");
  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await queryClient.setQueryData(["auth"], null);
      toast.success("Logout successfully");
      setTimeout(() => navigate("/login"), 100);
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed");
      console.error("Logout failed", error);
    },
  });
  return (
    <nav
      className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center"
      data-theme="synthwave"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center w-full ${
            isChatPath ? "justify-between" : "justify-end"
          }`}
        >
          {isChatPath && (
            <Link to="/" className="flex items-center gap-2.5">
              <MdOutlineVoiceChat className="size-12 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
                VoxNet
              </span>
            </Link>
          )}

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/notification">
              <button className="btn btn-ghost btn-circle">
                <FiBell className="size-5 text-base-content opacity-70" />
              </button>
            </Link>
            <div className="avatar">
              <div className="w-6 rounded-full">
                <img src={authUser?.profileUrl} alt="user Profile" />
              </div>
            </div>
            <button
              className="btn btn-ghost btn-circle"
              disabled={isPending}
              onClick={mutate}
            >
              {isPending ? (
                <Spinner />
              ) : (
                <FiLogOut className="size-5 text-base-content opacity-70" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
