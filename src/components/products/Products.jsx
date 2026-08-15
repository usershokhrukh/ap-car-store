"use client";
import React, {useEffect, useRef, useState} from "react";
import CarProductsTable from "./ProductsTable";
import {useGetProducts} from "@/hooks/products/GetProducts";
import "./products.modules.scss";
import {useNotify} from "@/hooks/useNotify";
import ProductsSkeleton from "./ProductsLoading";
import NotFound from "../notfound/NotFound";
import {useRouter} from "next/navigation";

const Products = () => {
  const [limit, setLimit] = useState({
    search: "",
    limit: 4,
    page: 1,
  });

  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [openLimit, setOpenLimit] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openIsActive, setOpenIsActive] = useState(false);
  const [openInStock, setOpenInStock] = useState(false);
  const [openSortBy, setOpenSortBy] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);

  const searchQuery = `?page=1&limit=10`;
  const {data, isPending, error} = useGetProducts(searchQuery);
  const {notice} = useNotify();
  const route = useRouter();
  const [loaded, setLoaded] = useState(false);
  const timeRef = useRef(null);

  useEffect(() => {
    if (timeRef.current) {
      return clearTimeout(timeRef.current);
    } else {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    }
  }, []);

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
  return (
    <div className="products container">
      {!isPending && data && loaded ? (
        <>
          <div className="products__top">
            <h2 className="products__title">Products</h2>
            <p className="products__tit-sub">Avtomobillar ro'yxati</p>
          </div>
          <div className="products__bottom">
            <div className="products__b-pag">
              <div className="products__b-pag-left">
                <input
                  type="search"
                  className="products__b-pag-search"
                  placeholder="Search..."
                />
                <div className="products__b-pag-limit">
                  <button
                    onClick={() => setOpenLimit(!openLimit)}
                    className="products__b-pag-lbutton"
                  >
                    4
                    <span className="products__b-pag-span">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 14L8 10H16L12 14Z"></path>
                      </svg>
                    </span>
                  </button>
                  {openLimit ? (
                    <div className="products__b-pag-limits">
                      <span className="products__b-pag-lselect">4</span>
                      <span className="products__b-pag-lselect">8</span>
                      <span className="products__b-pag-lselect">10</span>
                      <span className="products__b-pag-lselect">14</span>
                      <span className="products__b-pag-lselect">18</span>
                    </div>
                  ) : null}
                </div>
                <div className="products__b-pag-limit">
                  <button
                    onClick={() => setOpenFilter(!openFilter)}
                    className="products__b-pag-lbutton"
                  >
                    <span className="products__b-pag-span-mini">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"></path>
                      </svg>
                    </span>
                    <span className="products__b-pag-span">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 14L8 10H16L12 14Z"></path>
                      </svg>
                    </span>
                  </button>
                  {openFilter ? (
                    <div className="products__b-pag-limits">
                      <span className="products__b-pag-lselect products__b-pag-filter-lselect">
                        <span>Category id: </span>
                        <input
                          placeholder="id"
                          className="products__b-pag-search"
                          type="number"
                        />
                      </span>
                      <span className="products__b-pag-lselect products__b-pag-filter-lselect">
                        <span>Is active: </span>
                        <span className="products__b-pag-filter-select">
                          <span
                            onClick={() => setOpenIsActive(!openIsActive)}
                            className="products__b-pag-filter-choosed"
                          >
                            true{" "}
                            <span className="products__b-pag-span">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 14L8 10H16L12 14Z"></path>
                              </svg>
                            </span>{" "}
                          </span>
                          {openIsActive ? (
                            <span className="products__b-pag-filter-options">
                              <span className="products__b-pag-filter-option">
                                true
                              </span>
                              <span className="products__b-pag-filter-option">
                                false
                              </span>
                              <span className="products__b-pag-filter-option">
                                --
                              </span>
                            </span>
                          ) : null}
                        </span>
                      </span>
                      <span className="products__b-pag-lselect products__b-pag-filter-lselect">
                        <span>Min price: </span>
                        <input
                          placeholder="uzs"
                          className="products__b-pag-search"
                          type="number"
                        />
                      </span>
                      <span className="products__b-pag-lselect products__b-pag-filter-lselect">
                        <span>Max price: </span>
                        <input
                          placeholder="uzs"
                          className="products__b-pag-search"
                          type="number"
                        />
                      </span>
                      <span className="products__b-pag-lselect products__b-pag-filter-lselect">
                        <span>In stock: </span>
                        <span className="products__b-pag-filter-select">
                          <span
                            onClick={() => setOpenInStock(!openInStock)}
                            className="products__b-pag-filter-choosed"
                          >
                            true{" "}
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
                          {openInStock ? (
                            <span className="products__b-pag-filter-options">
                              <span className="products__b-pag-filter-option">
                                true
                              </span>
                              <span className="products__b-pag-filter-option">
                                false
                              </span>
                              <span className="products__b-pag-filter-option">
                                --
                              </span>
                            </span>
                          ) : null}
                        </span>
                      </span>
                      <span className="products__b-pag-lselect products__b-pag-filter-lselect">
                        <span>Sort by:</span>

                        <span className="products__b-pag-filter-select">
                          <span
                            onClick={() => setOpenSortBy(!openSortBy)}
                            className="products__b-pag-filter-choosed"
                          >
                            --{" "}
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

                          {openSortBy ? (
                            <span className="products__b-pag-filter-options">
                              <span className="products__b-pag-filter-option">
                                id
                              </span>
                              <span className="products__b-pag-filter-option">
                                name
                              </span>
                              <span className="products__b-pag-filter-option">
                                price
                              </span>
                              <span className="products__b-pag-filter-option">
                                stock
                              </span>
                              <span className="products__b-pag-filter-option">
                                created at
                              </span>
                              <span className="products__b-pag-filter-option">
                                --
                              </span>
                            </span>
                          ) : null}
                        </span>
                      </span>
                      <span className="products__b-pag-lselect products__b-pag-filter-lselect">
                        <span>Order:</span>

                        <span className="products__b-pag-filter-select">
                          <span
                            onClick={() => setOpenOrder(!openOrder)}
                            className="products__b-pag-filter-choosed"
                          >
                            --{" "}
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
                          {openOrder ? (
                            <span className="products__b-pag-filter-options">
                              <span className="products__b-pag-filter-option">
                                ASC
                              </span>
                              <span className="products__b-pag-filter-option">
                                DESC
                              </span>
                              <span className="products__b-pag-filter-option">
                                --
                              </span>
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="products__b-pag-right">
                <button className="products__b-pag-rbuttons">
                  <span className="products__b-pag-span">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 12L13 8V16L9 12Z"></path>
                    </svg>
                  </span>
                  Prev
                </button>
                <div className="products__b-pag-pages">
                  <button className="products__b-pag-page">1</button>
                  <button className="products__b-pag-page">2</button>
                  <button className="products__b-pag-page">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
                    </svg>
                  </button>
                  <button className="products__b-pag-page">3</button>
                </div>
                <button className="products__b-pag-rbuttons">
                  Next
                  <span className="products__b-pag-span">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14 12L10 16V8L14 12Z"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            <CarProductsTable cars={data} />
          </div>
        </>
      ) : isPending || !loaded ? (
        <ProductsSkeleton />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default Products;
