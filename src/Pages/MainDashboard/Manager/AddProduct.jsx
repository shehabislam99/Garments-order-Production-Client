import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaUpload,  FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import { axiosInstance } from "../../../Hooks/useAxios";
import useRole from "../../../Hooks/useRole";

const AddProduct = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [product, setProduct] = useState({
    product_name: "",
    description: "",
    category: "Shirt",
    price: "",
    available_quantity: "",
    moq: "1",
    video_link: "",
    payment_options: "Cash on Delivery",
    show_on_homepage: false,
  });

  // Check if user is manager
  if (role !== "manager") {
    navigate("/unauthorized", { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error("Please select valid image files (JPEG, PNG, WebP only)");
      e.target.value = "";
      return;
    }

    // Limit to 5 images
    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);

    // Create previews
    newImages.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => {
          const newPreviews = [...prev];
          newPreviews[index] = reader.result;
          return newPreviews;
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const uploadImagesToImgBB = async (files) => {
    try {
      setUploading(true);
      const uploadPromises = files.map(async (file) => {
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
          return response.data.data.url;
        } else {
          throw new Error("Failed to upload image");
        }
      });

      const imageUrls = await Promise.all(uploadPromises);
      toast.success(`${imageUrls.length} image(s) uploaded successfully!`);
      return imageUrls;
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload images. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!product.product_name.trim()) {
      errors.push("Product Name is required");
    }

    if (!product.description.trim()) {
      errors.push("Product Description is required");
    }

    if (!product.price || Number(product.price) <= 0) {
      errors.push("Valid Price is required");
    }

    if (!product.available_quantity || Number(product.available_quantity) < 0) {
      errors.push("Valid Available Quantity is required");
    }

    if (!product.moq || Number(product.moq) < 1) {
      errors.push("Minimum Order Quantity must be at least 1");
    }

    if (images.length === 0) {
      errors.push("At least one product image is required");
    }

    if (product.video_link && !isValidUrl(product.video_link)) {
      errors.push("Please enter a valid video URL");
    }

    return errors;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setLoading(true);

    try {
      // Upload images
      const imageUrls = await uploadImagesToImgBB(images);
      if (!imageUrls || imageUrls.length === 0) {
        setLoading(false);
        return;
      }

      // Generate tracking ID
      const generateTrackingId = () => {
        const prefix = "PRD";
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}-${date}-${random}`;
      };

      // Prepare product data
      const productData = {
        product_name: product.product_name,
        description: product.description,
        category: product.category,
        price: Number(product.price),
        available_quantity: Number(product.available_quantity),
        moq: Number(product.moq),
        video_link: product.video_link || "",
        payment_options: product.payment_options,
        show_on_homepage: product.show_on_homepage,
        images: imageUrls,
        main_image: imageUrls[0],
        tracking_id: generateTrackingId(),
        created_at: new Date().toISOString(),
        status: "pending",
        payment_status: "pending",
        delivery_status: "pending",
      };

      // Send to backend
      const response = await axiosInstance.post("/products", productData);

      if (response.data) {
        toast.success(
          "Product added successfully! It will appear in the All Products page."
        );

        // Reset form
        setProduct({
          product_name: "",
          description: "",
          category: "Shirt",
          price: "",
          available_quantity: "",
          moq: "1",
          video_link: "",
          payment_options: "Cash on Delivery",
          show_on_homepage: false,
        });
        setImages([]);
        setImagePreviews([]);

        // Navigate to all products page after success
        setTimeout(() => {
          navigate("/dashboard/manager/all-products");
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

  const categories = [
    "Shirt",
    "Pant",
    "Jacket",
    "Accessories",
    "Shoes",
    "T-Shirt",
    "Jeans",
    "Dress",
  ];
  const paymentOptions = ["Cash on Delivery",
     "Credit Card", 
     "Bank Transfer"];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">
            Fill in the form below to add a new product. Only Managers can
            access this page.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={product.product_name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) <span className="text-red-500">*</span>
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

                {/* Available Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="available_quantity"
                    value={product.available_quantity}
                    onChange={handleChange}
                    placeholder="Enter available quantity"
                    min="0"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Minimum Order Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Quantity (MOQ){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="moq"
                    value={product.moq}
                    onChange={handleChange}
                    placeholder="Minimum 1"
                    min="1"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Payment Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Options <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="payment_options"
                    value={product.payment_options}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {paymentOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Video Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demo Video Link (Optional)
                </label>
                <input
                  type="url"
                  name="video_link"
                  value={product.video_link}
                  onChange={handleChange}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Add a video demo of the product (YouTube, Vimeo, or direct
                  video link)
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description <span className="text-red-500">*</span>
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
              </div>
            </div>

            {/* Images Upload */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Product Images
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Upload Images <span className="text-red-500">*</span>
                  <span className="text-sm text-gray-500 ml-2">
                    (Maximum 5 images, first image will be main image)
                  </span>
                </label>

                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors mb-6">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                    className="hidden"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <FaUpload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">
                      Click to upload product images
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      JPEG, PNG, WebP supported (Max 5 images)
                    </p>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700">
                      Image Previews ({imagePreviews.length}/5)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={preview}
                              alt={`Product preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                Main
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Settings
              </h2>

              {/* Show on Home Page */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show_on_homepage"
                  name="show_on_homepage"
                  checked={product.show_on_homepage}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="showOnHomePage" className="ml-3 text-gray-700">
                  Show on Home Page
                </label>
                <span className="ml-2 text-sm text-gray-500">
                  (Product will appear on Home Page if checked)
                </span>
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
                    {uploading ? "Uploading Images..." : "Adding Product..."}
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
                onClick={() => navigate("/dashboard/manager/all-products")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <FaTimes className="w-5 h-5 mr-2" />
                Cancel
              </button>
            </div>

            {/* Required Fields Note */}
            <div className="text-sm text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
