import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import 'stream-chat-react/dist/css/v2/index.css';
import { Toaster } from "react-hot-toast";
import Outlet from "./Routes/Outlet";
const App = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
      <Toaster />
    </>
  );
};

export default App;
