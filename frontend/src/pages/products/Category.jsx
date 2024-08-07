import { Link } from "react-router-dom";
// import HeartIcon from "./HeartIcon";

const Category = ({ category }) => {

  // const formattedPrice = category.price.toLocaleString(); // Format price with commas

  return (
    <div className="w-[30rem] ml-[2rem] p-3 relative">
      <div className="relative">
      {/* <HeartIcon category={category} /> */}
      <Link to={`/category/${category._id}`}>
      
        <img
          src={category.images[0]?.url}
          alt={category.name}
          className="w-[30rem] rounded"
        />
        
      

      <div className="p-4">
        
          <h2 className="flex justify-center items-center">
            <div className="text-2xl font-bold text-black">{category.name}</div>
            {/* <span className="bg-black text-white text-lg font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-green-300">
              ₦{formattedPrice}
            </span> */}
          </h2>
        </div>
        </Link>
      </div>
    </div>
  );
};

export default Category;
