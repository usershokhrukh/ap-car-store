import {GeneralModal} from "@/context/GeneralModal";
import {useNotify} from "@/hooks/useNotify";
import React, {useContext, useEffect, useState} from "react";
import { useAddAdmin } from "@/hooks/admins/AddAdmins";

const NewAdminsModal = () => {
  const {notice} = useNotify();
  const {
    data: addAdmin,
    error: addAdminError,
    isPending: addAdminPending,
    mutate,
  } = useAddAdmin();
  const [input, setInput] = useState({
    login: "",
    fullName: "",
    password: "",
  });
  const handleInputs = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!addAdminPending) {
      if (!input?.fullName || !input?.login || !input?.password)
        return notice({
          text: "Fill all inputs!",
          status: "error",
          time: 3000,
        });
      mutate(input);
      notice({
        text: "Adding...",
        time: "infinite",
        status: "info",
      });
    }
  };

  const {setCloseModal} = useContext(GeneralModal);
  useEffect(() => {
    if (addAdmin?.success) {
      notice({
        text: addAdmin?.message,
        time: 5000,
        status: "success",
        close: true,
      });
      setCloseModal(false);
    }
  }, [addAdmin]);

  useEffect(() => {
    if (addAdminError?.message) {
      notice({
        text: addAdminError?.message,
        time: "infinite",
        status: "error",
        close: "true",
      });
      // route.refresh();
    }
  }, [addAdminError]);

  return (
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

      <input
        onChange={handleInputs}
        className="modal__inputs"
        placeholder="Password"
        name="password"
        type="text"
        value={input?.password}
      />
      <button
        style={{
          opacity: `${addAdminPending ? "0.5" : "1"}`,
        }}
        disabled={addAdminPending}
        className="modal__submit"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default NewAdminsModal;
