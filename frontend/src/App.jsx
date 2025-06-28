import { Toaster } from "react-hot-toast";
import Outlet from "./Routes/Outlet";
const App = () => {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};

export default App;
