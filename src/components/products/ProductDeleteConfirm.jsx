"use client";

import {GeneralModal} from "@/context/GeneralModal";
import {useDeleteProduct} from "@/hooks/products/DeleteProduct";
import {useNotify} from "@/hooks/useNotify";
import {useRouter} from "next/navigation";
import React, {useContext, useEffect} from "react";

const ProductDeleteConfirm = ({id}) => {
  const route = useRouter();

  const {setCloseSpan} = useContext(GeneralModal);

  const {error, mutate, data, isPending} = useDeleteProduct();
  const {notice} = useNotify();

  useEffect(() => {
    if (error?.message) {
      notice({
        text: error?.message,
        status: "error",
        time: "infinite",
        close: true,
      });
      route.refresh();
    }
  }, [error]);

  useEffect(() => {
    if (data && !isPending && !error?.message) {
      notice({
        text: data?.message,
        time: 5000,
        status: "success",
      });
      route.push("/products");
    }
  }, [data, isPending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCloseSpan(false)
    notice({
      text: "Deleting...",
      status: "info",
      time: "infinite",
    });
    mutate(id);
  };
  return (
    <form onSubmit={handleSubmit} className="modal__form">
      {!isPending && !data?.success ? (
        <>
          <p className="modal__title">Are you sure to delete car?</p>
          <button
            type="submit"
            className="modal__f-delete-button products-view__mleft-buttons products-view__mleft-buttons-delete"
          >
            YES
          </button>
        </>
      ) : (
        <p className="modal__title">Loading...</p>
      )}
    </form>
  );
};

export default ProductDeleteConfirm;
