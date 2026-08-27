import React from 'react';
import "../../style/globalSkeleton.scss"

export default function SalonWorkspaceSkeleton() {
  return (
    <div className="salon-skeleton">
      
      {/* Top Media & Map Section */}
      <div className="salon-skeleton__top-grid">
        
        {/* Left Card: Video Showcase Player */}
        <div className="salon-skeleton__video-card">
          <div className="skeleton-box salon-skeleton__video-display" />
          <div className="salon-skeleton__video-actions">
            <div className="skeleton-box salon-skeleton__btn-sm" />
            <div className="skeleton-box salon-skeleton__btn-sm" />
          </div>
        </div>

        {/* Right Card: Location Map Viewport */}
        <div className="skeleton-box salon-skeleton__map-display" />

      </div>

      {/* Middle Analytics & Info Section */}
      <div className="salon-skeleton__mid-grid">
        
        {/* Left Box: Distribution Donut Chart */}
        <div className="salon-skeleton__chart-card">
          <div className="skeleton-box salon-skeleton__chart-title" />
          <div className="salon-skeleton__chart-donut-wrapper">
            <div className="salon-skeleton__chart-circle" />
          </div>
          <div className="salon-skeleton__chart-legends">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-box salon-skeleton__legend-pill" />
            ))}
          </div>
        </div>

        {/* Right Box: Selected Salon Details */}
        <div className="salon-skeleton__info-card">
          <div className="salon-skeleton__info-header">
            <div className="skeleton-box salon-skeleton__info-title" />
            <div className="skeleton-box salon-skeleton__btn-action" />
          </div>
          
          <div className="salon-skeleton__info-body">
            <div className="salon-skeleton__info-left">
              <div className="skeleton-box salon-skeleton__text-line--short" />
              <div className="skeleton-box salon-skeleton__text-line--short" />
              <div className="skeleton-box salon-skeleton__text-line--link" />
            </div>
            
            <div className="salon-skeleton__info-right">
              <div className="salon-skeleton__meta-row">
                <div className="skeleton-box salon-skeleton__badge-status" />
                <div className="skeleton-box salon-skeleton__text-line--short" />
              </div>
              <div className="skeleton-box salon-skeleton__text-line--right" />
              <div className="salon-skeleton__control-row">
                <div className="skeleton-box salon-skeleton__badge-status" />
                <div className="skeleton-box salon-skeleton__btn-square" />
                <div className="skeleton-box salon-skeleton__btn-square" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Table Pagination Action Bar */}
      <div className="salon-skeleton__action-bar">
        <div className="skeleton-box salon-skeleton__per-page" />
        <div className="salon-skeleton__pagination">
          <div className="skeleton-box salon-skeleton__pag-nav" />
          <div className="skeleton-box salon-skeleton__pag-num" />
          <div className="skeleton-box salon-skeleton__pag-nav" />
        </div>
      </div>

      {/* Bottom Products Table List */}
      <div className="salon-skeleton__table-card">
        <div className="salon-skeleton__table">
          <div className="salon-skeleton__t-head">
            <div className="salon-skeleton__th">Image</div>
            <div className="salon-skeleton__th">Name</div>
            <div className="salon-skeleton__th">Price</div>
            <div className="salon-skeleton__th">Stock</div>
            <div className="salon-skeleton__th">Category</div>
            <div className="salon-skeleton__th">Status</div>
          </div>
          <div className="salon-skeleton__t-body">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="salon-skeleton__t-row">
                <div className="salon-skeleton__td"><div className="skeleton-box salon-skeleton__mock-img" /></div>
                <div className="salon-skeleton__td"><div className="skeleton-box salon-skeleton__mock-text-med" /></div>
                <div className="salon-skeleton__td"><div className="skeleton-box salon-skeleton__mock-text-med" /></div>
                <div className="salon-skeleton__td"><div className="skeleton-box salon-skeleton__mock-badge" /></div>
                <div className="salon-skeleton__td"><div className="skeleton-box salon-skeleton__mock-text-short" /></div>
                <div className="salon-skeleton__td">
                  <div className="salon-skeleton__status-container">
                    <div className="skeleton-box salon-skeleton__mock-switch" />
                    <div className="skeleton-box salon-skeleton__mock-text-short" />
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
