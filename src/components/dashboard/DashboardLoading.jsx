import React from 'react';
import "./dashboard.modules.scss";

export default function CarServiceSkeleton() {
  return (
    <div className="dashboard-skeleton">
      
      {/* 1. Top Header */}
      <div className="dashboard-skeleton__top">
        <div className="skeleton-box dashboard-skeleton__title" />
        <div className="skeleton-box dashboard-skeleton__tit-sub" />
      </div>

      {/* 2. Main Double Chart Layout Row */}
      <div className="dashboard-skeleton__charts-grid">
        
        {/* Left Chart Card: Vehicle Categories */}
        <div className="dashboard-skeleton__chart">
          <div className="skeleton-box dashboard-skeleton__chart-title" />
          <div className="dashboard-skeleton__chart-bottom">
            <div className="dashboard-skeleton__chart-left" />
            <div className="dashboard-skeleton__chart-right">
              <div className="skeleton-box dashboard-skeleton__chart-right-title" />
              <div className="dashboard-skeleton__chart-right-list">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="dashboard-skeleton__chart-card">
                    <div className="dashboard-skeleton__chart-item-left">
                      <div className="skeleton-box dashboard-skeleton__chart-dot" />
                      <div className="skeleton-box dashboard-skeleton__chart-text-block" />
                    </div>
                    <div className="skeleton-box dashboard-skeleton__chart-right-value" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Chart Card: Salon/City Categories */}
        <div className="dashboard-skeleton__chart">
          <div className="skeleton-box dashboard-skeleton__chart-title" />
          <div className="dashboard-skeleton__chart-bottom">
            <div className="dashboard-skeleton__chart-left" />
            <div className="dashboard-skeleton__chart-right">
              <div className="skeleton-box dashboard-skeleton__chart-right-title" />
              <div className="dashboard-skeleton__chart-right-list">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="dashboard-skeleton__chart-card">
                    <div className="dashboard-skeleton__chart-item-left">
                      <div className="skeleton-box dashboard-skeleton__chart-dot" />
                      <div className="skeleton-box dashboard-skeleton__chart-text-block" />
                    </div>
                    <div className="skeleton-box dashboard-skeleton__chart-right-value" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. 3-Column Middle Statistics Section */}
      <div className="dashboard-skeleton__cen-stats">
        
        {/* Column 1: Products */}
        <div className="dashboard-skeleton__cen-stats-items">
          <div className="skeleton-box dashboard-skeleton__censts-title" />
          <div className="dashboard-skeleton__censts-ul">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="dashboard-skeleton__censts-list">
                <div className="skeleton-box sk-label" />
                <div className="skeleton-box sk-val" />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Categories */}
        <div className="dashboard-skeleton__cen-stats-items">
          <div className="skeleton-box dashboard-skeleton__censts-title" />
          <div className="dashboard-skeleton__censts-ul">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="dashboard-skeleton__censts-list">
                <div className="skeleton-box sk-label" />
                <div className="skeleton-box sk-val" />
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Stock */}
        <div className="dashboard-skeleton__cen-stats-items">
          <div className="skeleton-box dashboard-skeleton__censts-title" />
          <div className="dashboard-skeleton__censts-ul">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="dashboard-skeleton__censts-list">
                <div className="skeleton-box sk-label" />
                <div className="skeleton-box sk-val-large" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Bottom Collapsible Accordion Banners */}
      <div className="dashboard-skeleton__bottom-accordions">
        <div className="skeleton-box dashboard-skeleton__accordion-bar" />
        <div className="skeleton-box dashboard-skeleton__accordion-bar" />
      </div>

    </div>
  );
}
