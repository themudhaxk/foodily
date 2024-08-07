import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFavoriteProduct,
} from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";


const Favorites = () => {
    const favorites = useSelector(selectFavoriteProduct)
    //console.info(favorites)


  return (
    <div className="ml-[10rem]">
      <h1 className="text-lg text-black font-bold ml-[3rem] mt-[3rem]">
        Favorite Products
      </h1>
      <div className="flex flex-wrap">
        {favorites?.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Favorites;
