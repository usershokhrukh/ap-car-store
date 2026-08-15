import React from 'react';

export default function ProductsSkeleton() {
  return (
    <div className="products-skeleton">
      <header className="products-skeleton__header">
        <div className="skeleton-box products-skeleton__title" />
        <div className="skeleton-box products-skeleton__subtitle" />
      </header>

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
