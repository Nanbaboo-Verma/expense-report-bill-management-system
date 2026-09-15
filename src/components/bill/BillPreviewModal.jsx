import { useState } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Trash2,
  Plus,
  RotateCcw,
} from "feather-icons-react";
import StatusBadge from "../common/StatusBadge";
import { downloadFile, validateFile, fileToBase64, formatFileSize } from "../../utils/fileHelpers";
import Button from "../common/Button";
import NameBadge from "../common/NameBadge";

const BillPreviewModal = ({
  isOpen = true,
  onClose,
  bill,
  billIndex = 0,
  totalBills = 1,
  onStatusChange,
  onAddComment,
  onUploadAttachment,
  onDeleteAttachment,
  onNextBill,
  onPrevBill,
  isInline = true,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [commentInput, setCommentInput] = useState("");
  const [activeAttachmentIndex, setActiveAttachmentIndex] = useState(0);

  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen || !bill) return null;

  const attachments = bill.attachments || [];
  const currentAttachment = attachments[activeAttachmentIndex] || attachments[0];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));


  const handleDownload = () => {
    if (currentAttachment && currentAttachment.url) {
      downloadFile(currentAttachment.url, currentAttachment.name || "bill-receipt");
    }
  };

  const handleDelete = () => {
    if (!currentAttachment) return;
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      onDeleteAttachment(currentAttachment.id);
      setActiveAttachmentIndex(0);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(bill.id, commentInput);
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
      onUploadAttachment(bill.id, newAttachment);
      setActiveAttachmentIndex(attachments.length);
    } catch (err) {
      console.error(err);
      alert("Error uploading attachment.");
    }
  };

  const content = (
    <div className={isInline ? "bill-preview-view" : "modal-container"}>

      <div className="modal-header-bar">

        <h3 className="modal-header-title">
          Expense Details ({billIndex + 1} of {totalBills})
        </h3>


        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={24} color="#080808" />
        </button>
      </div>


      <div className="modal-split-body gap8">

        <div className="modal-left-viewer">

          <div className="viewer-frame">
            {currentAttachment ? (
              currentAttachment.type?.includes("pdf") ? (
                <iframe
                  src={currentAttachment.url}
                  title={currentAttachment.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    transform: `scale(${zoomLevel}) rotate(0deg)`,
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
                    transform: `scale(${zoomLevel}) rotate(0deg)`,
                    transition: "transform 0.2s ease",
                  }}
                />
              )
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "16px", color: "#BDBDBD", fontWeight: "400" }}>Preview</div>
              </div>
            )}

            <div className="viewer-bottom-bar gap16">
              <div className="flex align-items-center gap4">
                {currentAttachment ? <>{attachments.map((att, idx) => (
                  <div
                    key={att.id || idx}
                    onClick={() => setActiveAttachmentIndex(idx)}
                    className={`thumb-item thumb-add-btn ${activeAttachmentIndex === idx ? "thumb-item--active" : ""}`}
                  >
                    {att.type?.includes("pdf") ? "PDF" : <img src={att.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                ))}
                </> :

                  <div className="thumb-add-btn">
                    <div style={{ fontSize: "9px", color: "#BDBDBD", fontWeight: "400" }}>Preview</div>
                  </div>}

                <label title="Upload attachment" className="thumb-add-btn">
                  <Plus size={24} color="#BDBDBD" />
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              <div className="flex align-items-center gap24">

                <div className="flex align-items-center gap8">
                  <button onClick={handleZoomIn} title="Zoom In" className="tool-btn">
                    <ZoomIn size={27} color="#4F4F4F" />
                  </button>
                  <button onClick={handleZoomOut} title="Zoom Out" className="tool-btn">
                    <ZoomOut size={27} color="#4F4F4F" />
                  </button>
                </div>

                <div className="flex align-items-center gap8">
                  <button
                    onClick={onPrevBill}
                    disabled={billIndex === 0}
                    className="tool-btn">
                    <RotateCcw color="#4F4F4F" size={24} />
                  </button>
                  <button
                    disabled={billIndex === totalBills - 1}
                    onClick={onNextBill}
                    className="tool-btn">
                    <RotateCw color="#4F4F4F" size={24} />
                  </button>
                </div>
                <button onClick={handleDownload} title="Download File" className="tool-btn">
                  <Download size={24} color="#4F4F4F" />
                </button>
                <button
                  onClick={handleDelete}
                  title="Delete Attachment"
                  className="tool-btn"

                >
                  <Trash2 size={24} color="#C83333" />
                </button>
              </div>
            </div>
          </div>


        </div>

        <div className="modal-right-details gap8">
          <div className="hotel-booking_info">
            <div className="flex space-between align-items-start" style={{ borderBottom: "1px solid #F2F2F2", paddingBottom: '4px' }}>
              <div>
                <div className="info-label">
                  Uploaded on - {bill.uploadedDate}
                </div>
                <h2 className="bill-purple-val">
                  {bill.title}
                </h2>
              </div>
              <StatusBadge status={bill.status} />
            </div>

            <div style={{ padding: "16px 0" }}>
              <div className="info-label">Amount</div>
              <div className="amount-purple-lg">
                Rs. {Number(bill.amount).toLocaleString("en-IN")}
              </div>
            </div>

            <div className="flex gap4">
              <Button variant="danger" type="outline" size="small" onClick={() => onStatusChange(bill.id, "Rejected")}>Reject</Button>
              <Button variant="success" type="outline" size="small" onClick={() => onStatusChange(bill.id, "Approved")}>Accept</Button>
            </div>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #E2E8F0",
                marginBottom: "20px",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setActiveTab("details")}
                className={`tab-btn ${activeTab === "details" ? "tab-btn--active" : ""}`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`tab-btn ${activeTab === "comments" ? "tab-btn--active" : ""}`}
              >
                Comments ({(bill.comments || []).length})
              </button>
            </div>

            {activeTab === "details" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: "16px",
                }}
              >
                <div style={{ gridColumn: "span 2", padding: "0 12px" }}>
                  <div className="info-label">Client Name</div>
                  <div className="bill-purple-val">
                    {bill.clientName || "Sai Enterprise"}
                  </div>
                </div>

                <div style={{ gridColumn: "span 3", padding: "0 12px" }}>
                  <div className="info-label">Project ID</div>
                  <div className="bill-purple-val">
                    {bill.projectId || "PJ-0001"}
                  </div>
                </div>
                <div
                  style={{
                    gridColumn: "1 / -1",
                    borderBottom: "1px solid #F2F2F2",
                    margin: "0 0 0 0",
                  }}
                />

                <div style={{ gridColumn: "span 2", padding: "0 12px" }}>
                  <div className="info-label">Wallet</div>
                  <div className="bill-purple-val">{bill.wallet}</div>
                </div>

                <div style={{ gridColumn: "span 2", padding: "0 12px" }}>
                  <div className="info-label">Category</div>
                  <div className="bill-purple-val">{bill.category}</div>
                </div>

                <div style={{ gridColumn: "span 2", padding: "0 12px" }}>
                  <div className="info-label">Merchant</div>
                  <div className="bill-purple-val">{bill.merchant}</div>
                </div>

                <div
                  style={{
                    gridColumn: "1 / -1",
                    borderBottom: "1px solid #F2F2F2",
                    margin: "0 0 0 0",
                  }}
                />

                <div style={{ gridColumn: "span 2", padding: "12px" }}>
                  <div className="info-label">Remarks</div>
                  <div style={{ fontSize: "14px", color: "#475569", marginTop: "2px" }}>
                    {bill.remarks || "-"}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px", paddingRight: "4px" }}>
                  {(bill.comments || []).length === 0 ? (
                    <div style={{ color: "#94A3B8", fontSize: "12px", textAlign: "center", padding: "20px 0" }}>
                      No comments yet. Be the first to leave a comment!
                    </div>
                  ) : (
                    bill.comments.map((comment) => (
                      <div key={comment.id}>
                        <div className="flex align-items-center">
                          <NameBadge name={comment.author} initials={comment.authorInitials} />
                          <span style={{ fontSize: "11px", color: "#94A3B8", marginLeft: "10px" }}>
                            {comment.timestamp}
                          </span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#080808",
                              padding: "8px",
                              fontWeight: "400"
                            }}
                          >
                            {comment.text}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form
                  onSubmit={handleCommentSubmit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    paddingTop: "16px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Add New Comment"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="comment-input-field"
                  />
                  <button type="submit" className="comment-add-btn">
                    Add
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return content;
  }

  return <div className="modal-overlay">{content}</div>;
};

export default BillPreviewModal;
