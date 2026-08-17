"use client";
import {useParams, useRouter} from "next/navigation";
import React, {useContext, useEffect} from "react";
import "./categories.modules.scss";
import {useGetOneCategory} from "@/hooks/category/GetOneCategory";
import "../products/products.modules.scss";
import "../products/one-product.modules.scss";
import {useGetProducts} from "@/hooks/products/GetProducts";
import ProductsTable from "../products/ProductsTable";
import {usePatchStatusCategories} from "@/hooks/category/PatchCategoriesStatus";
import {useNotify} from "@/hooks/useNotify";
import EditCategoriesModal from "../modal/categories/EditCategoriesModal";
import CategoryDeleteConfirm from "./CategoryDeleteConfirm";
import {GeneralModal} from "@/context/GeneralModal";
import CategoryViewSkeleton from "./CategoriesOneLoading";
import NotFound from "../notfound/NotFound";

const CategoriesOneView = () => {
  const {id} = useParams();
  const route = useRouter();
  const {notice} = useNotify();
  const {setCloseModal, setCompModal} = useContext(GeneralModal);
  const {
    data: categoryData,
    isPending: categoryPending,
    error: categoryError,
  } = useGetOneCategory(id);
  const {
    data: productsData,
    error: productsError,
    isPending: productsPending,
  } = useGetProducts(`${id ? `?categoryId=${id}` : ""}`);
  const {
    data: categoryPatchData,
    error: categoryPatchError,
    isPending: categoryPatchPending,
    mutate: categoryPatchMutate,
  } = usePatchStatusCategories();
  const handlePatchCategory = (data) => {
    try {
      notice({
        text: "Loading...",
        status: "info",
        time: "infinite",
      });
      categoryPatchMutate([data?.id, {isActive: !data?.isActive}]);
    } catch (error) {
      route.refresh();
    }
  };

  useEffect(() => {
    if (categoryPatchError?.message) {
      notice({
        text: categoryPatchError?.message,
        status: "error",
        time: "infinite",
        close: true,
      });
      route.refresh();
    }
  }, [categoryPatchError]);

  useEffect(() => {
    if (categoryError?.message) {
      notice({
        text: categoryError?.message,
        status: "error",
        time: "infinite",
        close: true,
      });
      route.refresh();
    }
  }, [categoryError]);

  useEffect(() => {
    if (productsError?.message) {
      notice({
        text: productsError?.message,
        status: "error",
        time: "infinite",
        close: true,
      });
      route.refresh();
    }
  }, [productsError]);

  useEffect(() => {
    if (
      categoryPatchData &&
      !categoryPatchPending &&
      !categoryPatchError?.message
    ) {
      notice({
        text: categoryPatchData?.message,
        time: 5000,
        status: "success",
      });
    }
  }, [categoryPatchData, categoryPatchPending]);

  useEffect(() => {
    if((!productsData?.data?.items?.length) && (!productsPending && !categoryPending) && categoryData) {
      notice({
        text: "This category does not have any products!",
        time: 5000,
        status: "info"
      })
    }
  }, [productsData])
  return (
    <div className="categories categories-view container">
      <div className="categories__top categories__view-top">
        <span
          onClick={() => route.push("/categories")}
          className="categories__view-back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20ZM12 11H16V13H12V16L8 12L12 8V11Z"></path>
          </svg>
        </span>
      </div>

      {categoryData &&
      productsData &&
      !categoryPending &&
      !productsPending &&
      !productsError &&
      !categoryError ? (
        <>
          <h2 className="products__title">Category Properties</h2>
          <div className="categories__view-center">
            <table className="products__table">
              <thead className="products__t-head">
                <tr className="products__t-h-row">
                  <th className="products__t-h-th">Name</th>
                  <th className="products__t-h-th">Description</th>
                  <th className="products__t-h-th">Products count</th>
                  <th className="products__t-h-th">Status</th>
                  <th className="products__t-h-th">Action</th>
                </tr>
              </thead>
              <tbody className="products__t-body">
                <tr className="products__t-b-row">
                  <td className="products__t-b-td">
                    {categoryData?.data?.name}
                  </td>
                  <td className="products__t-b-td">
                    {categoryData?.data?.description}
                  </td>
                  <td className="products__t-b-td">
                    <span className="products__t-stock">
                      {categoryData?.data?.productsCount}
                    </span>
                  </td>
                  <td
                    onClick={() =>
                      handlePatchCategory({
                        id,
                        isActive: categoryData?.data?.isActive,
                      })
                    }
                    id="switch"
                    className={`products__t-b-td ${categoryPatchPending ? "products__t-b-switch-pending" : ""}`}
                  >
                    <span
                      id="switch"
                      className="products__t-b-status-switch"
                      style={{
                        justifyContent: `${categoryData?.data?.isActive ? "start" : "end"}`,
                      }}
                    >
                      <span
                        id="switch"
                        className={`products__t-b-status-switch-dot ${categoryData?.data?.isActive ? "products__t-b-status-switch-dot-switched" : "products__t-b-status-switch-dot-unswitch"}`}
                      ></span>
                    </span>

                    {categoryData?.data?.isActive ? (
                      <span
                        id="switch"
                        className="products__t-b-status-active products__t-b-status"
                      >
                        Active
                      </span>
                    ) : (
                      <span
                        id="switch"
                        className="products__t-b-status-inactive products__t-b-status"
                      >
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="products__t-b-td">
                    <div className="products-view__mleft-side-right">
                      <button
                        onClick={() => {
                          setCompModal(<EditCategoriesModal id={id} />);
                          setCloseModal(true);
                        }}
                        className="products-view__mleft-buttons"
                      >
                        <span className="products-view__mleft-buttons-span">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M16.7574 2.99678L14.7574 4.99678H5V18.9968H19V9.23943L21 7.23943V19.9968C21 20.5491 20.5523 20.9968 20 20.9968H4C3.44772 20.9968 3 20.5491 3 19.9968V3.99678C3 3.4445 3.44772 2.99678 4 2.99678H16.7574ZM20.4853 2.09729L21.8995 3.5115L12.7071 12.7039L11.2954 12.7064L11.2929 11.2897L20.4853 2.09729Z"></path>
                          </svg>
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setCompModal(<CategoryDeleteConfirm id={id} />);
                          setCloseModal(true);
                        }}
                        className="products-view__mleft-buttons products-view__mleft-buttons-delete"
                      >
                        <span className="products-view__mleft-buttons-span products-view__mleft-buttons-span-delete">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM6 10V20H18V10H6ZM9 12H11V18H9V12ZM13 12H15V18H13V12ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9Z"></path>
                          </svg>
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {productsData?.data?.items?.length ? (
            <ProductsTable cars={productsData} />
          ) : null}
        </>
      ) : productsPending || categoryPending ? (
        <CategoryViewSkeleton />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default CategoriesOneView;
