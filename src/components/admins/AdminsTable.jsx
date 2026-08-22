import { GeneralModal } from "@/context/GeneralModal";
import React, {useContext, useEffect} from "react";
import AdminDeleteConfirm from "./AdminDeleteConfirm";
import EditAdminsModal from "../modal/admins/EditAdminsModal";

const AdminsTable = ({data, adminData}) => {
  const {setCompModal, setCloseModal} = useContext(GeneralModal)

  return (
    <table className="products__table">
      <thead className="products__t-head">
        <tr className="products__t-h-row">
          <th className="products__t-h-th">Login</th>
          <th className="products__t-h-th">Fullname</th>
          <th className="products__t-h-th">Updated at</th>
          <th className="products__t-h-th">Role</th>
          {adminData?.data?.isSuperAdmin ? (
            <th className="products__t-h-th">Action</th>
          ) : null}
        </tr>
      </thead>
      <tbody className="products__t-body">
        {data?.data?.items?.map(
          ({login, fullName, isSuperAdmin, updatedAt, id}) => (
            <tr
              style={{
                backgroundColor: `${id == adminData?.data?.id ? "rgb(from var(--app-cyan) r g b / 0.04)" : ""}`,
              }}
              key={`${name} ${id}`}
              className="products__t-b-row"
            >
              <td className="products__t-b-td">{login}</td>
              <td className="products__t-b-td">{fullName}</td>
              <td className="products__t-b-td">{updatedAt}</td>
              <td className="products__t-b-td">
                {isSuperAdmin ? "Super Admin" : "System Admin"}
              </td>
              {adminData?.data?.isSuperAdmin ? (
                <td className="products__t-b-td">
                  <button
                    onClick={() => {
                      setCompModal(<EditAdminsModal id={id} />);
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
                      setCompModal(<AdminDeleteConfirm id={id} />);
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
                </td>
              ) : null}
            </tr>
          ),
        )}
        <tr>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
};

export default AdminsTable;
