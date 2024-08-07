//import { useState } from "react";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice"
import Loader from "./Loader";
import SmallProduct from "../pages/products/SmallProduct";
import ProductCarousel from "../pages/products/ProductCarousel"

const Header = () => {
    //const [search, setSearch] = useState("");
    //const [showSidebar, setShowSideBar] = useState(false);
    //const [dropDownOpen, setDropDownOpen] = useState(false);
    //const dispatch = useDispatch();
    //const {userInfo} = useSelector((state) => state.auth)
    const {data, isLoading, error} = useGetTopProductsQuery()

    console.info(data)

    if (isLoading) {
        return <Loader />
    }

    if (error) {
        return <h1 style={{"color": "red"}}>Error</h1>
    }
  return (
    <>
    {/* <ProductCarousel />
        <div className="flex justify-around">
            <div className="">
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                    {data.map((product) => (
                        <div key={product._id}>
                            <SmallProduct product={product} />
                        </div>
                    ))}
                </div>
            </div>
    </div> */}
    <div className="flex justify-around">
        <div className="flex justify-center items-center block sm:hidden">
          <div className="grid grid-cols-2">
            {data.map((product) => (
              <div key={product._id}>
                {/* <SmallProduct product={product} /> */}
              </div>
            ))}
          </div>
        </div>
        <ProductCarousel />
    </div>
</>
  )
}

export default Header
