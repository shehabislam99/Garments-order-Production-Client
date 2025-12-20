import { useState, useEffect } from "react";
import { axiosInstance } from "./useAxios";
import toast from "react-hot-toast";

export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/products");
      const productArray = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setProducts(productArray);
    } catch {
      toast.error("Error fetching products");
       setProducts([]); 
    } finally {
      setLoading(false);
    }
  };
  

  const updateProduct = async (id, productData) => {
    try {
      const response = await axiosInstance.put(
        `/products/${id}`,
        productData
      );
      setProducts((prev) =>
        prev.map((product) =>
          product._id === id ? { ...product, ...productData } : product
        )
      );
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error updating product:", err);
      return { success: false, error: err };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting product:", err);
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    updateProduct,
    deleteProduct,
  };
};
