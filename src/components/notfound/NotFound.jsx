import Link from 'next/link';
import './notfound.modules.scss';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__error-code">404</h1>
        <h2 className="not-found__title">Page Not Found</h2>
        <p className="not-found__subtitle">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="not-found__btn">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
