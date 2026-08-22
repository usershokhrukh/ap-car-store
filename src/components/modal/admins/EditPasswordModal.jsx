import {GeneralModal} from "@/context/GeneralModal";
import {useNotify} from "@/hooks/useNotify";
import React, {useContext, useEffect, useState} from "react";
import {useEditAdminPassword} from "@/hooks/admins/EditAdminPassword";

const EditAdminsModalPassword = () => {
  const {notice} = useNotify();
  const {
    data: editAdmin,
    error: editAdminError,
    isPending: editAdminPending,
    mutate,
  } = useEditAdminPassword();
  const [input, setInput] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const handleInputs = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editAdminPending) {
      if (!input?.currentPassword || !input?.newPassword)
        return notice({
          text: "Fill all inputs!",
          status: "error",
          time: 3000,
        });
      mutate(input);
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
    if (editAdminError?.message) {
      notice({
        text: editAdminError?.message,
        time: "infinite",
        status: "error",
        close: "true",
      });
    }
  }, [editAdminError]);

  return (
    <form onSubmit={handleSubmit} className="modal__form">
      <input
        onChange={handleInputs}
        className="modal__inputs"
        placeholder="Current password"
        name="currentPassword"
        type="text"
        value={input?.currentPassword}
      />
      <input
        onChange={handleInputs}
        className="modal__inputs"
        placeholder="New password"
        name="newPassword"
        type="text"
        value={input?.newPassword}
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
  );
};

export default EditAdminsModalPassword;
