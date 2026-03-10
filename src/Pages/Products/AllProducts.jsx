import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaRegPlayCircle, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../Hooks/useAxios";

const PAGE_SIZE = 8;

const ProductSkeleton = () => (
  <div className="min-h-[420px] overflow-hidden rounded-4xl border app-border app-surface">
    <div className="skeleton h-56 w-full" />
    <div className="space-y-3 p-4">
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
    <section className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto px-6">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-blue-600 font-medium">
            Our Collection
          </div>
          <h1 className="text-4xl font-bold lg:text-5xl">Explore Products</h1>
          <p className="mx-auto mt-3 max-w-3xl text-lg app-muted">
            Search, filter, and sort production-ready garments by business
            needs.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 rounded-4xl border app-border custom-bg p-5 shadow-md md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 app-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-4xl border app-border app-surface py-2 pl-9 pr-3"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-4xl border app-border app-surface px-3 py-2"
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
            className="w-full rounded-4xl border app-border app-surface px-3 py-2"
          >
            <option value="all">All Stock Levels</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock (&lt;=25)</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full rounded-4xl border app-border app-surface px-3 py-2"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-desc">Stock: High to Low</option>
          </select>
        </div>

        {loading ?
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        : <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {paginatedProducts.map((product) => (
                <motion.article
                  key={product?._id}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="group flex min-h-[420px] flex-col overflow-hidden rounded-4xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        product?.images?.[0] ||
                        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      }
                      alt={product?.product_name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-80">
                      {product?.demo_video_link && (
                        <a
                          href={product?.demo_video_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2"
                        >
                          <FaRegPlayCircle className="h-12 w-12 text-red-600" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="custom-bg flex flex-1 flex-col p-6">
                    <div className="mb-3 inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-600">
                      {product?.category || "General"}
                    </div>
                    <h3 className="mb-2 truncate text-xl font-bold">
                      {product?.product_name || "Product"}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                      {(
                        product?.description || "No description available."
                      ).substring(0, 70)}
                      ...
                    </p>
                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="rounded-4xl bg-violet-100 px-2 py-1 text-lg font-bold text-violet-700">
                          ${Number(product?.price || 0).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Stock: {product?.available_quantity || 0}
                        </span>
                      </div>
                      <Link
                        to={`/products/${product?._id}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 py-2 text-white font-semibold transition-all duration-300 hover:scale-105 hover:bg-red-800"
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
              <p className="py-10 text-center app-muted">
                No products found for the selected filters.
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                className="rounded-4xl border app-border px-4 py-2"
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
                  className={`rounded-4xl border app-border px-4 py-2 ${
                    page === index + 1 ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                type="button"
                className="rounded-4xl border app-border px-4 py-2"
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
