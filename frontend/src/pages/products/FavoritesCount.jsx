import { useSelector } from "react-redux";

const FavoritesCount = () => {
    const favorites = useSelector((state) => state.favorites)
    const favoriteCount = favorites.length


  return (
    <div className="absolute left-2 top-8">
      {favoriteCount > 0 && (
        <span className="bg-red-500 text-white text-sm font-medium mr-2 px-2 py-0.5 rounded-full">
          {favoriteCount}
        </span>
      )}
    </div>
  )
}

export default FavoritesCount
