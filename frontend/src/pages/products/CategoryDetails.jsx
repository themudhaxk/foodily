import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useProductCategoryQuery,
  useReadCategoryQuery,
} from "../../redux/api/categoryApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import ProductCard from "./ProductCard";

const CategoryDetails = () => {
  const { id: categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: products,
    isLoading,
    refetch,
    error,
  } = useProductCategoryQuery(categoryId);
  const { data: category } = useReadCategoryQuery();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl text-black font-bold">
          Category: {category?.name}
        </h2>
        <Link
          to="/"
          className="text-red-500 hover:text-red-700 text-2xl transition duration-300 ease-in-out"
        >
          Go Back
        </Link>
      </div>
      {isLoading ? (
        <div className="flex justify-center mb-4">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          <div className="p-3">
            <h2 className="h4 text-center text-2xl text-black mb-2">
              {products?.length} Foods
            </h2>
            <div className="flex flex-wrap justify-center items-center">
              {products?.length === 0 ? (
                <Loader />
              ) : (
                products.map((p) => (
                  <div
                    className="flex mt-[2rem]"
                    key={p._id}
                  >
                    <div className="p-1.5">
                      <ProductCard p={p} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
