import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  // useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
// import AdminMenu from "./AdminMenu";
import { FiUploadCloud } from "react-icons/fi";

const ProductList = () => {
  // const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  // const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  // const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stock, setStock] = useState("");
  // const [imageUrl, setImageUrl] = useState(null);
  // const [imageUrls, setImageUrls] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const navigate = useNavigate();

  // const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct, { isError }] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleImageChange = (e) => {
    const files = e.target.files;
    const selectedImages = Array.from(files); //.slice(0, 6); // Limit to 6 images

    setImagesPreview([]);
    setImages([]);

    selectedImages.forEach((file) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const { data } = await createProduct(formData);

      if (!isError) {
        toast.success("Product created successfully");
        // setName("");
        // setBrand("");
        // setQuantity("");
        // setPrice("");
        // setStock("");
        // setDescription("");
        // setCategory("");
        // setImages([]); // Clear selected images
      } else {
        toast.error("Product creation failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the product.");
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/4 p-3">
          <div className="h-12 text-black text-2xl font-bold">
            <span className="text-3xl font-bold">Create Product</span>
            {/* <form onSubmit={handleSubmit} encType="multipart/form-data"> */}
            <div className="mt-[3rem]">
              {/* {imageUrls.length > 0 &&
                imageUrls.map((url, index) => (
                  <div key={index} className="inline-flex m-2">
                    <img
                      src={url}
                      alt={`product ${index + 1}`}
                      className="mx-auto max-h-[200px]"
                    />
                  </div>
                ))} */}
              {imagesPreview.map((img) => (
                <img
                  src={img}
                  key={img}
                  alt="Images Preview"
                  className="inline-flex m-2"
                  width="150"
                  height=""
                />
              ))}
            </div>
            {/* <AdminMenu /> */}
            <div className="mb-3 flex items-center justify-center">
              <label className="border text-black px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 flex items-center justify-center">
                <span>
                  {!images.length > 0 ? "Upload Images" : "Choose Images"}
                </span>
                <FiUploadCloud className="ml-2" />

                <input
                  type="file"
                  name="images"
                  accept="image/"
                  multiple
                  onChange={handleImageChange}
                  className={!images.length ? "hidden" : "text-black"}
                />
              </label>
            </div>

            <div className="p-3">
              <div className="flex flex-wrap">
                <div className="one">
                  <label className="text-black" htmlFor="name">
                    Name{" "}
                  </label>
                  <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="two ml-0 lg:ml-2">
                  <label className="text-black" htmlFor="name block">
                    Price{" "}
                  </label>
                  <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black "
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="one">
                  <label className="text-black" htmlFor="name block">
                    Quantity{" "}
                  </label>
                  <br />
                  <input
                    type="number"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="two ml-0 lg:ml-2">
                  <div className="ml-0 md:ml-4">
                    {" "}
                    {/* Margin left 0, margin left 4 on md */}
                    <label className="text-black" htmlFor="name block">
                      Category
                    </label>
                    <br />
                    <select
                      className="p-4 w-[30rem] border rounded-lg bg-white text-black"
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
                  {/* <label className="text-black" htmlFor="name block">
                      Brand{" "}
                    </label>
                    <br />
                    <input
                      type="text"
                      className="p-4 mb-3 w-[30rem] border rounded-lg bg-white text-black"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    /> */}
                </div>
              </div>
              {/* <label htmlFor="" className="my-5 text-black">
                  Description
                </label>
                <textarea
                  type="text"
                  className="p-2 mb-3 bg-white border rounded-lg w-[95%] text-black"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea> */}

              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="mb-4 md:mb-0">
                  {" "}
                  {/* Margin bottom, no margin on md */}
                  {/* <label className="text-black" htmlFor="name block">
                      Count In Stock
                    </label> */}
                  <br />
                  <input
                    type="hidden"
                    className="p-4 border w-[30rem] rounded-lg bg-white text-black"
                    value="5"
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>
              <button
                // type="submit"
                onClick={handleSubmit}
                className="text-white py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700"
              >
                Submit
              </button>
            </div>
            {/* </form> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
