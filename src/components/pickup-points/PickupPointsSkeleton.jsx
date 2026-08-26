import React from "react";

export default function PickupPointSkeleton() {
  return (
    <div className="products-skeleton">
      <header className="products-skeleton__header">
        <div className="products-skeleton__header-top">
          <div className="skeleton-box products-skeleton__title" />
          <div className="skeleton-box products-skeleton__subtitle" />
        </div>
        <div className="products-skeleton__header-right">
          <div className="skeleton-box products-skeleton__nearby" />
          <div className="skeleton-box products-skeleton__top-button"></div>
        </div>
      </header>

      <div className="products-skeleton__action-bar">
        {/* Left Side: Controls (Search Input, Per-Page Dropdown, Filter Button) */}
        <div className="products-skeleton__controls">
          <div className="skeleton-box products-skeleton__search-input" />
          <div className="skeleton-box products-skeleton__per-page-select" />
          <div className="skeleton-box products-skeleton__filter-trigger" />
        </div>

        {/* Right Side: Pagination Blocks */}
        <div className="products-skeleton__pagination">
          {/* Prev Navigation Trigger */}
          <div className="skeleton-box products-skeleton__pag-nav" />

          {/* Numbered Page List Badges */}
          <div className="products-skeleton__pag-numbers">
            <div className="skeleton-box products-skeleton__pag-num products-skeleton__pag-num--active" />
            <div className="skeleton-box products-skeleton__pag-num" />
            <div className="skeleton-box products-skeleton__pag-num" />
            <div className="skeleton-box products-skeleton__pag-ellipsis" />
            <div className="skeleton-box products-skeleton__pag-num" />
          </div>

          {/* Next Navigation Trigger */}
          <div className="skeleton-box products-skeleton__pag-nav" />
        </div>
      </div>

      <div className="products-skeleton__table-wrapper">
        <div className="products-skeleton__table">
          <div className="products-skeleton__t-head">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-box products-skeleton__th" />
            ))}
          </div>
          <div className="products-skeleton__t-body">
            {[...Array(8)].map((_, rowIndex) => (
              <div key={rowIndex} className="products-skeleton__t-b-row">
                <div className="products-skeleton__t-b-td products-skeleton__t-b-td--image">
                  <div className="skeleton-box products-skeleton__mock-image" />
                </div>
                <div className="products-skeleton__t-b-td products-skeleton__t-b-td--name">
                  <div className="skeleton-box products-skeleton__mock-text-long" />
                </div>
                <div className="products-skeleton__t-b-td products-skeleton__t-b-td--price">
                  <div className="skeleton-box products-skeleton__mock-text-med" />
                </div>
                <div className="products-skeleton__t-b-td products-skeleton__t-b-td--stock">
                  <div className="skeleton-box products-skeleton__mock-badge" />
                </div>
                <div className="products-skeleton__t-b-td products-skeleton__t-b-td--category">
                  <div className="skeleton-box products-skeleton__mock-text-short" />
                </div>
                <div className="products-skeleton__t-b-td products-skeleton__t-b-td--status">
                  <div className="products-skeleton__status-container">
                    <div className="skeleton-box products-skeleton__mock-switch" />
                    <div className="skeleton-box products-skeleton__mock-text-short" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
