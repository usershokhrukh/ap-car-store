import React from "react";
import "../modal/modal.modules.scss";
import "./categories.modules.scss";
export default function CategoryViewSkeleton() {
  return (
    <div className="category-view-skeleton products">
      <div className="skeleton-box category-view-skeleton__title" />

      {/* 1. Top Section: Category Info Summary Row */}
      <div className="category-view-skeleton__info-row">
        <div className="category-view-skeleton__info-col">
          <div className="skeleton-box products-skeleton__th"></div>
          <div className="skeleton-box category-view-skeleton__value--short" />
        </div>

        <div className="category-view-skeleton__info-col category-view-skeleton__info-col--wide">
          <div className="skeleton-box products-skeleton__th"></div>
          <div className="skeleton-box category-view-skeleton__value--long" />
        </div>

        <div className="category-view-skeleton__info-col">
          <div className="skeleton-box products-skeleton__th"></div>
          <div className="skeleton-box category-view-skeleton__value--badge" />
        </div>

        <div className="category-view-skeleton__info-col">
          <div className="skeleton-box products-skeleton__th"></div>
          <div className="category-view-skeleton__status-group">
            <div className="skeleton-box category-view-skeleton__value--switch" />
            <div className="skeleton-box category-view-skeleton__value--status-text" />
          </div>
        </div>

        <div className="category-view-skeleton__info-col">
          <div className="skeleton-box products-skeleton__th"></div>

          <div className="category-view-skeleton__actions-group">
            <div className="skeleton-box category-view-skeleton__value--action-btn" />
            <div className="skeleton-box category-view-skeleton__value--action-btn" />
          </div>
        </div>
      </div>

      {/* 2. Bottom Section: Embedded Products Table List Container */}
      <div className="category-view-skeleton__table-card">
        <div className="category-view-skeleton__table">
          {/* Table Header Row */}
          <div className="category-view-skeleton__t-head">
            <div className="skeleton-box products-skeleton__th"></div>
            <div className="skeleton-box products-skeleton__th"></div>
            <div className="skeleton-box products-skeleton__th"></div>
            <div className="skeleton-box products-skeleton__th"></div>
            <div className="skeleton-box products-skeleton__th"></div>
            <div className="skeleton-box products-skeleton__th"></div>
          </div>

          {/* Table Body Grid Rows */}
          <div className="category-view-skeleton__t-body">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="category-view-skeleton__t-row">
                <div className="category-view-skeleton__td">
                  <div className="skeleton-box category-view-skeleton__mock-img" />
                </div>
                <div className="category-view-skeleton__td">
                  <div className="skeleton-box category-view-skeleton__mock-text-med" />
                </div>
                <div className="category-view-skeleton__td">
                  <div className="skeleton-box category-view-skeleton__mock-text-med" />
                </div>
                <div className="category-view-skeleton__td">
                  <div className="skeleton-box category-view-skeleton__mock-badge" />
                </div>
                <div className="category-view-skeleton__td">
                  <div className="skeleton-box category-view-skeleton__mock-text-short" />
                </div>
                <div className="category-view-skeleton__td">
                  <div className="category-view-skeleton__status-container">
                    <div className="skeleton-box category-view-skeleton__mock-switch" />
                    <div className="skeleton-box category-view-skeleton__mock-text-short" />
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
