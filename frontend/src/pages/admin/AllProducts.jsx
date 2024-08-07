import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import { useEffect } from "react";

const AllProducts = () => {
  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  if (products) {
    console.log(products);
  }

  return (
    <div className="container ml-2">
      <div className="flex flex-col md:flex-row">
        <div className="p-3">
          <div className="ml-[2rem] text-xl font-bold h-12 text-black">
            All Products ({products?.length})
          </div>

          <div className="flex flex-wrap justify-around items-center">
            {products?.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="block mb-4 overflow-hidden"
              >
                <div className="flex">
                  <img
                    src={product?.images[0]?.url}
                    alt={product.name}
                    className="w- object-cover"
                    width="150"
                  />
                  <div className="p-4 flex flex-col justify-around">
                    <div className="flex justify-between">
                      <h1 className="text-xl font-semibold mb-2 text-black">
                        {product?.name}
                      </h1>
                      <p className="text-black text-sm ml-2">
                        {moment(product.createAt).format("MMMM Do YYYY")}
                      </p>
                    </div>
                    <p className="text-black xl:w-[30rem] lg:w-[20rem] md:w-[15rem] sm:w-[10rem] text-sm mb-4">
                      {product?.description?.substring(0, 150)}...
                    </p>
                    <div className="flex justify-between">
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                      >
                        Update Product
                        <svg
                          className="w-3.5 h-3.5 ml-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </Link>
                      <p className="text-pink-500 font-semibold ml-2">
                        ₦{product?.price}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="md:w1/4 p-3 mt-2">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
