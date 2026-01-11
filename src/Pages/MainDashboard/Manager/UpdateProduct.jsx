import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { FaUpload, FaTimes, FaSpinner, FaCheck } from "react-icons/fa";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [product, setProduct] = useState({
    product_name: "",
    category: "",
    price: "",
    available_quantity: "",
    moq: "",
    payment_Options: "",
    demo_video_link: "",
    description: "",
    show_on_homepage: false,
  });

  useEffect(() => {
    if (id) {
      fetchProductById();
    }
  }, [id]);

  const fetchProductById = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(`/products/${id}`);
      const productData = res.data.data;
      setProduct({
        product_name: productData.product_name,
        category: productData.category,
        price: productData.price,
        available_quantity: productData.available_quantity,
        moq: productData.moq,
        payment_Options: productData.payment_Options,
        demo_video_link: productData.demo_video_link,
        description: productData.description,
        show_on_homepage: productData.show_on_homepage || false,
      });

      if (productData.images && Array.isArray(productData.images)) {
        setExistingImages(productData.images);
        setImagePreviews(productData.images);
      }
    } catch (error) {
      toast.error("Failed to load product", {
        position: "top-center",
        autoClose: 2000,
      });
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

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
      toast.error("Please select valid image files (JPEG, PNG, WebP only)", {
        position: "top-center",
        autoClose: 2000,
      });
      e.target.value = "";
      return;
    }

    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);

    newImages.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(() => {
          const newPreviews = [...existingImages];
          newPreviews[existingImages.length + index] = reader.result;
          return newPreviews.filter((preview) => preview);
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      const newExistingImages = existingImages.filter((_, i) => i !== index);
      setExistingImages(newExistingImages);
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingImages.length;
      const newImages = images.filter((_, i) => i !== newIndex);
      setImages(newImages);
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
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
      toast.error("Image upload failed", {
        position: "top-center",
        autoClose: 2000,
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrls = [...existingImages];
    if (images.length > 0) {
      const uploadedImages = await uploadImagesToImgBB(images);
      if (uploadedImages.length === 0) {
        setLoading(false);
        return;
      }
      imageUrls = [...existingImages, ...uploadedImages];
    }

    const productData = {
      ...product,
      price: Number(product.price),
      available_quantity: Number(product.available_quantity),
      moq: Number(product.moq),
      images: imageUrls,
      show_on_homepage: Boolean(product.show_on_homepage),
    };

    try {
      await axiosSecure.put(`/products/${id}`, productData);
      toast.success("Product updated successfully", {
        position: "top-center",
        autoClose: 2000,
      });
      navigate("/all-products");
    } catch (error) {
      toast.error("Failed to update product");
      console.error(
        "Update error:",
        {
          position: "top-center",
          autoClose: 2000,
        },
        error
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

  const paymentOptionsList = ["Cash on Delivery", "Stripe"];

  if (loading && !product.product_name) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Update Product</h1>
          <p className="mt-2">Modify the form below to update your product</p>
        </div>

        <div className="p-6 rounded-4xl bg-amber-100 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="ml-3 text-sm text-gray-700 font-medium block">
                  Product Name
                </label>
                <input
                  type="text"
                  name="product_name"
                  value={product.product_name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="w-full pl-4 pr-4 py-3 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="ml-3 text-sm text-gray-700 font-medium block">
                  Category
                </label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                  className="w-full pl-4 pr-4 py-3 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
              <div>
                <label className="ml-3 text-sm text-gray-700 font-medium block">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full pl-4 pr-4 py-3 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="ml-3 text-sm text-gray-700 font-medium block">
                  Available Quantity
                </label>
                <input
                  type="number"
                  name="available_quantity"
                  value={product.available_quantity}
                  onChange={handleChange}
                  placeholder="Enter available quantity"
                  min="0"
                  required
                  className="w-full pl-4 pr-4 py-3 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label className="ml-3 text-sm text-gray-700 font-medium block">
                  Minimum Order Quantity (MOQ)
                </label>
                <input
                  type="number"
                  name="moq"
                  value={product.moq}
                  onChange={handleChange}
                  placeholder="Minimum 100"
                  min="100"
                  required
                  className="w-full pl-4 pr-4 py-3 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label className="ml-3 text-sm text-gray-700 font-medium block">
                  Payment Options
                </label>
                <select
                  name="payment_Options"
                  value={product.payment_Options}
                  onChange={handleChange}
                  required
                  className="w-full pl-4 pr-4 py-3 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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

              <div className="md:col-span-2">
                <label className="ml-3 text-sm text-gray-700 font-medium block">
                  Product Demo Video Link (Optional)
                </label>
                <input
                  type="url"
                  name="demo_video_link"
                  value={product.demo_video_link}
                  onChange={handleChange}
                  placeholder="https://example.com/video.mp4"
                  className="w-full pl-4 pr-4 py-3 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
            </div>
            <div>
              <label className="ml-3 text-sm text-gray-700 font-medium block">
                Product Images
              </label>
              <div className="border border-gray-300 rounded-full bg-white text-center hover:border-blue-400 transition-colors">
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
                  className="cursor-pointer text-gray-600 flex px-4 gap-1 py-3 justify-center items-center"
                >
                  <FaUpload className="w-4 h-4" />
                  <p>Click to upload additional product images</p>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <h3 className="ml-3 text-sm font-medium text-gray-700 mb-2">
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

            <div>
              <label className="ml-3 text-sm text-gray-700 font-medium block">
                Product Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Describe your product in detail..."
                rows="6"
                required
                className="w-full pl-4 pr-4 py-3 text-gray-800 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="show_on_homepage"
                name="show_on_homepage"
                checked={product.show_on_homepage}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="show_on_homepage" className="ml-3 text-gray-700">
                Show on Home Page
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading || uploading ? (
                  <>
                    <FaSpinner className="w-5 h-5 mr-2 animate-spin inline" />
                    {uploading ? "Uploading Images..." : "Updating Product..."}
                  </>
                ) : (
                  <>Update Product</>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
