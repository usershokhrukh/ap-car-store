import React from 'react';
import './settings.modules.scss';

export default function SettingsSkeleton() {
  return (
    <div className="settings-skeleton">
      <div className="skeleton-box settings-skeleton__main-title" />

      {/* Top Section: Split Information Cards */}
      <div className="settings-skeleton__row">
        
        {/* API Status Info Card */}
        <div className="settings-skeleton__card">
          <div className="skeleton-box settings-skeleton__card-title" />
          <div className="skeleton-box settings-skeleton__text-med" />
          <div className="skeleton-box settings-skeleton__text-short" />
        </div>

        {/* Administrator Details Card */}
        <div className="settings-skeleton__card">
          <div className="skeleton-box settings-skeleton__card-title" />
          <div className="skeleton-box settings-skeleton__text-med" />
          <div className="skeleton-box settings-skeleton__text-long" />
        </div>

      </div>

      <div className="skeleton-box settings-skeleton__section-title" />

      {/* Bottom Section: Theme Mode/Appearance Switcher Panel */}
      <div className="settings-skeleton__appearance-panel">
        <div className="settings-skeleton__theme-grid">
          
          {/* Light Theme Theme Preview Card */}
          <div className="skeleton-box settings-skeleton__theme-box">
            <div className="skeleton-box settings-skeleton__theme-label" />
          </div>

          {/* Dark Theme Theme Preview Card */}
          <div className="skeleton-box settings-skeleton__theme-box settings-skeleton__theme-box--dark">
            <div className="skeleton-box settings-skeleton__theme-label" />
          </div>

        </div>
      </div>
    </div>
  );
}
