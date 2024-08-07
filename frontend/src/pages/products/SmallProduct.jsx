import { Link } from "react-router-dom"
import HeartIcon from "./HeartIcon"

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[20rem] ml-[2rem] p-3">
      <div className="relative">
      <HeartIcon product={product} />
      <Link to={`/product/${product._id}`}>
        <img 
            src={product.images[0]?.url} 
            alt={product.name} 
            className="h-auto rounded" 
        />
        

        <div className="p-54">
            
                <h2 className="flex justify-between items-center text-black">
                    <div>
                        {product.name}
                    </div>
                    <span className="bg-black text-white text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
                        ₦{product.price}
                    </span>
                </h2>
        </div>
        </Link>
      </div>
    </div>
  )
}

export default SmallProduct
