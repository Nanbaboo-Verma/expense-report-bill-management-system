import { Link } from "react-router-dom";
import { ArrowLeft } from "feather-icons-react";

const Header = ({ breadcrumbs = [], onBackClick }) => {
  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="app-header-container">
      <div className="breadcrumb-wrapper">
        <button onClick={handleBack} className="breadcrumb-btn">
          <ArrowLeft size={16} color="#BDBDBD" />
          <span>Bill Approver/Dec-2025</span>
        </button>

        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="breadcrumb-wrapper">
            <span className="breadcrumb-separator">/</span>
            {crumb.path ? (
              <Link to={crumb.path} className="breadcrumb-btn">
                {crumb.label}
              </Link>
            ) : (
              <span className="breadcrumb-active">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Header;
