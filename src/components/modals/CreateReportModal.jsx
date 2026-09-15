import { useState } from "react";

const CreateReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [employeeName, setEmployeeName] = useState("Saksham Agarwal");
  const [approver, setApprover] = useState("Tanish Shah");
  const [month, setMonth] = useState("Dec-2025");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      employeeName,
      approver,
      month,
      bills: [],
    });

    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "18px",
            borderBottom: "1px solid #E2E8F0",
            paddingBottom: "12px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px", color: "#1E293B" }}>
            Create New Expense Report
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              color: "#94A3B8",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
              Report Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dec Report - 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
              Employee Name
            </label>
            <input
              type="text"
              required
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Approver
              </label>
              <select
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  backgroundColor: "#FFF",
                }}
              >
                <option value="Tanish Shah">Tanish Shah</option>
                <option value="Arjun Patel">Arjun Patel</option>
                <option value="Meera Jain">Meera Jain</option>
                <option value="Nina Kaur">Nina Kaur</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Month Period
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  backgroundColor: "#FFF",
                }}
              >
                <option value="Dec-2025">Dec-2025</option>
                <option value="Jan-2026">Jan-2026</option>
                <option value="Feb-2026">Feb-2026</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "12px",
              paddingTop: "14px",
              borderTop: "1px solid #E2E8F0",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 16px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                background: "#FFF",
                color: "#475569",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReportModal;
