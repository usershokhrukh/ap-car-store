import {useGetCategories} from "@/hooks/category/GetCategories";
import {useRouter} from "next/navigation";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useNotify} from "@/hooks/useNotify";
import {usePostProducts} from "@/hooks/products/PostProducts";
import {GeneralModal} from "@/context/GeneralModal";
import {useGetPickup} from "@/hooks/pickup/GET/GetPickup";
import {ModalDropDown} from "@/context/ModalDropDown";

const NewProductsModal = () => {
  const {setCloseDrop, closeDrop, setCompDrop, compDrop, setPag} =
    useContext(ModalDropDown);
  const route = useRouter();
  const {notice} = useNotify();
  const [input, setInput] = useState({
    name: "",
    categoryId: null,
    description: "",
    price: 0,
    stock: 0,
    image: "",
    pickupPointId: "",
  });
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
      setCategoryValue("error");
      route.refresh();
    }
  }, [error]);

  // const dropRef = useRef(null);
  // const dropHeightRef = useRef(null);
  // const [dropDownPosition, setDropDownPosition] = useState("bottom");
  // useEffect(() => {
  //   if (!openCategory || !dropRef.current) return;
  //   const checkSpace = () => {
  //     const rect = dropRef?.current?.getBoundingClientRect();
  //     const viewPointHeight = window.innerHeight;
  //     const dropHeight = 250;
  //     if (viewPointHeight - rect?.bottom < dropHeight && rect?.top > dropHeight) {
  //       setDropDownPosition("top");
  //     } else {
  //       setDropDownPosition("bottom");
  //     }
  //   };
  //   checkSpace();
  //   window.addEventListener("scroll", checkSpace);
  //   window.addEventListener("resize", checkSpace);

  //   return () => {
  //     window.addEventListener("scroll", checkSpace);
  //     window.addEventListener("resize", checkSpace);
  //   };
  // }, [openCategory]);

  // const [openPickUp, setOpenPickUp] = useState(false);
  // const dropRefPickUp = useRef(null);
  // const dropHeightRefPickUp = useRef(null);
  // const [dropDownPositionPickUp, setDropDownPositionPickUp] =
  //   useState("bottom");
  // useEffect(() => {
  //   if (!openPickUp || !dropRefPickUp.current) return;
  //   const checkSpace = () => {
  //     const rect = dropRefPickUp.current?.getBoundingClientRect();
  //     const viewPointHeight = window.innerHeight;
  //     const dropHeight = 250;
  //     if (viewPointHeight - rect?.bottom < dropHeight && rect?.top > dropHeight) {
  //       setDropDownPositionPickUp("top");
  //     } else {
  //       setDropDownPositionPickUp("bottom");
  //     }
  //   };
  //   checkSpace();
  //   window.addEventListener("scroll", checkSpace);
  //   window.addEventListener("resize", checkSpace);

  //   return () => {
  //     window.addEventListener("scroll", checkSpace);
  //     window.addEventListener("resize", checkSpace);
  //   };
  // }, [openPickUp]);

  const [categoryValue, setCategoryValue] = useState("");
  const [pickUpValue, setPickUpValue] = useState("");
  useEffect(() => {
    setCloseDrop(false);
  }, [pickUpValue]);
  useEffect(() => {
    setCloseDrop(false);
  }, [categoryValue]);
  const [categoriesPage, setCategoriesPage] = useState(null);
  const {data, isPending, error} = useGetCategories(
    `?isActive=true&limit=10${categoriesPage ? `&page=${categoriesPage}` : ""}`,
  );
  const [pickUpPage, setPickUpPage] = useState(null);
  const {
    data: pickUpData,
    error: pickUpError,
    isPending: pickUpPending,
  } = useGetPickup(`?limit=10${pickUpPage ? `&page=${pickUpPage}` : ""} `);

  useEffect(() => {
    if (pickUpError?.message) {
      notice({
        text: pickUpError?.message || "Could not get pickup points!",
        time: 3000,
        status: "error",
      });
      setPickUpValue("error");
    }
  }, [pickUpError]);

  const {
    mutate,
    data: postData,
    error: postError,
    isPending: postPending,
  } = usePostProducts();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !input.name ||
      !input.description ||
      !input.image ||
      !input.categoryId ||
      !input.stock ||
      !input.price
    )
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

  useEffect(() => {
    if (data && !closeDrop) {
      setCategoryValue(null);
    }
    if (pickUpData && !closeDrop) {
      setPickUpValue(null);
    }
  }, [data, pickUpData]);

  useEffect(() => {
    if (!data && !closeDrop) {
      setCategoryValue("loading...");
    }
    if (!pickUpData && !closeDrop) {
      setPickUpValue("loading...");
    }
  }, [data, pickUpData]);

  useEffect(() => {
    if (!data && closeDrop) {
      setCompDrop(
        <>
          {compDrop}
          <span className="modal__drop-b-pag-total">loading...</span>
        </>,
      );
    }
  }, [data]);

  useEffect(() => {
    if (!pickUpData && closeDrop) {
      setCompDrop(
        <>
          {compDrop}
          <span className="modal__drop-b-pag-total">loading...</span>
        </>,
      );
    }
  }, [pickUpData]);

  useEffect(() => {
    if (data) {
      setCategoriesPage(data?.data?.meta?.page || 1);
      setCompDrop(
        <>
          <span className={`products__b-pag-filter-options`}>
            {data?.data?.items?.map(({id, name}) => (
              <span
                key={id}
                onClick={() => {
                  setInput({
                    ...input,
                    categoryId: id,
                  });
                  setCategoryValue(name);
                  setCloseDrop(false);
                }}
                className="products__b-pag-filter-option"
              >
                {name}
              </span>
            ))}
          </span>
        </>,
      );
      setPag(
        <>
          <div className="modal__drop-bottom-pag">
            <span
              onClick={() => {
                if (data?.data?.meta?.page - 1 > 0) {
                  setCategoriesPage(data?.data?.meta?.page - 1);
                }
              }}
              className="modal__drop-b-pag-span"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 12L14 6V18L8 12Z"></path>
              </svg>
            </span>

            <span className="modal__drop-b-pag-total">
              {data?.data?.meta?.page}/{data?.data?.meta?.totalPages}
            </span>

            <span
              onClick={() => {
                if (
                  data?.data?.meta?.page + 1 <=
                  data?.data?.meta?.totalPages
                ) {
                  setCategoriesPage(data?.data?.meta?.page + 1);
                }
              }}
              className="modal__drop-b-pag-span"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 12L10 18V6L16 12Z"></path>
              </svg>
            </span>
          </div>
        </>,
      );
    }
  }, [data]);

  useEffect(() => {
    if (pickUpData) {
      setPickUpPage(pickUpData?.data?.meta?.page || 1);
      setCompDrop(
        <>
          <span className={`products__b-pag-filter-options`}>
            <span
              onClick={() => {
                setInput({
                  ...input,
                  pickupPointId: null,
                });
                setPickUpValue(null);
                setCloseDrop(false);
              }}
              className="products__b-pag-filter-option"
            >
              --
            </span>
            {pickUpData?.data?.items?.map(({id, name}) => (
              <span
                key={id}
                onClick={() => {
                  setInput({
                    ...input,
                    categoryId: id,
                  });
                  setPickUpValue(name);
                  setCloseDrop(false);
                }}
                className="products__b-pag-filter-option"
              >
                {name}
              </span>
            ))}
          </span>
        </>,
      );
      setPag(
        <>
          <div className="modal__drop-bottom-pag">
            <span
              onClick={() => {
                if (pickUpData?.data?.meta?.page - 1 > 0) {
                  setPickUpPage(pickUpData?.data?.meta?.page - 1);
                }
              }}
              className="modal__drop-b-pag-span"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 12L14 6V18L8 12Z"></path>
              </svg>
            </span>

            <span className="modal__drop-b-pag-total">
              {pickUpData?.data?.meta?.page}/
              {pickUpData?.data?.meta?.totalPages}
            </span>

            <span
              onClick={() => {
                if (
                  pickUpData?.data?.meta?.page + 1 <=
                  pickUpData?.data?.meta?.totalPages
                ) {
                  setPickUpPage(pickUpData?.data?.meta?.page + 1);
                }
              }}
              className="modal__drop-b-pag-span"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 12L10 18V6L16 12Z"></path>
              </svg>
            </span>
          </div>
        </>,
      );
    }
  }, [pickUpData]);

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
      <input
        onChange={handleInput}
        className="modal__inputs"
        placeholder="Price"
        name="price"
        type="number"
      />
      <input
        onChange={handleInput}
        className="modal__inputs"
        placeholder="Stock"
        name="stock"
        type="number"
      />
      <input
        onChange={handleInput}
        className="modal__inputs"
        placeholder="Image"
        name="image"
        type="url"
        required
      />
      <span className="products__b-pag-lselect products__b-pag-filter-lselect modal__select">
        <span>Category: </span>
        <span className="products__b-pag-filter-select">
          <span
            onClick={() => {
              if (data?.data?.items?.length) {
                setCloseDrop(true);
                setCompDrop(
                  <>
                    <span className={`products__b-pag-filter-options`}>
                      {data?.data?.items?.map(({id, name}) => (
                        <span
                          key={id}
                          onClick={() => {
                            setInput({
                              ...input,
                              categoryId: id,
                            });
                            setCategoryValue(name);
                            setCloseDrop(false);
                          }}
                          className="products__b-pag-filter-option"
                        >
                          {name}
                        </span>
                      ))}
                    </span>
                  </>,
                );
                setPag(
                  <>
                    <div className="modal__drop-bottom-pag">
                      <span
                        onClick={() => {
                          if (data?.data?.meta?.page - 1 > 0) {
                            setCategoriesPage(data?.data?.meta?.page - 1);
                          }
                        }}
                        className="modal__drop-b-pag-span"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M8 12L14 6V18L8 12Z"></path>
                        </svg>
                      </span>

                      <span className="modal__drop-b-pag-total">
                        {data?.data?.meta?.page}/{data?.data?.meta?.totalPages}
                      </span>

                      <span
                        onClick={() => {
                          if (
                            data?.data?.meta?.page + 1 <=
                            data?.data?.meta?.totalPages
                          ) {
                            setCategoriesPage(data?.data?.meta?.page + 1);
                          }
                        }}
                        className="modal__drop-b-pag-span"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M16 12L10 18V6L16 12Z"></path>
                        </svg>
                      </span>
                    </div>
                  </>,
                );
              }
            }}
            className="products__b-pag-filter-choosed modal__select-choosed"
          >
            {categoryValue || "--"}
            <span className="products__b-pag-span">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14L8 10H16L12 14Z"></path>
              </svg>
            </span>
          </span>
        </span>
      </span>
      <span className="products__b-pag-lselect products__b-pag-filter-lselect modal__select">
        <span>Pickup point: </span>
        <span className="products__b-pag-filter-select">
          <span
            onClick={() => {
              if (pickUpData?.data?.items?.length) {
                setCloseDrop(true);
                setCompDrop(
                  <>
                    <span className={`products__b-pag-filter-options`}>
                      {pickUpData?.data?.items?.map(({id, name}) => (
                        <span
                          key={id}
                          onClick={() => {
                            setInput({
                              ...input,
                              pickupPointId: id,
                            });
                            setPickUpValue(name);
                            setCloseDrop(false);
                          }}
                          className="products__b-pag-filter-option"
                        >
                          {name}
                        </span>
                      ))}
                    </span>
                  </>,
                );

                setPag(
                  <>
                    <div className="modal__drop-bottom-pag">
                      <span
                        onClick={() => {
                          if (pickUpData?.data?.meta?.page - 1 > 0) {
                            setPickUpPage(pickUpData?.data?.meta?.page - 1);
                          }
                        }}
                        className="modal__drop-b-pag-span"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M8 12L14 6V18L8 12Z"></path>
                        </svg>
                      </span>

                      <span className="modal__drop-b-pag-total">
                        {pickUpData?.data?.meta?.page}/
                        {pickUpData?.data?.meta?.totalPages}
                      </span>

                      <span
                        onClick={() => {
                          if (
                            pickUpData?.data?.meta?.page + 1 <=
                            pickUpData?.data?.meta?.totalPages
                          ) {
                            setPickUpPage(pickUpData?.data?.meta?.page + 1);
                          }
                        }}
                        className="modal__drop-b-pag-span"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M16 12L10 18V6L16 12Z"></path>
                        </svg>
                      </span>
                    </div>
                  </>,
                );
              }
            }}
            className="products__b-pag-filter-choosed modal__select-choosed"
          >
            {pickUpValue || "--"}
            <span className="products__b-pag-span">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14L8 10H16L12 14Z"></path>
              </svg>
            </span>
          </span>
        </span>
      </span>
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

export default NewProductsModal;
