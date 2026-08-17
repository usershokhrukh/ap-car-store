import {useGetCategories} from "@/hooks/category/GetCategories";
import {useRouter} from "next/navigation";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useNotify} from "@/hooks/useNotify";
import {GeneralModal} from "@/context/GeneralModal";
import {useEditProducts} from "@/hooks/products/EditProduct";
import ProductFormSkeleton from "../ModalLoading";
import { useGetOneCategory } from "@/hooks/category/GetOneCategory";
import { useEditCategory } from "@/hooks/category/EditCategory";
import CategoryEditFormSkeleton from "./CategoryEditFormSkeleton";

const EditCategoriesModal = ({id: categoryId}) => {
  const {data, isPending, error} = useGetCategories();

  const {
    data: oneCategoryData,
    error: oneCategoryError,
    isPending: oneCategoryPending,
  } = useGetOneCategory(categoryId);
  const route = useRouter();
  const {notice} = useNotify();
  const [input, setInput] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (oneCategoryData) {
      setInput({
        name: oneCategoryData?.data?.name,
        description: oneCategoryData?.data?.description,
      });
    }
  }, [oneCategoryData]);

  const handleInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: Number(e.target.value) || e.target.value,
    });
  };

  useEffect(() => {
    if (error?.message) {
      notice({
        text: error?.message,
        time: "infinite",
        status: "error",
        close: " true",
      });
      route.refresh();
    }
  }, [error]);

  useEffect(() => {
    if (oneCategoryError?.message) {
      notice({
        text: oneCategoryError?.message,
        time: "infinite",
        status: "error",
        close: " true",
      });
      route.refresh();
    }
  }, [oneCategoryError]);


  const {
    mutate,
    data: editData,
    error: editError,
    isPending: editPending,
  } =useEditCategory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !input.name ||
      !input.description 
    )
      return notice({
        text: "Please choose and fill all inputs!",
        status: "error",
        time: 5000,
      });
    try {
      notice({
        text: "Editing...",
        status: "info",
        time: "infinite",
      });
      mutate([categoryId, input]);
    } catch (error) {
      route.refresh();
    }
  };

  const {setCloseModal} = useContext(GeneralModal);
  useEffect(() => {
    if (editError?.message) {
      notice({
        text: editError?.message,
        time: "infinite",
        status: "error",
        close: "true",
      });
      route.refresh();
    }
  }, [editError]);

  useEffect(() => {
    if (editData?.success && !editError?.message && !editPending) {
      notice({
        text: editData?.message || "O'zgartirildi!",
        time: 5000,
        status: "success",
      });
      setCloseModal(false);
    }
  }, [editData, editError, editPending]);

  return (
    <>
      {data && !isPending ? (
        <>
          <form onSubmit={handleSubmit} className="modal__form">
            <input
              onChange={handleInput}
              className="modal__inputs"
              placeholder="Name"
              name="name"
              type="text"
              value={input?.name}
            />
            <textarea
              onChange={handleInput}
              className="modal__inputs modal__textarea"
              placeholder="Description"
              name="description"
              id=""
              value={input?.description}
            ></textarea>
            <button
              style={{
                opacity: `${editPending ? "0.5" : "1"}`,
              }}
              disabled={editPending}
              className="modal__submit"
              type="submit"
            >
              Submit
            </button>
          </form>
        </>
      ) : isPending ? (
        <form className="modal__form">
          <CategoryEditFormSkeleton />
        </form>
      ) : (
        <>
          <form className="modal__form">
            <p className="modal__title">Can not be found!</p>
            <button
              className="modal__submit"
              onClick={() => route.push("/categories")}
            >
              Back to categories
            </button>
          </form>
        </>
      )}
    </>
  );
};

export default EditCategoriesModal;
