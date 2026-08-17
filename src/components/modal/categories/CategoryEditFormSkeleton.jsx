import React from "react";
import "../modal.modules.scss";

export default function CategoryEditFormSkeleton() {
  return (
    <div className="form-skeleton">
      <div className="form-skeleton__fields">
        <div className="skeleton-box form-skeleton__input" />

        <div className="skeleton-box form-skeleton__input form-skeleton__input--large" />
      </div>
      <div className="skeleton-box form-skeleton__submit-btn" />
    </div>
  );
}
