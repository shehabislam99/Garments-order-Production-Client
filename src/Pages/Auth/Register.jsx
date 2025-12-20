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
import SocialLogin from "./SocialLogIn";
import { axiosInstance } from "../../Hooks/useAxios";

const Register = () => {
  const { createUser, updateUserProfile, user } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
    const [registerData, setRegisterData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      photoURL: "",
      role: "",
    });

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };
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

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

    const validation = passwordValid(registerData.password);
    if (!validation.isValid) {
      validation.errors.forEach((error) =>
        toast.error(error, { position: "top-right" })
      );
      setLoading(false);
      return;
    }

    const imageUrl = await uploadToImageBB(selectedFile);
    if (!imageUrl) {
      setLoading(false);
      return;
    }

    
    const fullName = `${registerData.firstName} ${registerData.lastName}`;
    try {
      const userCredential = await createUser(
        registerData.email,
        registerData.password
      );
      await updateUserProfile(userCredential.user, {
        displayName: fullName,
        photoURL: imageUrl,
      });
      const userInfo = {
        name: fullName,
        email: registerData.email,
        password: registerData.password,
        photoURL: imageUrl,
        role: registerData.role,
      };
      await axiosInstance.post("/users", userInfo);

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
    <div className="min-h-screen flex items-center justify-center py-8 px-4 ">
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="w-1/2 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center  mb-8">
              <p className="flex justify-center">
                <Link
                  className="hover:underline"
                  to="/"
                >
                  <Logo></Logo>
                </Link>
              </p>
              <p className="text-xl text-gray-700 font-bold mt-2">
                Create Your Account
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Join our community today
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <div className="relative">
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
                  <div className="relative ">
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
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative ">
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
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
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
              <div>
                <label
                  htmlFor="photoFile"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Photo
                </label>
                <div className="space-y-3">
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
                      className="flex items-center justify-center w-full pl-10 pr-4 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200 cursor-pointer"
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
                rounded-full focus:outline-none 
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your Role</option>
              <option value="buyer">Buyer</option>
              <option value="manager">Manager</option>
            </select>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full bg-indigo-600
                hover:bg-purple-600   text-white font-semibold
                 py-3 px-4 rounded-full disabled:opacity-50 
                  disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <div className="relative ">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>
            <SocialLogin></SocialLogin>

            <div
              className="flex sm:flex-row space-y-2 flex-col 
            justify-between items-center"
            >
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-red-800 font-semibold transition-colors duration-300 hover:underline"
                >
                  Sign In Now
                </Link>
              </p>
              <Link
                to="/terms-services"
                className="text-blue-600 hover:text-red-800 font-medium text-sm transition-colors duration-300 hover:underline"
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
