import {usePatchStatusPickup} from "@/hooks/pickup/PATCH/PatchPickUpStatus";
import {useNotify} from "@/hooks/useNotify";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";

const PickupTable = ({data}) => {
  const {mutate, data: switchData, isPending, error} = usePatchStatusPickup();
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
    if (!isPending && switchData) {
      notice({
        text: switchData?.message,
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
  }, [isPending, switchData]);

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

  const handleProducts = (e, id) => {
    if (e.target?.id != "switch") {
      route.push(`/pickup-points/${id}`);
    }
  };
  
  return (
    <table className="products__table">
      <thead className="products__t-head">
        <tr className="products__t-h-row">
          <th className="products__t-h-th">Name</th>
          <th className="products__t-h-th">Products count</th>
          <th className="products__t-h-th">Active products</th>
          <th className="products__t-h-th">Total value</th>
          <th className="products__t-h-th">Status</th>
        </tr>
      </thead>
      <tbody className="products__t-body">
        {data?.data?.map(
          ({
            name,
            city,
            isActive,
            hasVideo,
            productsCount,
            activeProductsCount,
            totalValue,
            id,
          }) => (
            <tr
              key={`${name} ${id}`}
              onClick={(e) => handleProducts(e, id)}
              className="products__t-b-row"
            >
              <td className="products__t-b-td">
                <div className="products__t-b-box">
                  <p className="products__t-b-box-title">
                    {name}
                    {hasVideo ? (
                      <span className="products__t-box-video">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17 9.2L22.2133 5.55071C22.4395 5.39235 22.7513 5.44737 22.9096 5.6736C22.9684 5.75764 23 5.85774 23 5.96033V18.0397C23 18.3158 22.7761 18.5397 22.5 18.5397C22.3974 18.5397 22.2973 18.5081 22.2133 18.4493L17 14.8V19C17 19.5523 16.5523 20 16 20H2C1.44772 20 1 19.5523 1 19V5C1 4.44772 1.44772 4 2 4H16C16.5523 4 17 4.44772 17 5V9.2Z"></path>
                        </svg>
                      </span>
                    ) : null}
                  </p>
                  <p className="products__t-box-sub">{city}</p>
                </div>
              </td>
              <td className="products__t-b-td">
                <span className="products__t-stock">{productsCount}</span>
              </td>
              <td className="products__t-b-td">
                <span className="products__t-stock">{activeProductsCount}</span>
              </td>
              <td className="products__t-b-td">
                {totalValue} <span className="products__t-price">UZS</span>
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

export default PickupTable;
