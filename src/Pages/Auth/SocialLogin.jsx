import React from "react";
import { useLocation, useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";


const SocialLogin = () => {
  const { signInWithGoogle } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "buyer", 
      };

      await axiosSecure.post("/users", userInfo);

      toast.success("Logged in with Google", {
        position: "top-center",
        autoClose: 2000,
      });
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Google login failed", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  }
  return (
    <div className="text-center">
      <button
        onClick={handleGoogleSignIn}
        className="w-full flex justify-center items-center py-3 px-4 border-2 border-gray-300 rounded-full shadow-sm bg-white text-gray-700 hover:bg-red-800 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="w-5 h-5 mr-3"
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
