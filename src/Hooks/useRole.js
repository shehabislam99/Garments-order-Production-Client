import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { axiosInstance } from "./useAxios";

const useRole = () => {
  const { user } = useAuth();
 

  const {
    isLoading,
    data: roleData = { role: "buyer" },
    error,
  } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/role/${user?.email}`);
      return res.data;
    },
    retry: 1, // Retry once if fails
  });

  

  return {
    role: roleData?.role || "buyer",
    roleLoading: isLoading,
    error,
  };
};

export default useRole;
