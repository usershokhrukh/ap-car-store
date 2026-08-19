import { usePatchStatusCategories } from "@/hooks/category/PatchCategoriesStatus";
import {usePatchStatusProducts} from "@/hooks/products/PatchStatusProducts";
import {useNotify} from "@/hooks/useNotify";
import { useRouter } from "next/navigation";
import React, {useEffect} from "react";

const CategoriesTable = ({cars}) => {
  const {mutate, data, isPending, error} = usePatchStatusCategories();
  const {notice} = useNotify();
  const route = useRouter();
  const handleSwitch = (id, isActive) => {
    if (!isPending) {
      notice({
        text: "Switching...",
        time: "infinite",
        status: "info",
      });
      mutate([id, {isActive: !isActive}]);
    }
  };

  useEffect(() => {
    if (!isPending && data) {
      notice({
        text: data?.message,
        status: "success",
        time: 5000,
        close: true,
      });
    }
    if (isPending) {
      notice({
        text: "Switching...",
        time: "infinite",
        status: "info",
      });
    }
  }, [isPending, data]);

  useEffect(() => {
    if(error?.message) {
      notice({
        text: error?.message,
        time: "infinite",
        status: "error",
        close:" true"
      });
      route.refresh();
    }
  }, [error])

  const handleProducts = (e, id) => {
    if (e.target?.id != "switch") {
      route.push(`/categories/${id}`)
    }
  };

  return (
    <table className="products__table">
      <thead className="products__t-head">
        <tr className="products__t-h-row">
          <th className="products__t-h-th">Name</th>
          <th className="products__t-h-th">Description</th>
          <th className="products__t-h-th">Products count</th>
          <th className="products__t-h-th">Status</th>
        </tr>
      </thead>
      <tbody className="products__t-body">
        {cars?.data?.items?.map(
          ({name, productsCount, description, isActive, id}) => (
            <tr
            key={`${name} ${id}`}
              onClick={(e) => handleProducts(e, id)}
              className="products__t-b-row"
            >
              <td className="products__t-b-td">{name}</td>
              <td className="products__t-b-td">
                {description}
              </td>
              <td className="products__t-b-td">
                <span className="products__t-stock">{productsCount}</span>
              </td>
              <td
                onClick={() => handleSwitch(id, isActive)}
                id="switch"
                className={`products__t-b-td ${isPending ? "products__t-b-switch-pending" : ""}`}
              >
                <span
                  id="switch"
                  className="products__t-b-status-switch"
                  style={{
                    justifyContent: `${isActive ? "start" : "end"}`,
                  }}
                >
                  <span
                    id="switch"
                    className={`products__t-b-status-switch-dot ${isActive ? "products__t-b-status-switch-dot-switched" : "products__t-b-status-switch-dot-unswitch"}`}
                  ></span>
                </span>

                {isActive ? (
                  <span
                    id="switch"
                    className="products__t-b-status-active products__t-b-status"
                  >
                    Change to Inactive
                  </span>
                ) : (
                  <span
                    id="switch"
                    className="products__t-b-status-inactive products__t-b-status"
                  >
                    Change to active
                  </span>
                )}
              </td>
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

export default CategoriesTable;
