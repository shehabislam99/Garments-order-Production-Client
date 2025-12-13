import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaUpload,
} from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { BsFillPersonFill, BsFillPersonPlusFill } from "react-icons/bs";
import { MdAddAPhoto } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";
import Logo from "../../Components/Common/Logo/Logo";


const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    role:"",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  // Handle Photo file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error(
        "Please select a valid image file (JPEG, PNG, GIF, WebP, SVG)",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      e.target.value = "";
      return;
    }

    setSelectedFile(file);

    // preview photo
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Password validation
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


  const uploadToImageBB = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, 
        }
      );

      if (response.data?.data?.url) {
        toast.success("Profile photo uploaded successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        return response.data.data.url;
      } else {
        throw new Error("No image URL returned from ImageBB");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed", {
        position: "top-right",
        autoClose: 5000,
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (
      !registerData.firstName ||
      !registerData.lastName ||
      !registerData.email ||
      !registerData.password ||
      !registerData.role
    ) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
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

    // Upload image to ImageBB
    const imageUrl = await uploadToImageBB(selectedFile);
    if (!imageUrl) {
      setLoading(false);
      return;
    }

    // Create user account with the uploaded image URL
    const fullName = `${registerData.firstName} ${registerData.lastName}`;

    try {
      // Create user in Firebase
      const userCredential = await createUser(
        registerData.email,
        registerData.password
      );

      // Update user profile with name and image URL
      await updateUserProfile(userCredential.user, {
        displayName: fullName,
        photoURL: imageUrl,
      });
       const userData = {
         name: fullName,
         email: registerData.email,
         password: registerData.password,
         photoURL: imageUrl,
         role: registerData.role,
       };
      await axios.post("http://localhost:5000/user", userData);

      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign-in
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
        console.error("Google login error:", error);

        let errorMessage = "Google login failed";
        if (error.code === "auth/popup-closed-by-user") {
          errorMessage = "Sign-in was cancelled";
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
        setLoading(false);
      });
  };

  // Password requirement component
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

  // Loading state
  if (loading || uploading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {uploading ? "Uploading your photo..." : "Creating your account..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center  mb-8">
              <p className="flex justify-center">
                <Logo></Logo>
              </p>
              <p className="text-xl text-gray-700 font-bold mt-2">
                Create Your Account
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Join our community today
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
                      className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  Email Address
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
                    className="w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
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
                    className="w-full pl-10 pr-12 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-300"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div>
                <label
                  htmlFor="photoFile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Photo
                </label>
                <div className="space-y-3">
                  {/* File Input */}
                  <div className="relative">
                    <input
                      id="photoFile"
                      name="photoFile"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="photoFile"
                      className="flex items-center justify-center w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200 cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-y-0 left-3 flex items-center">
                        <MdAddAPhoto className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="ml-2">
                        {selectedFile
                          ? selectedFile.name
                          : "Choose a profile photo..."}
                      </span>
                      <FaUpload className="ml-auto h-4 w-4 text-gray-600" />
                    </label>
                  </div>

                  {/* Photo Preview */}
                  {selectedFile && imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview:
                      </p>
                      <div className="w-32 h-32 mx-auto border-4 border-blue-200 rounded-full overflow-hidden shadow-lg">
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Password Requirements */}
            {registerData.password && (
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Password Requirements:
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
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        registerData.password.length >= 8
                          ? "bg-green-500"
                          : registerData.password.length >= 6
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (registerData.password.length / 12) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              required
              name="role"
              value={registerData.role}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3
               text-gray-800 bg-gray-100 border border-gray-300
                rounded-full focus:outline-none transition-all duration-300 hover:scale-105
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your Role</option>
              <option value="buyer">Buyer</option>
              <option value="manager">Manager</option>
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full bg-gradient-to-r from-blue-600
               to-indigo-600 hover:from-blue-700
                hover:to-indigo-700 text-white font-semibold
                 py-3 px-4 rounded-full transition-all duration-300
                  transform hover:scale-105 disabled:opacity-50 
                  disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading || uploading}
              className="w-full flex justify-center items-center py-3 px-4 border-2 border-gray-300 rounded-full shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300 hover:underline"
                >
                  Sign In Now
                </Link>
              </p>
              <Link
                to="/terms-services"
                className="text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors duration-300 hover:underline"
              >
                Terms of Service & Privacy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
