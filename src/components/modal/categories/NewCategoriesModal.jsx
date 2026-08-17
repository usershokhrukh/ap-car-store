import {useRouter} from "next/navigation";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useNotify} from "@/hooks/useNotify";
import {GeneralModal} from "@/context/GeneralModal";
import { usePostCategories } from "@/hooks/category/PostCategories";

const NewCategoriesModal = () => {
  const route = useRouter();
  const {notice} = useNotify();
  const [input, setInput] = useState({
    name: "",
    description: "",
  });
  const handleInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: Number(e.target.value) || e.target.value,
    });
  };

  const {
    mutate,
    data: postData,
    error: postError,
    isPending: postPending,
  } = usePostCategories();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.name || !input.description)
      return notice({
        text: "Please choose and fill all inputs!",
        status: "error",
        time: 5000,
      });
    try {
      notice({
        text: "Adding...",
        status: "info",
        time: "infinite",
      });
      mutate(input);
    } catch (error) {
      route.refresh();
    }
  };

  const {setCloseModal} = useContext(GeneralModal);
  useEffect(() => {
    if (postError?.message) {
      notice({
        text: postError?.message,
        time: "infinite",
        status: "error",
        close: "true",
      });
      route.refresh();
    }
  }, [postError]);

  useEffect(() => {
    if (postData?.success && !postError?.message && !postPending) {
      notice({
        text: postData?.message || "Qo'shildi",
        time: 5000,
        status: "success",
      });
      setCloseModal(false);
    }
  }, [postData, postError, postPending]);

  return (
    <form onSubmit={handleSubmit} className="modal__form">
      <input
        onChange={handleInput}
        className="modal__inputs"
        placeholder="Name"
        name="name"
        type="text"
      />
      <textarea
        onChange={handleInput}
        className="modal__inputs modal__textarea"
        placeholder="Description"
        name="description"
        id=""
      ></textarea>
      <button
        style={{
          opacity: `${postPending ? "0.5" : "1"}`,
        }}
        disabled={postPending}
        className="modal__submit"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default NewCategoriesModal;
