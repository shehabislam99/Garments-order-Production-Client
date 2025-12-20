import { Link } from "react-router-dom";
import Card from "../../Components/Common/UI/Card";
import { HiOutlineCurrencyDollar } from "react-icons/hi";


const ProductCard = ({ product }) => {
  const { _id, product_name, images, category, price,demo_video_link, available_quantity } =
    product;

  return (
    <Card className="flex gap-8 h-full">
      <div className="w-48 h-48 overflow-hidden rounded-4xl">
        <img
          src={images?.[0]}
          alt={product_name}
          className="w-full h-full object-cover"
        />
        <span>{demo_video_link}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-bold line-clamp-1 mb-4">{product_name}</h3>
        <div className="flex justify-between items-center my-4">
          <span
            className="text-sm font-bold  px-2 py-1 text-indigo-600
           rounded-4xl bg-purple-100"
          >
            {category}
          </span>
          <span
            className="text-sm font-bold flex gap-1 px-2 py-1 text-yellow-600
           rounded-4xl bg-yellow-100"
          >
            <HiOutlineCurrencyDollar className="mt-0.5 w-4 h-4" />
            <span >{price}</span>
          </span>
        </div>
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            available_quantity > 0
              ? "bg-green-100 rounded-4xl text-green-500"
              : "bg-red-100 text-red-500"
          }`}
        >
          {available_quantity > 0
            ? `${available_quantity} in stock`
            : "Out of stock"}
        </span>

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
