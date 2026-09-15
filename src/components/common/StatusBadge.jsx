const statusClasses = {
  Pending: "status-badge--pending",
  Approved: "status-badge--approved",
  Rejected: "status-badge--rejected",
  "Partially Approved": "status-badge--partially-approved",
};

const StatusBadge = ({ status = "Pending", size = "md" }) => {
  const currentClass = statusClasses[status] || statusClasses.Pending;
  const sizeClass = size === "sm" ? "status-badge--sm" : "status-badge--md";

  return (
    <span className={`status-badge ${currentClass} ${sizeClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
