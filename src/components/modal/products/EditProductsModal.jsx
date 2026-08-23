import {useGetCategories} from "@/hooks/category/GetCategories";
import {useRouter} from "next/navigation";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useNotify} from "@/hooks/useNotify";
import {GeneralModal} from "@/context/GeneralModal";
import {useGetOneProduct} from "@/hooks/products/GetOneProduct";
import {useEditProducts} from "@/hooks/products/EditProduct";
import ProductFormSkeleton from "../ModalLoading";
import { useGetPickup } from "@/hooks/pickup/GET/GetPickup";

const EditProductsModal = ({id: productId}) => {
  const {data, isPending, error} = useGetCategories();
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
        pickupPointId: oneProductData?.data?.pickupPointId
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
    setOpenCategory(false);
  }, [categoryValue]);

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
    if (oneProductError?.message) {
      notice({
        text: oneProductError?.message,
        time: "infinite",
        status: "error",
        close: " true",
      });
      route.refresh();
    }
  }, [oneProductError]);

  const dropRef = useRef(null);
  const dropHeightRef = useRef(null);
  const [dropDownPosition, setDropDownPosition] = useState("bottom");
  useEffect(() => {
    if (!openCategory || !dropRef.current) return;
    const checkSpace = () => {
      const rect = dropRef?.current?.getBoundingClientRect();
      const viewPointHeight = window.innerHeight;
      const dropHeight = 250;
      if (viewPointHeight - rect?.bottom < dropHeight && rect?.top > dropHeight) {
        setDropDownPosition("top");
      } else {
        setDropDownPosition("bottom");
      }
    };
    checkSpace();
    window.addEventListener("scroll", checkSpace);
    window.addEventListener("resize", checkSpace);

    return () => {
      window.addEventListener("scroll", checkSpace);
      window.addEventListener("resize", checkSpace);
    };
  }, [openCategory]);

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

  const [openPickUp, setOpenPickUp] = useState(false);
  const dropRefPickUp = useRef(null);
  const dropHeightRefPickUp = useRef(null);
  const [dropDownPositionPickUp, setDropDownPositionPickUp] =
    useState("bottom");
  useEffect(() => {
    if (!openPickUp || !dropRefPickUp.current) return;
    const checkSpace = () => {
      const rect = dropRefPickUp.current?.getBoundingClientRect();
      const viewPointHeight = window.innerHeight;
      const dropHeight = 250;
      if (viewPointHeight - rect?.bottom < dropHeight && rect?.top > dropHeight) {
        setDropDownPositionPickUp("top");
      } else {
        setDropDownPositionPickUp("bottom");
      }
    };
    checkSpace();
    window.addEventListener("scroll", checkSpace);
    window.addEventListener("resize", checkSpace);

    return () => {
      window.addEventListener("scroll", checkSpace);
      window.addEventListener("resize", checkSpace);
    };
  }, [openPickUp]);

  useEffect(() => {
    setOpenPickUp(false);
  }, [pickUpValue]);
  const {
    data: pickUpData,
    error: pickUpError,
    isPending: pickUpPending,
  } = useGetPickup();

  useEffect(() => {
    if (pickUpError?.message) {
      notice({
        text: pickUpError?.message || "Could not get pickup points!",
        time: 3000,
        status: "error",
      });
    }
  }, [pickUpError]);

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
                  ref={dropRef}
                  onClick={() => setOpenCategory(!openCategory)}
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
                {openCategory ? (
                  <>
                    <span
                      ref={dropHeightRef}
                      className={`products__b-pag-filter-options modal__options modal__options-${dropDownPosition}`}
                    >
                      {data?.data?.items?.map(({id, name}) => (
                        <span
                          key={id}
                          onClick={() => {
                            setInput({
                              ...input,
                              categoryId: id,
                            });
                            setCategoryValue(name);
                          }}
                          className="products__b-pag-filter-option"
                        >
                          {name}
                        </span>
                      ))}
                    </span>
                  </>
                ) : null}
              </span>
            </span>
            <span className="products__b-pag-lselect products__b-pag-filter-lselect modal__select">
              <span>Pickup point: </span>
              <span className="products__b-pag-filter-select modal__select-wrap">
                <span
                  ref={dropRefPickUp}
                  onClick={() => setOpenPickUp(!openPickUp)}
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
                {openPickUp ? (
                  <>
                    <span
                      ref={dropHeightRefPickUp}
                      className={`products__b-pag-filter-options modal__options modal__options-${dropDownPositionPickUp}`}
                    >
                      <span
                          onClick={() => {
                            setInput({
                              ...input,
                              pickupPointId: null,
                            });
                            setPickUpValue(null);
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
                          }}
                          className="products__b-pag-filter-option"
                        >
                          {name}
                        </span>
                      ))}
                    </span>
                  </>
                ) : null}
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
      ) : isPending ? (
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
