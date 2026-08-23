import React from "react";
import "./modal.modules.scss";

export default function ProductFormSkeleton() {
  return (
    <div className="form-skeleton">
      {/* Input Group List */}
      <div className="form-skeleton__fields">
        {/* Name Input Field */}
        <div className="skeleton-box form-skeleton__input" />

        {/* Description Textarea Field */}
        <div className="skeleton-box form-skeleton__input form-skeleton__input--large" />

        {/* Price Input Field */}
        <div className="skeleton-box form-skeleton__input" />

        {/* Stock Input Field */}
        <div className="skeleton-box form-skeleton__input" />

        {/* Image URL Input Field */}
        <div className="skeleton-box form-skeleton__input" />
      </div>

      {/* Category Dropdown Selection Row */}
      <div className="form-skeleton__row">
        <div className="skeleton-box form-skeleton__label" />
        <div className="skeleton-box form-skeleton__dropdown" />
      </div>
      <div className="form-skeleton__row">
        <div className="skeleton-box form-skeleton__label" />
        <div className="skeleton-box form-skeleton__dropdown" />
      </div>

      {/* Gradient Submit Action Button Block */}
      <div className="skeleton-box form-skeleton__submit-btn" />
    </div>
  );
}
