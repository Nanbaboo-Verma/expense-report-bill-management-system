import { useState } from "react";
import { validateFile, fileToBase64, formatFileSize } from "../../utils/fileHelpers";

const FileUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Air Travel");
  const [wallet, setWallet] = useState("Travel Wallet");
  const [merchant, setMerchant] = useState("");
  const [clientName, setClientName] = useState("Sai Enterprise");
  const [projectId] = useState("PJ-0001");
  const [remarks] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = async (file) => {
    setErrorMsg("");
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setSelectedFile(file);
      setFileBase64(base64);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to process file upload.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Please enter an expense title.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setErrorMsg("Please enter a valid expense amount.");
      return;
    }

    setIsSubmitting(true);

    const attachments = selectedFile
      ? [
        {
          id: "att-" + Date.now(),
          name: selectedFile.name,
          type: selectedFile.type,
          size: formatFileSize(selectedFile.size),
          url: fileBase64,
        },
      ]
      : [];

    onSubmit({
      title,
      amount: Number(amount),
      category,
      wallet,
      merchant: merchant || "Vendor",
      clientName,
      projectId,
      remarks,
      attachments,
    });

    setIsSubmitting(false);
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
          maxWidth: "580px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          padding: "28px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            borderBottom: "1px solid #E2E8F0",
            paddingBottom: "14px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px", color: "#1E293B" }}>
            Add New Expense Bill
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

        {errorMsg && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FCA5A5",
              color: "#DC2626",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Title & Amount */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Expense Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Air Travel Expense"
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
                Amount (Rs.) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Category & Wallet */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  backgroundColor: "#FFF",
                }}
              >
                <option value="Air Travel">Air Travel</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Food">Food</option>
                <option value="Local Travel">Local Travel</option>
                <option value="Supplies">Supplies</option>
                <option value="Subscriptions">Subscriptions</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Wallet
              </label>
              <select
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                  backgroundColor: "#FFF",
                }}
              >
                <option value="Travel Wallet">Travel Wallet</option>
                <option value="Food Wallet">Food Wallet</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Software Wallet">Software Wallet</option>
              </select>
            </div>
          </div>

          {/* Merchant & Client */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
                Merchant
              </label>
              <input
                type="text"
                placeholder="e.g. Ixigo, MakeMyTrip, Swiggy"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
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
                Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Drag & Drop File Upload Container */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>
              Upload Bill Receipt Attachment (JPG, PNG, JPEG, PDF)
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: isDragOver ? "2px dashed #6B46C1" : "2px dashed #CBD5E1",
                backgroundColor: isDragOver ? "#F3E8FF" : "#F8FAFC",
                borderRadius: "12px",
                padding: "24px 16px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => document.getElementById("file-input-modal")?.click()}
            >
              <input
                id="file-input-modal"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              <div style={{ color: "#6B46C1", marginBottom: "8px" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              {selectedFile ? (
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B" }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
                    {formatFileSize(selectedFile.size)} • Click or drag to replace
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B" }}>
                    Click or drag & drop file to upload
                  </div>
                  <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>
                    Supports JPG, PNG, JPEG, PDF (Max 8MB)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "10px",
              paddingTop: "14px",
              borderTop: "1px solid #E2E8F0",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "9px 18px",
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                padding: "9px 22px",
              }}
            >
              {isSubmitting ? "Adding..." : "Add Expense Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;
