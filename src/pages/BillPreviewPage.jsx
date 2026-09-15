import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatusBadge from "../components/common/StatusBadge";
import { useReports } from "../context/ReportsContext";
import { downloadFile, validateFile, fileToBase64, formatFileSize } from "../utils/fileHelpers";

const BillPreviewPage = () => {
  const { reportId, billId } = useParams();
  const {
    reports,
    updateBillStatus,
    addCommentToBill,
    uploadBillAttachment,
    deleteBillAttachment,
  } = useReports();

  const [activeTab, setActiveTab] = useState("details");
  const [commentInput, setCommentInput] = useState("");
  const [activeAttachmentIndex, setActiveAttachmentIndex] = useState(0);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  const report = reports.find((r) => r.id === reportId);
  const bill = report?.bills?.find((b) => b.id === billId);

  if (!report || !bill) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Header />
          <div className="page-container">
            <h2>Bill Not Found</h2>
            <Link to="/" className="btn-primary" style={{ marginTop: "16px" }}>
              Back to Reports List
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const attachments = bill.attachments || [];
  const currentAttachment = attachments[activeAttachmentIndex] || attachments[0];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    if (currentAttachment && currentAttachment.url) {
      downloadFile(currentAttachment.url, currentAttachment.name || "bill-receipt");
    }
  };

  const handleDelete = () => {
    if (!currentAttachment) return;
    if (window.confirm("Delete this attachment?")) {
      deleteBillAttachment(report.id, bill.id, currentAttachment.id);
      setActiveAttachmentIndex(0);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addCommentToBill(report.id, bill.id, commentInput);
    setCommentInput("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const uniqueId = `att-${file.name.replace(/[^a-zA-Z0-9]/g, "")}-${file.size}`;
      const newAttachment = {
        id: uniqueId,
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        url: base64,
      };
      uploadBillAttachment(report.id, bill.id, newAttachment);
      setActiveAttachmentIndex(attachments.length);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header
          breadcrumbs={[
            { label: report.title, path: `/report/${report.id}` },
            { label: bill.title },
          ]}
        />

        <div className="page-container">
          <div
            className="card"
            style={{
              display: "flex",
              height: "82vh",
              maxHeight: "800px",
              overflow: "hidden",
            }}
          >

            <div
              style={{
                flex: "1.3",
                background: "#F8FAFC",
                borderRight: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                position: "relative",
              }}
            >
              <div
                style={{
                  flex: 1,
                  border: "2px dashed #CBD5E1",
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "auto",
                }}
              >
                {currentAttachment ? (
                  currentAttachment.type?.includes("pdf") ? (
                    <iframe
                      src={currentAttachment.url}
                      title={currentAttachment.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                        transition: "transform 0.2s ease",
                      }}
                    />
                  ) : (
                    <img
                      src={currentAttachment.url}
                      alt={bill.title}
                      style={{
                        maxWidth: "90%",
                        maxHeight: "90%",
                        objectFit: "contain",
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                        transition: "transform 0.2s ease",
                      }}
                    />
                  )
                ) : (
                  <div style={{ textAlign: "center", color: "#94A3B8" }}>
                    No attachment image uploaded
                  </div>
                )}
              </div>


              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#FFFFFF",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {attachments.map((att, idx) => (
                    <div
                      key={att.id || idx}
                      onClick={() => setActiveAttachmentIndex(idx)}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "6px",
                        border: activeAttachmentIndex === idx ? "2px solid #6B46C1" : "1px solid #CBD5E1",
                        overflow: "hidden",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#F8FAFC",
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {att.type?.includes("pdf") ? "PDF" : <img src={att.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                  ))}

                  <label
                    title="Upload attachment"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "6px",
                      border: "1px dashed #6B46C1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#6B46C1",
                      fontSize: "18px",
                      backgroundColor: "#F3E8FF",
                    }}
                  >
                    +
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button onClick={handleZoomIn} style={btnStyle}>🔍+</button>
                  <button onClick={handleZoomOut} style={btnStyle}>🔍-</button>
                  <button onClick={handleRotate} style={btnStyle}>↻</button>
                  <button onClick={handleDownload} style={btnStyle}>⤓</button>
                  <button onClick={handleDelete} style={{ ...btnStyle, color: "#EF4444" }}>🗑</button>
                </div>
              </div>
            </div>

            <div style={{ flex: "1", display: "flex", flexDirection: "column", padding: "24px", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#64748B" }}>
                    Uploaded on - {bill.uploadedDate}
                  </div>
                  <h2 style={{ fontSize: "20px", color: "#1E293B", margin: "4px 0 12px 0", fontWeight: "700" }}>
                    {bill.title}
                  </h2>
                </div>
                <StatusBadge status={bill.status} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", color: "#64748B" }}>Amount</div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#6B46C1" }}>
                  Rs. {Number(bill.amount).toLocaleString("en-IN")}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                <button
                  onClick={() => updateBillStatus(report.id, bill.id, "Rejected")}
                  className="btn-outline-danger"
                  style={{ borderRadius: "20px", padding: "6px 24px" }}
                >
                  Reject
                </button>
                <button
                  onClick={() => updateBillStatus(report.id, bill.id, "Approved")}
                  className="btn-outline-success"
                  style={{ borderRadius: "20px", padding: "6px 24px" }}
                >
                  Accept
                </button>
              </div>

              <div style={{ display: "flex", borderBottom: "1px solid #E2E8F0", marginBottom: "20px", gap: "24px" }}>
                <button
                  onClick={() => setActiveTab("details")}
                  style={{
                    background: "none",
                    border: "none",
                    paddingBottom: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: activeTab === "details" ? "#6B46C1" : "#64748B",
                    borderBottom: activeTab === "details" ? "2px solid #6B46C1" : "none",
                    cursor: "pointer",
                  }}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  style={{
                    background: "none",
                    border: "none",
                    paddingBottom: "10px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: activeTab === "comments" ? "#6B46C1" : "#64748B",
                    borderBottom: activeTab === "comments" ? "2px solid #6B46C1" : "none",
                    cursor: "pointer",
                  }}
                >
                  Comments ({(bill.comments || []).length})
                </button>
              </div>

              {activeTab === "details" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>Client Name</div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B", marginTop: "2px" }}>
                      {bill.clientName || "Sai Enterprise"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>Project ID</div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#6B46C1", marginTop: "2px" }}>
                      {bill.projectId || "PJ-0001"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>Wallet</div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B", marginTop: "2px" }}>
                      {bill.wallet}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>Category</div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B", marginTop: "2px" }}>
                      {bill.category}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>Merchant</div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B", marginTop: "2px" }}>
                      {bill.merchant}
                    </div>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>Remarks</div>
                    <div style={{ fontSize: "14px", color: "#475569", marginTop: "2px" }}>
                      {bill.remarks || "-"}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                    {(bill.comments || []).map((c) => (
                      <div key={c.id} style={{ display: "flex", gap: "10px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "#F3E8FF",
                            color: "#6B46C1",
                            fontSize: "12px",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "32px",
                          }}
                        >
                          {c.authorInitials || "SA"}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                            <span style={{ fontSize: "13px", fontWeight: "700", color: "#1E293B" }}>
                              {c.author}
                            </span>
                            <span style={{ fontSize: "11px", color: "#94A3B8" }}>{c.timestamp}</span>
                          </div>
                          <div style={{ fontSize: "13px", color: "#475569", marginTop: "4px" }}>
                            {c.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleCommentSubmit}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "16px",
                      paddingTop: "12px",
                      borderTop: "1px solid #E2E8F0",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Add New Comment"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "9px 14px",
                        borderRadius: "20px",
                        border: "1px solid #CBD5E1",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#6B46C1",
                        fontWeight: "700",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const btnStyle = {
  background: "#F8FAFC",
  border: "1px solid #CBD5E1",
  borderRadius: "6px",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "13px",
  color: "#475569",
};

export default BillPreviewPage;
