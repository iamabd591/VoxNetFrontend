import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthHook from "../../../hooks/useAuthHook";
import { MdOutlineVoiceChat } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router";
import { FiBell, FiLogOut } from "react-icons/fi";
import { logout } from "../../../../lib/api";
import toast from "react-hot-toast";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser } = useAuthHook();
  const queryClient = useQueryClient();
  const isChatPath = location.pathname?.startsWith("/chat");
  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logout successfully");
      navigate("/login");
    },
    onError: (error) => {
      toast.error("Logout failed");
      console.error("Logout failed", error);
    },
  });
  return (
    <nav
      className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center"
      data-theme="synthwave"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {isChatPath && (
            <Link to="/" className="flex items-start gap-2.5">
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
          </div>

          <div className="avatar">
            <div className="w-6 rounded-full">
              <img src={authUser?.profileUrl} alt="user Profile" />
            </div>
          </div>
          <button className="btn btn-ghost btn-circle" onClick={mutate}>
            <FiLogOut className="size-5 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
