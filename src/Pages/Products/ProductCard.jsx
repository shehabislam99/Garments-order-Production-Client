// src/components/Product/ProductCard.jsx
import React from "react";
import { FaEye, FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCard = ({
  product,
  onViewDetails,
  onAddToCart,
  onAddToWishlist,
  className = "",
  showCategory = true,
  showStock = true,
  showRating = true,
  showActions = true,
  isFeatured = false,
  isOutOfStock = false,
  salePercentage = 0,
}) => {
  const {
    _id,
    name = "Product Name",
    title = "",
    category = "Uncategorized",
    price = 0,
    originalPrice = 0,
    discountPrice = 0,
    quantity = 0,
    image = "",
    images = [],
    rating = 0,
    reviewCount = 0,
    description = "",
    tags = [],
    brand = "",
    sku = "",
  } = product;

  const productName = title || name;
  const displayPrice = discountPrice > 0 ? discountPrice : price;
  const displayImage =
    image || (images && images[0]) || "https://via.placeholder.com/300x300";
  const isInStock = quantity > 0 && !isOutOfStock;
  const stockStatus =
    quantity > 10
      ? "In Stock"
      : quantity > 0
      ? `Low Stock (${quantity})`
      : "Out of Stock";

  // Determine sale percentage
  const calculateSalePercentage = () => {
    if (salePercentage > 0) return salePercentage;
    if (originalPrice > 0 && displayPrice < originalPrice) {
      return Math.round(((originalPrice - displayPrice) / originalPrice) * 100);
    }
    return 0;
  };

  const salePercent = calculateSalePercentage();

  // Format price
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Generate stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 w-4 h-4" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <FaStar key={i} className="text-yellow-400 w-4 h-4 opacity-50" />
        );
      } else {
        stars.push(<FaStar key={i} className="text-gray-300 w-4 h-4" />);
      }
    }

    return stars;
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && isInStock) {
      onAddToCart(product);
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  return (
    <div
      className={`
        group relative bg-white rounded-xl shadow-md hover:shadow-xl 
        transition-all duration-300 overflow-hidden border border-gray-100
        hover:border-blue-100 hover:-translate-y-1
        ${isFeatured ? "ring-2 ring-blue-500 ring-opacity-50" : ""}
        ${!isInStock ? "opacity-80" : ""}
        ${className}
      `}
    >
      {/* Sale Badge */}
      {salePercent > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg">
            {salePercent}% OFF
          </span>
        </div>
      )}

      {/* Out of Stock Badge */}
      {!isInStock && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-white shadow-lg">
            Out of Stock
          </span>
        </div>
      )}

      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white shadow-lg">
            Featured
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={displayImage}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x300";
          }}
        />

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            {showActions && (
              <>
                <button
                  onClick={handleViewDetails}
                  className="bg-white p-3 rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
                  title="View Details"
                >
                  <FaEye className="w-5 h-5" />
                </button>

                {isInStock && (
                  <button
                    onClick={handleAddToCart}
                    className="bg-white p-3 rounded-full shadow-lg hover:bg-green-50 hover:text-green-600 transition-all duration-300 transform hover:scale-110"
                    title="Add to Cart"
                  >
                    <FaShoppingCart className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={handleAddToWishlist}
                  className="bg-white p-3 rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-all duration-300 transform hover:scale-110"
                  title="Add to Wishlist"
                >
                  <FaHeart className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stock Indicator Bar */}
        {showStock && quantity > 0 && quantity <= 10 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${(quantity / 10) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        {showCategory && category && (
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
              {category}
            </span>
          </div>
        )}

        {/* Product Name/Title */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors duration-200">
          <Link to={`/products/${_id}`} className="hover:underline">
            {productName}
          </Link>
        </h3>

        {/* Rating */}
        {showRating && rating > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex items-center mr-2">{renderStars(rating)}</div>
            <span className="text-sm text-gray-600">
              {rating.toFixed(1)} {reviewCount > 0 && `(${reviewCount})`}
            </span>
          </div>
        )}

        {/* Description (Optional) */}
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(displayPrice)}
            </span>
            {originalPrice > 0 && displayPrice < originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* SKU/Brand */}
          <div className="text-right">
            {brand && (
              <span className="text-xs text-gray-500 block">{brand}</span>
            )}
            {sku && <span className="text-xs text-gray-400">SKU: {sku}</span>}
          </div>
        </div>

        {/* Stock Status & Quantity */}
        {showStock && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  isInStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isInStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {stockStatus}
              </span>
            </div>
            {quantity > 0 && (
              <span className="text-sm text-gray-600">
                {quantity} available
              </span>
            )}
          </div>
        )}

        {/* Tags (Optional) */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FaEye className="w-4 h-4 mr-2" />
            View Details
          </button>

          {isInStock && (
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              disabled={!isInStock}
            >
              <FaShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </button>
          )}
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {rating.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {reviewCount}
            </div>
            <div className="text-xs text-gray-500">Reviews</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{quantity}</div>
            <div className="text-xs text-gray-500">Stock</div>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-xl pointer-events-none transition-all duration-300" />
    </div>
  );
};

// Default props
ProductCard.defaultProps = {
  product: {},
  className: "",
  showCategory: true,
  showStock: true,
  showRating: true,
  showActions: true,
  isFeatured: false,
  isOutOfStock: false,
  isOnSale: false,
  salePercentage: 0,
};

export default ProductCard;
