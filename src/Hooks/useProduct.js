// src/hooks/useProducts.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/products",
        productData
      );
      setProducts((prev) => [...prev, response.data.product]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Error adding product:", err);
      return { success: false, error: err };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/products/${id}`,
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
      await axios.delete(`http://localhost:5000/products/${id}`);
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
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
