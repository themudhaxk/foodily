import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useFetchCategoriesQuery,
  useRemoveCategoryMutation,
  useUpdateCategoryMutation,
} from "../../redux/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import Model from "../../components/Model";

import AdminMenu from "./AdminMenu";
import { FiUploadCloud } from "react-icons/fi";

const CategoryList = () => {
  const { data: categories, refetch } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [images, setImages] = useState([]); // Ensure this is used for image upload logic
  const [imagesPreview, setImagesPreview] = useState([]);
  const [imagesUpdatePreview, setImagesUpdatePreview] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState(categories?.name || "");
  const [updatingImages, setUpdatingImages] = useState(
    categories?.images || []
  ); // Ensure this is used for image upload logic
  const [modelVisible, setModelVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useRemoveCategoryMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (categories && categories._id) {
      setUpdatingName(categories?.name);
      setUpdatingImages(categories?.images);
    }
  }, [categories]);

  const handleCreateImageChange = (e) => {
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

    // if (files.length > 6) {
    //     toast.error("You can upload up to 6 images only");
    // }
  };

  const handleUpdateImageChange = (e) => {
    const files = e.target.files;
    const selectedImages = Array.from(files);

    setImagesUpdatePreview([]);
    let newImages = [];

    selectedImages.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesUpdatePreview((oldArray) => [...oldArray, reader.result]);
          newImages.push(reader.result);
        }
      };

      reader.readAsDataURL(file);
    });

    setUpdatingImages(newImages);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name || !images) {
      toast.error("Category name and image are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("images", images);

      const { data } = await createCategory(formData);

      if (data.error) {
        toast.error(data.error);
      } else {
        setName("");
        setImages([]);
        toast.success(`${data.category.name} is created`);
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName || !updatingImages) {
      toast.error("Category name and image are required");
      return;
    }

    if (!selectedCategory) {
      toast.error("No category selected");
      return;
    }

    try {
      // Update the images field with updatingImages
      const updatedCategory = new FormData();
      updatedCategory.append("name", updatingName);
      updatedCategory.append("images", updatingImages);

      // Update the category
      const { result } = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory,
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setUpdatingImages([]);
        setModelVisible(false);
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Updating category failed, try again.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      // Add check for selectedCategory
      toast.error("No category selected");
      return;
    }

    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModelVisible(false);
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Category delection failed. Try again.");
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <AdminMenu />
      <div className="md:w-3/4 p-3">
        <div className="h-12 text-black">
          Manage Categories
          <div className="mt-[3rem]">
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
                onChange={handleCreateImageChange}
                className={!images.length ? "hidden" : "text-black"}
              />
            </label>
          </div>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
          />
          <br />
          <hr />
          <div className="flex flex-wrap">
            {categories?.map((category) => (
              <div key={category._id}>
                <button
                  className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  onClick={() => {
                    {
                      setModelVisible(true);
                      setSelectedCategory(category);
                      setUpdatingName(category.name);
                      setUpdatingImages(category.images);
                    }
                  }}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>
          <Model
            className="text-center"
            isOpen={modelVisible}
            onClose={() => setModelVisible(false)}
          >
            <div className="mt-[3rem]">
              {imagesUpdatePreview.map((img) => (
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
              <label className="border text-black px-4 w-full text-center rounded-lg cursor-pointer font-bold py-11 flex items-center justify-center">
                <span>
                  {!images.length > 0 ? "Upload Images" : "Choose Images"}
                </span>
                <FiUploadCloud className="ml-2" />

                <input
                  type="file"
                  name="images"
                  accept="image/"
                  multiple
                  onChange={handleUpdateImageChange}
                  className={!images.length ? "hidden" : "text-black"}
                />
              </label>
            </div>
            <CategoryForm
              value={updatingName}
              setValue={(value) => setUpdatingName(value)}
              handleSubmit={handleUpdateCategory}
              buttonText="Update"
              handleDelete={handleDeleteCategory}
            />
          </Model>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
