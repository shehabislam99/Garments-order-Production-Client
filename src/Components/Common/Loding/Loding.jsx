import { FaSpinner } from "react-icons/fa";

const Loading = () => {

  return (
    <div className="flex justify-center items-center">
  
        <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
      </div>
  
  );
};

export default Loading;
