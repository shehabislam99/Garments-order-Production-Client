import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaUpload, FaTimes, FaSpinner, FaCheck } from "react-icons/fa";

const AddProduct = () => {
  const navigate = useNavigate();
  const AxiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [product, setProduct] = useState({
    product_name: "",
    description: "",
    category: "",
    price: "",
    available_quantity: "",
    moq: "100",
    demo_video_link: "",
    payment_Options: "",
    show_on_homepage: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

        return response.data.data.url;
      });

     return await Promise.all(uploadPromises);
   } catch {
     toast.error("Image upload failed");
     return [];
   } finally {
     setUploading(false);
   }
 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageFiles = await uploadImagesToImgBB(images);
    if (!imageFiles.length) {
      setLoading(false);
      return;
    }

    const productData = {
      ...product,
      price: Number(product.price),
      available_quantity: Number(product.available_quantity),
      moq: Number(product.moq),
      images: imageFiles,
      status: "pending",
      show_on_homepage: Boolean(product.show_on_homepage),
    };

    try {
      await AxiosSecure.post("/products", productData);
      toast.success("Product added successfully");
      navigate("/all-products");
    } catch {
      toast.error("Failed to add product");
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

  const paymentOptionsList = ["Cash on Delivery", "PayFirst"];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">
            Fill in the form below to add your a new product
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={product?.product_name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Price ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={product?.price}
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
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    name="available_quantity"
                    value={product?.available_quantity}
                    onChange={handleChange}
                    placeholder="Enter available quantity"
                    min="0"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Minimum Order Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Minimum Order Quantity (MOQ){" "}
                  </label>
                  <input
                    type="number"
                    name="moq"
                    value={product.moq}
                    onChange={handleChange}
                    placeholder="Minimum 100"
                    min="100"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Payment Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Payment Options
                  </label>
                  <select
                    name="payment_Options"
                    value={product?.payment_Options}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="" disabled>
                      Select Payment Method
                    </option>
                    {paymentOptionsList.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Video Link */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Product Demo Video Link (Optional)
                </label>
                <input
                  type="url"
                  name="demo_video_link"
                  value={product?.demo_video_link}
                  onChange={handleChange}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Images Upload */}
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-800">
                  Product Images
                </h2>

                <div>
                  <div className="border border-gray-300 rounded-xl text-center hover:border-blue-400 transition-colors mb-6">
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
                      className="cursor-pointer text-gray-600 flex px-4 gap-1 py-3"
                    >
                      <FaUpload className="w-4 h-4 mt-1" />
                      <p>Click to upload product images from your device</p>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-800">
                        Image Previews
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

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={product?.description}
                  onChange={handleChange}
                  placeholder="Describe your product in detail..."
                  rows="6"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show_on_homepage"
                name="show_on_homepage"
                checked={product?.show_on_homepage}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="showOnHomePage" className="ml-3 text-gray-800">
                Show on Home Page
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
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
                onClick={() => navigate("/dashboard/manager")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <FaTimes className="w-5 h-5 mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
