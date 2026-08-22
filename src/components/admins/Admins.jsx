"use client";
import React, {useContext, useEffect, useState} from "react";
import "./admins.modules.scss";
import "../products/one-product.modules.scss"
import PaginationGeneral from "../pagination/PaginationGeneral";
import AdminsPaginationProperties from "./AminsPaginationProperties";
import {useGetAdmins} from "@/hooks/admins/GetAdmins";
import {useNotify} from "@/hooks/useNotify";
import {useRouter} from "next/navigation";
import {GeneralModal} from "@/context/GeneralModal";
import NotFound from "../notfound/NotFound";
import ProductsSkeleton from "../products/ProductsLoading";
import AdminsTable from "./AdminsTable";
import {useGetMe} from "@/hooks/settings/GetMe";
import {useGetOneAdmin} from "@/hooks/admins/GetAdminMe";
import { useQueryClient } from "@tanstack/react-query";
import EditAdminsModalPassword from "../modal/admins/EditPasswordModal";
import NewAdminsModal from "../modal/admins/NewAdminsModal";

const Admins = () => {
  const localStorageName = "adminsLimit";
  const listAct = ["sortBy", "order"];
  const [searchParams, setSearchParams] = useState("");
  const {data, error, isPending} = useGetAdmins(searchParams);
  const {refetch, data: meId, error: meIdError, isPending: meIdPending} = useGetMe();
  const route = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.invalidateQueries({queryKey: ["settings-me"]})
  }, [])
  const {
    data: adminId,
    error: adminIdError,
    isPending: adminIdPending,
  } = useGetOneAdmin(meId?.data?.id);
  const {notice} = useNotify();

  useEffect(() => {
    if (error?.message) {
      notice({
        text: error?.message,
        time: "infinite",
        status: "error",
        close: "true",
      });
      route.refresh();
    }
  }, [error]);

  const {setCloseModal, setCompModal, setCloseSpan} = useContext(GeneralModal);
  useEffect(() => {
    setCloseModal(false);
    setCompModal(null);
    setCloseSpan(true);
  }, []);  

  return (
    <div className="admins container">
      {!isPending && data && !adminIdPending && !meIdPending ? (
        <>
          <div className="products__top">
            <div className="products__top-left">
              <h2 className="products__title">Admins</h2>
              <p className="products__tit-sub">{data?.message}</p>
            </div>
            {adminId?.data?.isSuperAdmin ? (
              <button
                onClick={() => {
                  setCloseModal(true);
                  setCompModal(<NewAdminsModal />);
                }}
                className="products__top-submit"
              >
                + Add New Admin
              </button>
            ) : null}
          </div>
          <div className="admins__me">
            <div className="admins__me-box">
              <p className="admins__me-title">{adminId?.data?.login || "No login"}</p>
              <p className="admins__me-sub-tit">{adminId?.data?.fullName || "No fullname"}</p>
            </div>
            <button onClick={() => {
              setCloseModal(true)
              setCompModal(<EditAdminsModalPassword/>)
            }} className="admins__me-change">
              <span className="admins__me-span">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path>
                </svg>
              </span>
              Change own password
            </button>
          </div>
          <div className="products__bottom">
            <PaginationGeneral
              comp={AdminsPaginationProperties}
              data={data}
              localStorageName={localStorageName}
              listAct={listAct}
              setSearchParams={setSearchParams}
            />
            {data?.data?.items?.length ? (
              <AdminsTable adminData={adminId || null} data={data} />
            ) : (
              <span className="products__tit-sub">
                There are no products for this filter
              </span>
            )}
          </div>
        </>
      ) : isPending || meIdPending || adminIdPending ? (
        <ProductsSkeleton />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default Admins;
