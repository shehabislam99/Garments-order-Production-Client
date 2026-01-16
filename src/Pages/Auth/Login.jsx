import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import SocialLogin from "./SocialLogIn";
import Logo from "../../Components/Common/Logo/Logo";
import Loading from "../../Components/Common/Loding/Loding";

const Login = () => {
  const { user, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [from, user, navigate]);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setshowPassword] = useState(false);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };
  const handleToggle = () => {
    setshowPassword(!showPassword);
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await signIn(loginData.email, loginData.password);

    toast.success("Login successful.. Welcome back!", {
      position: "top-center",
      autoClose: 2000,
    });

    navigate(from, { replace: true });
  } catch (err) {
      toast.error("Login failed. Try again!", err.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
   finally {
    setLoading(false);
  }
};

   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="text-center">
           <Loading></Loading>
         </div>
       </div>
     );
   }
  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 ">
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="w-1/2 bg-amber-100 p-8 rounded-4xl shadow-xl border border-gray-200">
          <div className=" text-center  mb-8">
            <Link
              className="flex justify-center hover:underline "
              to="/"
            >
              <Logo></Logo>
            </Link>
            <h2 className=" text-2xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-600 text-base mt-2">
              Please log in to your account.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="text-sm text-black font-medium mb-1 block"
              >
                Email Address
              </label>
              <div className="relative">
                {" "}
                <div
                  className="absolute inset-y-0  pl-3 
                              flex items-center "
                >
                  <FaEnvelope className="h-4 text-gray-700 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={loginData.email}
                  onChange={handleChange}
                  className="w-full px-9 py-2 text-gray-800 bg-gray-200 border border-gray-400 rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-green-500
                     focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm text-black  font-medium mb-1 block"
              >
                Password
              </label>
              <div className="relative">
                <div
                  className="absolute inset-y-0  pl-3 
                              flex items-center "
                >
                  <RiLockPasswordFill className="h-4 text-gray-700 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-9 py-2 text-gray-800 bg-gray-200 border border-gray-400 rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-green-500
                     focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={handleToggle}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>

            <div className="flex items-center md:flex-row flex-col justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 rounded-full focus:ring-blue-400"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-red-500
                 hover:text-red-800 "
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full  bg-indigo-600 text-white py-3 
              rounded-full font-semibold hover:bg-red-800"
            >
              Login
            </button>

            <div className="flex  justify-center">
              <span className="mx-2 text-gray-700 text-sm">
                Or continue with
              </span>
            </div>
            <SocialLogin></SocialLogin>
            <p className="text-center text-sm text-gray-600 mt-4">
              Don’t have an account?{" "}
              <button
                className="text-blue-600 
                hover:text-red-800 font-semibold "
              >
                <Link to="/register">Create account</Link>
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
