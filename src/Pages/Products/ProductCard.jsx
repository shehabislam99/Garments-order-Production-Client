import { Link } from "react-router-dom";
import Card from "../../Components/Common/UI/Card";


const ProductCard = ({ product }) => {
  const { _id, product_name, images, category, price, available_quantity } =
    product;

  return (
    <Card hover className="flex gap-8 h-full">
      <div className="w-48 h-48 overflow-hidden rounded-4xl">
        <img
          src={images}
          alt={product_name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold line-clamp-1 mb-4">{product_name}</h3>
        <span
          className={`text-sm font-medium px-2 py-1 rounded ${
            available_quantity > 0
              ? "bg-green-100 rounded-4xl text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {available_quantity > 0
            ? `${available_quantity} in stock`
            : "Out of stock"}
        </span>

        <div className="flex justify-between items-center mt-4">
          <span
            className="text-xl font-bold  px-2 py-1 text-indigo-600
           rounded-4xl bg-purple-100"
          >
            {category}
          </span>
          <span
            className="text-xl font-bold  px-2 py-1 text-amber-600
           rounded-4xl bg-amber-100"
          >
            ${price}
          </span>
        </div>
        <div className="mt-5">
          <Link
            to={`/products/${_id}`}
            className="block w-full text-center px-4 py-2 rounded-4xl bg-indigo-600 text-white font-medium hover:bg-red-800 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
