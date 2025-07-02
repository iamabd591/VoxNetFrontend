import { sidebarLinks } from "../../../../lib/constant";
import useAuthHook from "../../../hooks/useAuthHook";
import { MdOutlineVoiceChat } from "react-icons/md";
import { Link, useLocation } from "react-router";

const SideBar = () => {
  const location = useLocation();
  const { authUser } = useAuthHook();
  const currentPath = location.pathname;

  return (
    <aside
      className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-base-300 bg-base-200 "
      data-theme="synthwave"
    >
      <div className="border-b border-base-300 p-5">
        <Link to="/" className="flex items-start gap-2.5">
          <MdOutlineVoiceChat className="size-12 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
            VoxNet
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarLinks?.map((link) => {
          const Icon = link?.icon;
          return (
            <Link
              key={link?.id}
              to={link?.path}
              className={`btn btn-ghost justify-normal w-full px-3 gap-3 normal-case ${
                currentPath === link?.path ? "btn-active" : ""
              }`}
            >
              <Icon className="size-5 opacity-70 text-base-content" />
              <span>{link?.title}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profileUrl} alt="user Profile" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              <span>Online</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
