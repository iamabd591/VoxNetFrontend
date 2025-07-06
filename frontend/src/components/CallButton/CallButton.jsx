import { MdVideoCall } from "react-icons/md";
function CallButton({ handleVideoCall }) {
  return (
    <div className="p-3 border-b flex items-center justify-end max-w-full mx-auto w-full absolute top-0">
      <button
        onClick={handleVideoCall}
        className="btn btn-success btn-sm text-white"
      >
        <MdVideoCall className="size-6" />
      </button>
    </div>
  );
}

export default CallButton;
