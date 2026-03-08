import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaRegPlayCircle, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../Hooks/useAxios";

const PAGE_SIZE = 8;

const ProductSkeleton = () => (
  <div className="rounded-4xl border app-border app-surface overflow-hidden min-h-[420px]">
    <div className="skeleton h-56 w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="skeleton h-6 w-3/4 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-10 w-full rounded-4xl" />
    </div>
  </div>
);

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products");
        setProducts(response?.data?.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(
      products.map((item) => item?.category).filter(Boolean),
    );
    return ["all", ...Array.from(unique)];
  }, [products]);

  const processedProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let result = products.filter((product) => {
      const matchedSearch =
        !term ||
        product?.product_name?.toLowerCase().includes(term) ||
        product?.description?.toLowerCase().includes(term) ||
        product?.category?.toLowerCase().includes(term);

      const matchedCategory =
        category === "all" ||
        product?.category?.toLowerCase() === category.toLowerCase();

      const matchedStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" &&
          Number(product?.available_quantity) > 0) ||
        (stockFilter === "low-stock" &&
          Number(product?.available_quantity) > 0 &&
          Number(product?.available_quantity) <= 25);

      return matchedSearch && matchedCategory && matchedStock;
    });

    if (sortBy === "price-asc") {
      result = result.sort(
        (a, b) => Number(a?.price || 0) - Number(b?.price || 0),
      );
    } else if (sortBy === "price-desc") {
      result = result.sort(
        (a, b) => Number(b?.price || 0) - Number(a?.price || 0),
      );
    } else if (sortBy === "stock-desc") {
      result = result.sort(
        (a, b) =>
          Number(b?.available_quantity || 0) -
          Number(a?.available_quantity || 0),
      );
    } else {
      result = result.sort(
        (a, b) =>
          new Date(b?.createdAt || b?.updatedAt || 0) -
          new Date(a?.createdAt || a?.updatedAt || 0),
      );
    }

    return result;
  }, [products, searchTerm, category, stockFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(processedProducts.length / PAGE_SIZE),
  );
  const start = (page - 1) * PAGE_SIZE;
  const paginatedProducts = processedProducts.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, category, stockFilter, sortBy]);

  return (
    <section className="py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">Explore Products</h1>
          <p className="app-muted mt-2">
            Search, filter, and sort production-ready garments by business
            needs.
          </p>
        </div>

        <div className="custom-bg rounded-4xl border app-border p-4 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 app-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 rounded-4xl border app-border app-surface"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full px-3 py-2 rounded-4xl border app-border app-surface"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All Categories" : item}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            className="w-full px-3 py-2 rounded-4xl border app-border app-surface"
          >
            <option value="all">All Stock Levels</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock (&lt;=25)</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full px-3 py-2 rounded-4xl border app-border app-surface"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-desc">Stock: High to Low</option>
          </select>
        </div>

        {loading ?
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        : <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <motion.article
                  key={product?._id}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group bg-white rounded-4xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 min-h-[420px] flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        product?.images?.[0] ||
                        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      }
                      alt={product?.product_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                      {product?.demo_video_link && (
                        <a
                          href={product?.demo_video_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2"
                        >
                          <FaRegPlayCircle className="w-12 h-12 text-red-600" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-6 custom-bg flex flex-col flex-1">
                    <h3 className="text-xl font-bold   mb-2 truncate">
                      {product?.product_name || "Product"}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {(
                        product?.description || "No description available."
                      ).substring(0, 50)}
                      ...
                    </p>
                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-violet-700 bg-violet-100 px-2 py-1 rounded-4xl">
                          ${Number(product?.price || 0).toFixed(2)}
                        </span>
                        <span className="text-sm  text-gray-500">
                          Stock: {product?.available_quantity || 0}
                        </span>
                      </div>
                      <Link
                        to={`/products/${product?._id}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 rounded-full hover:bg-red-800 transform hover:scale-105 transition-all duration-300"
                      >
                        <FaEye />
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {paginatedProducts.length === 0 && (
              <p className="text-center py-10 app-muted">
                No products found for the selected filters.
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                className="px-3 py-2 rounded-4xl border app-border"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPage(index + 1)}
                  className={`px-3 py-2 rounded-4xl border app-border ${
                    page === index + 1 ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                type="button"
                className="px-3 py-2 rounded-4xl border app-border"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </button>
            </div>
          </>
        }
      </div>
    </section>
  );
};

export default AllProducts;
