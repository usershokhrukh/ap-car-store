import './dashboard.modules.scss';

export default function CarServiceSkeleton() {
  return (
    <div className="dashboard-skeleton">
      {/* Top Header */}
      <div className="dashboard-skeleton__top">
        <div className="skeleton-box dashboard-skeleton__title" />
        <div className="skeleton-box dashboard-skeleton__tit-sub" />
      </div>

      {/* Center Layout Container */}
      <div className="dashboard-skeleton__center">
        
        {/* Left Column Structure */}
        <div className="dashboard-skeleton__cen-stats">
          
          {/* Card 1: Products */}
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

          {/* Card 2: Categories */}
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

          {/* Card 3: Stock */}
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

        {/* Right Column Structure: Distribution Total Chart */}
        <div className="dashboard-skeleton__chart">
          <div className="skeleton-box dashboard-skeleton__chart-title" />
          
          <div className="dashboard-skeleton__chart-bottom">
            {/* Pulsing Donut Ring Wireframe */}
            <div className="dashboard-skeleton__chart-left" />
            
            {/* Chart Legend List Block */}
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

      </div>
      <div className="skeleton-box dashboard-skeleton__tit-sub" />
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
