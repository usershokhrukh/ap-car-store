import {GeneralModal} from "@/context/GeneralModal";
import {useEditAdmin} from "@/hooks/admins/EditAdmin";
import {useGetOneAdmin} from "@/hooks/admins/GetAdminMe";
import {useNotify} from "@/hooks/useNotify";
import React, {useContext, useEffect, useState} from "react";
import CategoryEditFormSkeleton from "../categories/CategoryEditFormSkeleton";

const EditAdminsModal = ({id}) => {
  const {
    data: oneAdmin,
    error: oneAdminError,
    isPending: oneAdminPending,
  } = useGetOneAdmin(id);
  const {notice} = useNotify();
  const {
    data: editAdmin,
    error: editAdminError,
    isPending: editAdminPending,
    mutate,
  } = useEditAdmin();
  const [input, setInput] = useState({
    login: "",
    fullName: "",
  });
  const handleInputs = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (oneAdmin) {
      setInput({
        login: oneAdmin?.data?.login,
        fullName: oneAdmin?.data?.fullName,
      });
    }
  }, [oneAdmin]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editAdminPending) {
      if (!input?.fullName || !input?.login)
        return notice({
          text: "Fill all inputs!",
          status: "error",
          time: 3000,
        });
      mutate([id, input]);
      notice({
        text: "Editing...",
        time: "infinite",
        status: "info",
      });
    }
  };

  const {setCloseModal} = useContext(GeneralModal);
  useEffect(() => {
    if (editAdmin?.success) {
      notice({
        text: editAdmin?.message,
        time: 5000,
        status: "success",
        close: true,
      });
      setCloseModal(false);
    }
  }, [editAdmin]);

  useEffect(() => {
    if (oneAdminError?.message) {
      notice({
        text: oneAdminError?.message,
        time: "infinite",
        status: "error",
        close: "true",
      });
    }
  }, [oneAdminError]);
  useEffect(() => {
    if (editAdminError?.message) {
      notice({
        text: editAdminError?.message,
        time: "infinite",
        status: "error",
        close: "true",
      });
      // route.refresh();
    }
  }, [editAdminError]);

  return (
    <>
      {oneAdmin && !oneAdminPending ? (
        <>
          <form onSubmit={handleSubmit} className="modal__form">
            <input
              onChange={handleInputs}
              className="modal__inputs"
              placeholder="Login"
              name="login"
              type="text"
              value={input?.login}
            />
            <input
              onChange={handleInputs}
              className="modal__inputs"
              placeholder="Fullname"
              name="fullName"
              type="text"
              value={input?.fullName}
            />
            <button
              style={{
                opacity: `${editAdminPending ? "0.5" : "1"}`,
              }}
              disabled={editAdminPending}
              className="modal__submit"
              type="submit"
            >
              Submit
            </button>
          </form>
        </>
      ) : oneAdminPending ? (
        <>
          <form className="modal__form">
            <CategoryEditFormSkeleton />
          </form>
        </>
      ) : (
        <form className="modal__form">
          <p className="modal__title">Can not be found!</p>
          <button
            className="modal__submit"
            onClick={() => setCloseModal(false)}
          >
            Back to admins
          </button>
        </form>
      )}
    </>
  );
};

export default EditAdminsModal;
