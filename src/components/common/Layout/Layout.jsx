import SideBar from "../SideBar/SideBar";
import NavBar from "../NavBar/NavBar";

const Layout = ({ children, showSidebar }) => {
  return (
    <div className="min-h-screen ">
      <div className="flex">
        {showSidebar && <SideBar />}

        <div className="flex flex-1 flex-col ">
          <NavBar />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
