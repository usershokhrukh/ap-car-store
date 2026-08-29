"use client";

import {GeneralModal} from "@/context/GeneralModal";
import {useDeletePickupVideo} from "@/hooks/pickup/DELETE/DeletePickupVideo";
import {useNotify} from "@/hooks/useNotify";
import {useRouter} from "next/navigation";
import React, {useContext, useEffect} from "react";

const PickupVideoDeleteConfirm = ({id}) => {
  const route = useRouter();

  const {setCloseModal, setModalStopped} = useContext(GeneralModal);

  const {error, mutate, data, isPending} = useDeletePickupVideo();
  const {notice} = useNotify();

  useEffect(() => {
    if (error?.message) {
      notice({
        text: error?.message,
        status: "error",
        time: "infinite",
        close: true,
      });
      setModalStopped(false);
      setCloseModal(false);
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
      setTimeout(() => {
        setModalStopped(false);
        setCloseModal(false);
      }, 1000);
    }
  }, [data, isPending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setModalStopped(true);
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
          <p className="modal__title">Are you sure to delete video?</p>
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

export default PickupVideoDeleteConfirm;
