import { useQuery, useMutation, useQueryClient } from "react-query";
import { productService } from "../services/productService";
import toast from "react-hot-toast";

export const useProducts = (params = {}) => {
  return useQuery(["products", params], () => productService.getAll(params), {
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(productService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries("products");
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });
};
