import { FiLoader } from "react-icons/fi";

const PageLoader = () => {
  return (
    <div className=" h-screen flex justify-center items-center">
      <FiLoader className="animate-spin size-10 text-primary" />
    </div>
  );
};

export default PageLoader;
