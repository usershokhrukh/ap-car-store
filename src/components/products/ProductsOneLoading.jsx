import React from 'react';
import './products-one-loading.modules.scss';

export default function CarDetailsSkeleton() {
  return (
    <div className="details-skeleton">
      {/* Top Split Workspace Container */}
      <div className="details-skeleton__workspace">
        
        {/* Left Interactive Column (Donut Chart & Info Panels) */}
        <div className="details-skeleton__left-panel">
          
          {/* Donut Distribution Card Block */}
          <div className="details-skeleton__chart-card">
            <div className="skeleton-box details-skeleton__chart-title" />
            <div className="details-skeleton__chart-donut-wrapper">
              <div className="details-skeleton__chart-circle" />
            </div>
            <div className="details-skeleton__chart-legends">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-box details-skeleton__legend-pill" />
              ))}
            </div>
          </div>

          {/* Core Info Specs Meta Card */}
          <div className="details-skeleton__info-card">
            <div className="skeleton-box details-skeleton__car-title" />
            <div className="skeleton-box details-skeleton__car-specs" />
            
            {/* Inline Action Row Controls */}
            <div className="details-skeleton__actions-row">
              <div className="details-skeleton__actions-left">
                <div className="skeleton-box details-skeleton__btn-icon" />
                <div className="skeleton-box details-skeleton__badge-status" />
                <div className="skeleton-box details-skeleton__price-text" />
                <div className="skeleton-box details-skeleton__counter-box" />
              </div>
              <div className="details-skeleton__actions-right">
                <div className="skeleton-box details-skeleton__btn-action" />
                <div className="skeleton-box details-skeleton__btn-action" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Feature Panel: Car Showcase Image Frame */}
        <div className="details-skeleton__right-panel">
          <div className="skeleton-box details-skeleton__image-frame" />
        </div>

      </div>

      {/* Bottom Structural Section: Category properties panel */}
      <div className="details-skeleton__category-panel">
        <div className="skeleton-box details-skeleton__panel-title" />
        <div className="details-skeleton__panel-row">
          <div className="details-skeleton__panel-meta">
            <div className="skeleton-box details-skeleton__text-bold" />
            <div className="skeleton-box details-skeleton__text-muted" />
          </div>
          <div className="skeleton-box details-skeleton__badge-pill" />
        </div>
      </div>

    </div>
  );
}
