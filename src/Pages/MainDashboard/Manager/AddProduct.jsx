import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaImage, FaSpinner, FaCheck, FaTimes } from "react-icons/fa";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [product, setProduct] = useState({
    name: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: "",
    image: "",
    description: "",
    tags: "",
    brand: "",
    sku: "",
    rating: 0,
    reviewCount: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP)");
      e.target.value = "";
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      e.target.value = "";
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload image to ImgBB
  const uploadImageToImgBB = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

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
        toast.success("Image uploaded successfully!");
        return response.data.data.url;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Generate SKU automatically
  const generateSKU = (name, category) => {
    const prefix = category.toUpperCase().substring(0, 3);
    const nameCode = name.replace(/\s+/g, "").substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${nameCode}-${randomNum}`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product.image;

      // If image file is selected, upload to ImgBB
      if (imageFile) {
        const uploadedUrl = await uploadImageToImgBB(imageFile);
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      // Generate SKU if not provided
      const sku = product.sku || generateSKU(product.name, product.category);

      // Prepare product data
      const productData = {
        ...product,
        price: Number(product.price),
        discountPrice: product.discountPrice
          ? Number(product.discountPrice)
          : 0,
        stock: Number(product.stock),
        image: imageUrl,
        sku,
        tags: product.tags
          ? product.tags.split(",").map((tag) => tag.trim())
          : [],
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "active",
      };

      // Send to backend
      const response = await axios.post(
        "http://localhost:5000/products",
        productData
      );

      if (response.data.success || response.status === 201) {
        toast.success("Product added successfully!");

        // Reset form
        setProduct({
          name: "",
          price: "",
          discountPrice: "",
          category: "",
          stock: "",
          image: "",
          description: "",
          tags: "",
          brand: "",
          sku: "",
          rating: 0,
          reviewCount: 0,
        });
        setImageFile(null);
        setImagePreview("");

        // Navigate to all products page after 1.5 seconds
        setTimeout(() => {
          navigate("/all-products");
        }, 1500);
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error("Product submission error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    if (product.price && product.discountPrice) {
      const price = Number(product.price);
      const discountPrice = Number(product.discountPrice);
      if (discountPrice < price && price > 0) {
        return Math.round(((price - discountPrice) / price) * 100);
      }
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to add a new product to your store.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Image Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Product Images
              </label>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Upload */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="imageUpload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <FaUpload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium">
                        Click to upload product image
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        PNG, JPG, WebP up to 5MB
                      </p>
                    </label>
                  </div>

                  {/* Or URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={product.image}
                      onChange={handleChange}
                      placeholder="https://example.com/product-image.jpg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Image Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="border border-gray-200 rounded-xl p-4 h-full">
                    {imagePreview || product.image ? (
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={imagePreview || product.image}
                          alt="Product preview"
                          className="w-full h-full object-contain"
                        />
                        {uploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <FaSpinner className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-square flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                        <FaImage className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No image selected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={product.brand}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  name="sku"
                  value={product.sku}
                  onChange={handleChange}
                  placeholder="Will be auto-generated if empty"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="clothing">Clothing</option>
                  <option value="electronics">Electronics</option>
                  <option value="home">Home & Kitchen</option>
                  <option value="sports">Sports & Outdoors</option>
                  <option value="beauty">Beauty & Personal Care</option>
                  <option value="toys">Toys & Games</option>
                  <option value="books">Books & Media</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Price and Discount */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="discountPrice"
                      value={product.discountPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {calculateDiscountPercentage() > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      {calculateDiscountPercentage()}% discount applied
                    </p>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  placeholder="Enter available quantity"
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {product.stock && (
                  <p
                    className={`text-sm mt-2 ${
                      Number(product.stock) > 10
                        ? "text-green-600"
                        : Number(product.stock) > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {Number(product.stock) > 10
                      ? "Good stock level"
                      : Number(product.stock) > 0
                      ? "Low stock alert"
                      : "Out of stock"}
                  </p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={product.tags}
                  onChange={handleChange}
                  placeholder="e.g., cotton, premium, summer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate tags with commas
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description *
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Describe your product in detail..."
                rows="6"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Describe features, specifications, and benefits
              </p>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 mb-4">
                Product Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium truncate">
                    {product.name || "Not provided"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{product.category || "Not set"}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Stock</p>
                  <p
                    className={`font-medium ${
                      Number(product.stock) > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock || 0} units
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || uploading ? (
                  <>
                    <FaSpinner className="w-5 h-5 mr-2 animate-spin" />
                    {uploading ? "Uploading Image..." : "Adding Product..."}
                  </>
                ) : (
                  <>
                    <FaCheck className="w-5 h-5 mr-2" />
                    Add Product
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard/manager/products")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <FaTimes className="w-5 h-5 mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-semibold text-yellow-800 mb-3">
            💡 Tips for Adding Products
          </h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Use high-quality images with white background for best results
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Provide detailed descriptions including materials, dimensions, and
              care instructions
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Set realistic stock levels to avoid overselling
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Use relevant tags to help customers find your products
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
