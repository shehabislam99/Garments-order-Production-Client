import { useState, useEffect, useCallback } from "react";
import useAxiosSecure from "./useAxiosSecure";
import toast from "react-hot-toast";

const useProfile = () => {
  const axiosSecure = useAxiosSecure();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosSecure.get("/profile");

      if (response.data.success) {
        setProfile(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (err) {
      toast.error(
        "Profile fetch error:",
        {
          position: "top-center",
          autoClose: 2000,
        },
        err
      );
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,

    setProfile,
  };
};

export default useProfile;
