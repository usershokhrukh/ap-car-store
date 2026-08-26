import {useGetCategories} from "@/hooks/category/GetCategories";
import {useRouter} from "next/navigation";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useNotify} from "@/hooks/useNotify";
import {GeneralModal} from "@/context/GeneralModal";
import {useGetOneProduct} from "@/hooks/products/GetOneProduct";
import {useEditProducts} from "@/hooks/products/EditProduct";
import ProductFormSkeleton from "../ModalLoading";
import {useGetPickup} from "@/hooks/pickup/GET/GetPickup";
import {ModalDropDown} from "@/context/ModalDropDown";

const EditProductsModal = ({id: productId}) => {
  const [categoriesPage, setCategoriesPage] = useState(null);
  const {data, isPending, error} = useGetCategories(
    `?isActive=true&limit=10${categoriesPage ? `&page=${categoriesPage}` : ""}`,
  );
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryValue, setCategoryValue] = useState("");
  const [pickUpValue, setPickUpValue] = useState("");
  const {
    data: oneProductData,
    error: oneProductError,
    isPending: oneProductPending,
  } = useGetOneProduct(productId);
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

  useEffect(() => {
    if (oneProductData) {
      setInput({
        name: oneProductData?.data?.name,
        categoryId: oneProductData?.data?.categoryId,
        description: oneProductData?.data?.description,
        price: oneProductData?.data?.price,
        stock: oneProductData?.data?.stock,
        image: oneProductData?.data?.image,
        pickupPointId: oneProductData?.data?.pickupPointId,
      });
      setCategoryValue(oneProductData?.data?.category?.name);
      setPickUpValue(oneProductData?.data?.pickupPoint?.name);
    }
  }, [oneProductData]);

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
      setCategoryValue("error");
    }
  }, [error]);

  useEffect(() => {
    if (oneProductError?.message) {
      notice({
        text: oneProductError?.message,
        time: "infinite",
        status: "error",
        close: " true",
      });
      setCategoryValue("error");
      route.refresh();
    }
  }, [oneProductError]);

  const {
    mutate,
    data: postData,
    error: postError,
    isPending: postPending,
  } = useEditProducts();

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
        text: "Editing...",
        status: "info",
        time: "infinite",
      });
      mutate([productId, input]);
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

  const {setCloseDrop, closeDrop, setCompDrop, compDrop, setPag} =
    useContext(ModalDropDown);
  useEffect(() => {
    setCloseDrop(false);
  }, [pickUpValue]);
  useEffect(() => {
    setCloseDrop(false);
  }, [categoryValue]);

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

  useEffect(() => {
    if (oneProductData) {
      setCategoryValue(oneProductData?.data?.category?.name);
      if (oneProductData?.data?.pickupPoint?.name) {
        setPickUpValue(oneProductData?.data?.pickupPoint?.name);
      } else {
        setPickUpValue(null);
      }
    }
  }, [oneProductData]);

  useEffect(() => {
    if (
      (!oneProductData && oneProductPending) ||
      (!data && isPending && !closeDrop)
    ) {
      setCategoryValue("loading...");
    } else if (oneProductData) {
      setCategoryValue(oneProductData?.data?.category?.name);
    }
  }, [oneProductData, oneProductPending, data, isPending]);

  useEffect(() => {
    if (
      (!pickUpData && pickUpPending && !closeDrop) ||
      (!oneProductData && oneProductPending)
    ) {
      setPickUpValue("loading...");
    } else if (oneProductData?.data?.pickupPoint?.name) {
      setPickUpValue(oneProductData?.data?.pickupPoint?.name);
    } else {
      setPickUpValue(null);
    }
  }, [pickUpData, pickUpPending, oneProductData, oneProductPending]);

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
    <>
      {oneProductData && !oneProductPending ? (
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
            <input
              onChange={handleInput}
              className="modal__inputs"
              placeholder="Price"
              name="price"
              type="number"
              value={input?.price}
            />
            <input
              onChange={handleInput}
              className="modal__inputs"
              placeholder="Stock"
              name="stock"
              type="number"
              value={input?.stock}
            />
            <input
              onChange={handleInput}
              className="modal__inputs"
              placeholder="Image"
              name="image"
              type="url"
              required
              value={input?.image}
            />
            <span className="products__b-pag-lselect products__b-pag-filter-lselect modal__select">
              <span>Category: </span>
              <span className="products__b-pag-filter-select modal__select-wrap">
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
                              {data?.data?.meta?.page}/
                              {data?.data?.meta?.totalPages}
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
              <span className="products__b-pag-filter-select modal__select-wrap">
                <span
                  onClick={() => {
                    if (pickUpData?.data?.items?.length) {
                      setCloseDrop(true);
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
                                  setPickUpPage(
                                    pickUpData?.data?.meta?.page - 1,
                                  );
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
                                  setPickUpPage(
                                    pickUpData?.data?.meta?.page + 1,
                                  );
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
        </>
      ) : oneProductPending ? (
        <form className="modal__form">
          <ProductFormSkeleton />
        </form>
      ) : (
        <>
          <form className="modal__form">
            <p className="modal__title">Can not be found!</p>
            <button
              className="modal__submit"
              onClick={() => route.push("/products")}
            >
              Back to products
            </button>
          </form>
        </>
      )}
    </>
  );
};

export default EditProductsModal;
