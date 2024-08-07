import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {

  const formattedPrice = product.price.toLocaleString(); // Format price with commas

  return (
    <div className="w-[30rem] ml-[2rem] p-3 relative">
      <div className="relative">
      <HeartIcon product={product} />
      <Link to={`/product/${product._id}`}>
      
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-[30rem] rounded"
        />
      <div className="p-4">
        
          <h2 className="flex justify-between items-center">
            <div className="text-lg text-black">{product.name}</div>
            <span className="bg-green-500 text-white text-lg font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-green-300">
              ₦{formattedPrice}
            </span>
          </h2>
        </div>
        </Link>
      </div>
    </div>
  );
};

export default Product;
