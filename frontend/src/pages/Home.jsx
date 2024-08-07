import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
// import Header from "../components/Header"
import Message from "../components/Message";
import Product from "./products/Product";
import Category from "./products/Category";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import bannerImg from "../assets/banner.png";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  const { data: cdata } = useFetchCategoriesQuery();

  return (
    <>
      {/* {!keyword ? <Header /> : null} */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-center items-center text-center">
            <img src={bannerImg} alt="register" className="w-[40%]" />
          </div>
          <div className="flex justify-between items-center">
            <h2 className="ml-[17rem] text-black mt-[10rem] text-5xl xl:text-[5rem] lg:text-4xl md:text-3xl min-[0px]:text-xl xl:ml-[20rem] lg:ml-[15rem] md:ml-[15rem] min-[0px]:ml-[15rem]">
              Food Categories
            </h2>
          </div>
          <div className="flex justify-center flex-wrap mt-[2rem]">
            {cdata?.map((category) => (
              <div key={category._id}>
                <Category category={category} />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <h1 className="ml-[17rem] text-black mt-[10rem] text-5xl xl:text-[5rem] lg:text-4xl md:text-3xl min-[0px]:text-xl xl:ml-[20rem] lg:ml-[15rem] md:ml-[15rem] min-[0px]:ml-[15rem]">
              Special Foods
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[20rem] xl:mr-[25rem] lg:mr-[20rem] md:mr-[15rem] min-[0px]:ml-[5rem] mt-[10rem]"
            >
              Explore More
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
