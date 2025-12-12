import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaTimes,
} from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { BsFillPersonFill, BsFillPersonPlusFill } from "react-icons/bs";
import { MdAddAPhoto, MdError } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";


const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    photoURL: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const passwordValid = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasMinLength = password.length >= 6;

    return {
      isValid: hasUppercase && hasLowercase && hasMinLength,
      errors: [
        !hasUppercase && "Must have an Uppercase letter",
        !hasLowercase && "Must have a Lowercase letter",
        !hasMinLength && "Length must be at least 6 characters",
      ].filter(Boolean),
    };
  };

  const validatePhotoURL = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) != null;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (
      !registerData.firstName ||
      !registerData.lastName ||
      !registerData.email ||
      !registerData.password ||
      !registerData.photoURL
    ) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 5000,
      });
      setLoading(false);
      return;
    }

    // Validate photo URL
    if (!validatePhotoURL(registerData.photoURL)) {
      toast.error("Please enter a valid image URL (jpg, png, gif, webp, svg)", {
        position: "-top-right",
        autoClose: 5000,
      });
      setLoading(false);
      return;
    }

    // Validate password
    const validation = passwordValid(registerData.password);
    if (!validation.isValid) {
      validation.errors.forEach((error) =>
        toast.error(error, { position: "top-right" })
      );
      setLoading(false);
      return;
    }

    const fullName = `${registerData.firstName} ${registerData.lastName}`;

    createUser(registerData.email, registerData.password)
      .then((res) => {
        return updateUserProfile(res.user, {
          displayName: fullName,
          photoURL: registerData.photoURL,
        });
      })
      .then(() => {
        toast.success("Successfully registered in website", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/", { replace: true });
        setLoading(false);
      })
      .catch((error) => {
        toast.error(`Registration failed: ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
        setLoading(false);
        console.error("Registration error:", error);
      });
  };

  const handleGoogle = () => {
    setLoading(true);

    signInWithGoogle()
      .then(() => {
        toast.success("Successfully logged in with Google", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/", { replace: true });
        setLoading(false);
      })
      .catch((error) => {
        toast.error(`Google login failed: ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
        setLoading(false);
        console.error("Google login error:", error);
      });
  };

  const PasswordRequirement = ({ requirement, text }) => (
    <div className="flex items-center">
      {requirement ? (
        <FaCheck className="h-4 w-4 text-green-500 mr-2" />
      ) : (
        <FaTimes className="h-4 w-4 text-red-500 mr-2" />
      )}
      <span
        className={`text-sm font-medium ${
          requirement ? "text-green-600" : "text-red-600"
        }`}
      >
        {text}
      </span>
    </div>
  );

  // Fixed loading state with proper return
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Creating your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2  p-6 rounded-2xl shadow-lg ">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <Link to="/">
                <h2 className="text-3xl font-bold text-gray-800">Store</h2>
              </Link>
              <p className="text-xl text-gray-700 font-bold mt-2">
                Create your account
              </p>
            </div>

            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <div className="relative transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-y-0 left-3 flex items-center">
                      <BsFillPersonFill className="h-5 w-5 text-gray-600" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={registerData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="First Name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <div className="relative transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-y-0 left-3 flex items-center">
                      <BsFillPersonPlusFill className="h-5 w-5 text-gray-600" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={registerData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className="relative transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <FaEnvelope className="h-4 w-4 text-gray-600" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={registerData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <RiLockPasswordFill className="h-4 w-4 text-gray-600" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={registerData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label
                  htmlFor="photoURL"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Photo URL
                </label>
                <div className="relative transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-y-0 left-3 flex items-center">
                    <MdAddAPhoto className="h-4 w-4 text-gray-600" />
                  </div>
                  <input
                    id="photoURL"
                    name="photoURL"
                    type="url"
                    required
                    value={registerData.photoURL}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                {/* Photo Preview */}
                {registerData.photoURL && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-1">Photo Preview:</p>
                    {validatePhotoURL(registerData.photoURL) ? (
                      <div className="w-20 h-20 border-2 border-green-400 rounded-lg overflow-hidden bg-gray-200">
                        <img
                          src={registerData.photoURL}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML =
                              '<div class="w-full h-full flex items-center justify-center text-red-500 text-xs">Invalid Image</div>';
                          }}
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-red-500 flex items-center mt-1">
                        <MdError className="mr-1" size={14} />
                        Please enter a valid image URL (jpg, png, gif, webp,
                        svg)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            {registerData.password && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Password must contain:
                </p>
                <PasswordRequirement
                  requirement={/[A-Z]/.test(registerData.password)}
                  text="At least one uppercase letter"
                />
                <PasswordRequirement
                  requirement={/[a-z]/.test(registerData.password)}
                  text="At least one lowercase letter"
                />
                <PasswordRequirement
                  requirement={registerData.password.length >= 6}
                  text="Minimum 6 characters"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-pink-300 to-green-400 text-gray-700">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>

            {/* Footer Links */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-2 sm:space-y-0">
              <p className="text-gray-600 text-sm">
                Already a member?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300"
                >
                  Log In
                </Link>
              </p>
              <Link
                to="/terms-services"
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-300"
              >
                Terms of Services
              </Link>
            </div>
          </form>
        </div>

        {/* Right side - Illustration/Info */}
        <div className="w-full lg:w-1/2 p-6 text-center lg:text-left">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Join Our Community
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <FaCheck className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span>Access exclusive products and deals</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span>Fast and secure checkout</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span>Personalized recommendations</span>
            </li>
            <li className="flex items-start">
              <FaCheck className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span>24/7 customer support</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
