import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";
import {  FaSignOutAlt} from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";

const MyProfile = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const{logout} = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/auth/profile");
      setUser(res.data?.data);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

     const handleLogout = async () => {
      try{
        setLoading(true);
         await logout();
       navigate("/", { replace: true });
      toast.success("Oops... logout")
     } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  }
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-500 py-10">
        Failed to load profile
      </div>
    );
  }

  return (
    <div className="in-h-screen py-8">
      <div className="mx-auto sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-black">My Profile</h2>
          <p className="text-lg font-semibold text-gray-700 mt-3">
           your account information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="col-span-1">
            <div className="bg-amber-100 rounded-2xl shadow-lg px-5 py-10 sticky top-8">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={user?.photoURL || "/default-avatar.png"}
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-300"
                  />

                  <active className="absolute bottom-3 right-2 bg-green-600 p-2 rounded-full hover:bg-gray-500"></active>
                </div>
                <h2 className="text-2xl font-bold text-red-400 mt-4">
                  {user?.email || "User"}
                </h2>
                <p className="text-blue-600">{user?.role}</p>
              </div>

            
                <div className="flex justify-center">
                  <h3 className="font-semibold text-gray-900">
                    Last Login Date :
                  </h3>
                  <p className="ml-2 text-violet-700">
                    {user.metadata?.lastSignInTime
                      ? new Date(
                          user.metadata.lastSignInTime
                        ).toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
              </div>
          </div>
          <div className="">
            <div className="bg-amber-100 p-10 rounded-2xl shadow-lg ">
              <h2 className="text-xl text-center font-bold text-black mb-6">
                Personal Information
              </h2>

              <div className="flex gap-7">
                <h2 className="font-medium text-black mb-2 flex items-center">
                  Full Name :
                </h2>
                <p className="text-green-700">{user?.name}</p>
              </div>
              <div className="flex gap-3">
                <h2 className="flex text-sm font-medium text-black items-center">
                  <span className="inline-block "> Email Address :</span>
                </h2>
                <p className="text-green-700 ">{user?.email}</p>
              </div>

              <div className="flex gap-17">
                <h2 className="font-medium text-black mb-2 flex items-center">
                  Role :
                </h2>
                <p className="text-green-700 ">{user?.role}</p>
              </div>

              <div className="flex gap-5">
                <h2 className="font-medium text-black  items-center mb-2">
                  Created At :
                </h2>
                <p className="text-green-700 ">{user?.createdAt}</p>
              </div>

              <div className="flex justify-end gap-3 p-6 ">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
