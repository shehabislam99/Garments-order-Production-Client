import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useProduct } from "../../Hooks/useProduct";
 // Adjust path as needed

const AllProducts = ({
  // You can still accept products as props, but if not provided, use the hook
  products: externalProducts,
  loading: externalLoading,
  error: externalError,
  onViewDetails,
  onAddToCart,
  onAddToWishlist,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  gap = "gap-6",
  emptyMessage = "No products found",
  loadingMessage = "Loading products...",
  className = "",
  // New props to control hook usage
  useHook = true, // Whether to use the hook or rely on props
  autoRefresh = false, // Whether to auto-refresh products
  refreshInterval = 30000, // Auto-refresh interval in ms (30 seconds)
}) => {
  // Use the hook if useHook is true
  const {
    products: hookProducts,
    loading: hookLoading,
    error: hookError,
    fetchProducts,
  } = useProduct();

  // State for auto-refresh
  const [refreshTimer, setRefreshTimer] = useState(null);

  // Determine which data to use
  const products =
    !useHook && externalProducts ? externalProducts : hookProducts;
  const loading =
    !useHook && externalLoading !== undefined ? externalLoading : hookLoading;
  const error = !useHook && externalError ? externalError : hookError;

  // Set up auto-refresh if enabled
  useEffect(() => {
    if (autoRefresh && useHook) {
      const timer = setInterval(() => {
        console.log("Auto-refreshing products...");
        fetchProducts();
      }, refreshInterval);

     //  setRefreshTimer(timer);

      // Cleanup on unmount
      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [autoRefresh, useHook, fetchProducts, refreshInterval]);

  // Expose hook functions via callback props if needed
//   const handleAddProduct = async (productData) => {
//     if (useHook) {
//       return await addProduct(productData);
//     }
//     return { success: false, error: "Hook not enabled for adding products" };
//   };

//   const handleUpdateProduct = async (id, productData) => {
//     if (useHook) {
//       return await updateProduct(id, productData);
//     }
//     return { success: false, error: "Hook not enabled for updating products" };
//   };

//   const handleDeleteProduct = async (id) => {
//     if (useHook) {
//       return await deleteProduct(id);
//     }
//     return { success: false, error: "Hook not enabled for deleting products" };
//   };

  const handleRefresh = () => {
    if (useHook) {
      fetchProducts();
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{loadingMessage}</p>
          {useHook && autoRefresh && (
            <p className="text-sm text-gray-400 mt-2">
              Auto-refresh enabled ({refreshInterval / 1000}s)
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="text-center text-red-600">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>Error loading products</p>
          <p className="text-sm text-gray-500 mt-1">{error.message}</p>
          {useHook && (
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className={`flex flex-col justify-center items-center h-64 text-center ${className}`}
      >
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Products</h3>
        <p className="text-gray-500 max-w-md">{emptyMessage}</p>
        {useHook && (
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Refresh
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Optional Header with Actions */}
      {useHook && (
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Showing {products.length} products
            {autoRefresh && (
              <span className="ml-2 text-green-600">• Auto-refresh active</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRefresh}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
              title="Refresh products"
            >
              Refresh
            </button>
            {autoRefresh && (
              <button
                onClick={() => {
                  if (refreshTimer) {
                    clearInterval(refreshTimer);
                    setRefreshTimer(null);
                  }
                }}
                className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                title="Stop auto-refresh"
              >
                Stop Auto-Refresh
              </button>
            )}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className={`grid ${gridCols} ${gap} ${className}`}>
        {products.map((product, index) => (
          <ProductCard
            key={product._id || index}
            product={product}
            onViewDetails={() => onViewDetails?.(product)}
            onAddToCart={() => onAddToCart?.(product)}
            onAddToWishlist={() => onAddToWishlist?.(product)}
            isFeatured={index % 5 === 0}
            isOnSale={product.discountPrice > 0}
            salePercentage={product.salePercentage}
          />
        ))}
      </div>

      {/* Footer Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {products.length}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {products.filter((p) => p.quantity > 0).length}
            </div>
            <div className="text-sm text-green-600">In Stock</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {products.filter((p) => p.discountPrice > 0).length}
            </div>
            <div className="text-sm text-red-600">On Sale</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(
                products.reduce((sum, p) => sum + (p.rating || 0), 0) /
                  products.length
              ) || 0}
            </div>
            <div className="text-sm text-blue-600">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export additional functions for external use
AllProducts.useProductHook = useProduct;

export default AllProducts;
