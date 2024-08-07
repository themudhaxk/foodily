import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice.js";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice.js";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu.jsx";

const ProductUpdate = () => {
  const params = useParams();

  const { data: productData, refetch } = useGetProductByIdQuery(params._id);

  const [images, setImages] = useState(productData?.images || []);
  const [name, setName] = useState(productData?.name || "");
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [stock, setStock] = useState(productData?.countInStock) || "5";

  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const navigate = useNavigate();

  const { data: categories = [] } = useFetchCategoriesQuery();
  //const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData?.name);
      setPrice(productData?.price);
      setCategory(productData?.categories?.category);
      setQuantity(productData?.quantity);
      setOldImages(productData?.images);
      setStock(productData?.countInStock);
    }
  }, [productData]);

  //uploadProductImage;



  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("countInStock", 5);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const { data } = await updateProduct({ productId: params._id, formData });

      if (data.error) {
        toast.error("Product update failed. Try Again.");
      } else {
        toast.success("Product successfully updated");
        navigate("/admin/allproductslist");
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Product update failed. Try Again.");
    }
  };

  const handleDelete = async () => {
    try {
      let alert = window.confirm(
        "Are you sure you want to delete this product?"
      );

      if (!alert) return;

      const { data } = await deleteProduct(params._id);
      toast.success("Product deleted successfully");
      navigate("/admin/allproductslist");
    } catch (error) {
      console.error(error);
      toast.error("Product delete failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);

    setImagesPreview([]);
    setImages([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
      <div className="col-12 col-md-2 mt-4">
					{/* <Sidebar /> */}
				</div>
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12">
            <span className="text-black text-2xl font-bold">Update Product</span>
            
            {/* {image && (
              <div className='text-center'>
                <img 
                  src={image} 
                  alt="product" 
                  className='block mx-auto max-h-[200px]' 
                />
              </div>
            )} */}
            <div>
            {oldImages &&
              oldImages.map((img) => (
                <img
                  key={img}
                  src={img.url}
                  alt={img.url}
                  className="mt-3 mr-2 inline-flex text-white"
                  width="150"
                  height=""
                />
              ))}
              </div>
              <div>
            {imagesPreview.map((img) => (
              <img
                src={img}
                key={img}
                alt="Images Preview"
                className="mt-3 mr-2 inline-flex"
                width="150"
                height=""
              />
            ))}
            </div>
            <div className="mb-3">
              <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                {images ? images.name : "Upload Image"}

                <input
                  type="file"
                  name="image"
                  accept="image/"
                  onChange={uploadFileHandler}
                  className={!images ? "hidden" : "text-white"}
                  multiple
                />
              </label>
            </div>
            <div className="p-3">
              <div className="flex flex-wrap">
                <div className="one">
                  <label className="text-black text-2xl font-bold" htmlFor="name">Name </label>
                  <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black text-2xl font-bold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="two">
                  <label className="text-black text-2xl font-bold" htmlFor="name block">Price </label>
                  <br />
                  <input
                    type="number"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black text-2xl font-bold"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="one">
                  <label className="text-black text-2xl font-bold" htmlFor="name block">Quantity </label>
                  <br />
                  <input
                    type="number"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black text-2xl font-bold"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="two">
                <label className="text-black text-2xl font-bold" htmlFor="name block">Category</label>
                  <br />
                  <select
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black text-2xl"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  </div>
              </div>
              <div className="">
                <button
                  onClick={handleUpdate}
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700 mr-6"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
