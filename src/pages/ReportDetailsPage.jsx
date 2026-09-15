import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatusBadge from "../components/common/StatusBadge";
import SearchFilterBar from "../components/common/SearchFilterBar";
import FileUploadModal from "../components/modals/FileUploadModal";
import BillPreviewModal from "../components/bill/BillPreviewModal";
import { useReports } from "../context/ReportsContext";
import Button from "../components/common/Button";
import { Download } from "feather-icons-react";
import NameBadge from "../components/common/NameBadge";

const ReportDetailsPage = () => {
  const { id } = useParams();
  const {
    reports,
    updateBillStatus,
    updateReportStatus,
    batchUpdateBillsStatus,
    addCommentToBill,
    addBillToReport,
    uploadBillAttachment,
    deleteBillAttachment,
  } = useReports();

  const report = reports.find((r) => r.id === id);

  const [activeTab, setActiveTab] = useState("expenses");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBillIds, setSelectedBillIds] = useState([]);


  const [isAddBillOpen, setIsAddBillOpen] = useState(false);
  const [previewBillIndex, setPreviewBillIndex] = useState(null);

  if (!report) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Header />
          <div className="page-container">
            <h2>Expense Report Not Found</h2>
            <Link to="/" className="btn-primary" style={{ marginTop: "16px" }}>
              Back to Reports List
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const filteredBills = (report.bills || []).filter((bill) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      bill.title?.toLowerCase().includes(q) ||
      bill.category?.toLowerCase().includes(q) ||
      bill.merchant?.toLowerCase().includes(q) ||
      bill.wallet?.toLowerCase().includes(q)
    );
  });

  // Checkbox multi-select logic
  // const handleSelectAll = (e) => {
  //   if (e.target.checked) {
  //     setSelectedBillIds(filteredBills.map((b) => b.id));
  //   } else {
  //     setSelectedBillIds([]);
  //   }
  // };

  const handleSelectBill = (billId) => {
    if (selectedBillIds.includes(billId)) {
      setSelectedBillIds(selectedBillIds.filter((bId) => bId !== billId));
    } else {
      setSelectedBillIds([...selectedBillIds, billId]);
    }
  };

  const handleBatchAction = (status) => {
    if (selectedBillIds.length === 0) return;
    batchUpdateBillsStatus(report.id, selectedBillIds, status);
    setSelectedBillIds([]);
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header breadcrumbs={[{ label: "View Report" }]} />

        <div className="page-container">
          <div className="card employee-summary-card">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>


              <div className="employee-info-group">
                <div className="employee-info">
                  <div className="avatar-circle avatar-circle--lg">
                    {report.employee?.initials || "SA"}
                  </div>
                  <div>
                    <div className="info-label">
                      {report.employee?.id || "Emp. ID - 0001"}
                    </div>
                    <div className="info-val--bold">
                      {report.employee?.name || "Saksham Agarwal"}
                    </div>
                  </div>
                </div>
                <div className="border-right"></div>

                <div>
                  <div className="info-label">Grade</div>
                  <div className="info-val">
                    {report.employee?.grade || "II"}
                  </div>
                </div>

                <div className="border-right"></div>

                <div>
                  <div className="info-label">Department</div>
                  <div className="info-val">
                    {report.employee?.department || "Technology"}
                  </div>
                </div>
                <div className="border-right"></div>

                <div>
                  <div className="info-label">Email ID</div>
                  <div className="info-val">
                    {report.employee?.email || "sakshamagarwal@giftryt.com"}
                  </div>
                </div>
                <div className="border-right"></div>
              </div>
            </div>


            <div className="header-action-group">
              <Button type="outline" size="small" icon={<Download size={16} color="#430DB4" />}></Button>
              <Button type="outline" size="small" onClick={() => updateReportStatus(report.id, "Rejected")}>Reject</Button>
              <Button size="small" onClick={() => updateReportStatus(report.id, "Approved")}>Approve</Button>
            </div>
          </div>

          <div className="details-grid-layout">
            <div className="bills-list-column">
              <div className="report-summary-row">
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <h2 className="page-title">{report.title}</h2>
                  <StatusBadge status={report.status} />
                </div>

                <div className="stat-counter-group">
                  <div>
                    <div className="stat-label">Total Amount</div>
                    <div className="stat-val">
                      Rs. {Number(report.amount).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="border-right"></div>
                  <div>
                    <div className="stat-label">Amount Approved</div>
                    <div className="stat-val">
                      Rs. {Number(report.approvedAmount || 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sub-header-nav-row">
                <div className="filter-tabs-group">
                  <button
                    onClick={() => setActiveTab("expenses")}
                    className={`tab-btn ${activeTab === "expenses" ? "tab-btn--active" : ""}`}
                  >
                    Expenses
                  </button>

                  <button
                    onClick={() => setActiveTab("mileage")}
                    className={`tab-btn ${activeTab === "mileage" ? "tab-btn--active" : ""}`}
                  >
                    Mileage Expense
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {selectedBillIds.length > 0 && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleBatchAction("Approved")}
                        className="btn-outline-success"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        Approve Selected ({selectedBillIds.length})
                      </button>
                      <button
                        onClick={() => handleBatchAction("Rejected")}
                        className="btn-outline-danger"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        Reject Selected ({selectedBillIds.length})
                      </button>
                    </div>
                  )}

                  <SearchFilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onRefresh={() => setSearchQuery("")}
                    onSort={() => setSearchQuery("")}
                  />

                  {/* <button
                    onClick={() => setIsAddBillOpen(true)}
                    className="btn-primary"
                    style={{ padding: "8px 14px", fontSize: "13px" }}
                  >
                    + Add Bill
                  </button> */}
                </div>
              </div>
              {activeTab === "mileage" ? (
                <div className="card" style={{ padding: "30px", textAlign: "center", color: "#94A3B8" }}>
                  No mileage expenses logged for this report.
                </div>
              ) : filteredBills.length === 0 ? (
                <div className="card" style={{ padding: "30px", textAlign: "center", color: "#94A3B8" }}>
                  No bill expenses found. Click "+ Add Bill" to attach a new bill.
                </div>
              ) : (
                <>
                  {filteredBills.map((bill, index) => (
                    <div key={bill.id} className="card bill-card">
                      <div className="flex gap16">
                        <input
                          type="checkbox"
                          checked={selectedBillIds.includes(bill.id)}
                          onChange={() => handleSelectBill(bill.id)}
                          className="checkbox"
                        />
                        <div className="flex gap24">
                          <div
                            onClick={() => setPreviewBillIndex(index)}
                            className="bill-preview-box"
                          >
                            {bill.attachments && bill.attachments.length > 0 ? (
                              bill.attachments[0].type?.includes("pdf") ? (
                                <div style={{ fontSize: "11px", fontWeight: "bold", color: "#DC2626" }}>
                                  PDF Document
                                </div>
                              ) : (
                                <img
                                  src={bill.attachments[0].url}
                                  alt=""
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              )
                            ) : (
                              <span style={{ fontSize: "16px", color: "#BDBDBD", fontWeight: "400" }}>
                                Preview
                              </span>
                            )}
                          </div>

                          <div className="flex column space-between info-label">
                            <div>
                              <div className="bill-info-title">Uploaded on - {bill.uploadedDate}</div>
                              <h4 className="bill-purple-val" >
                                {bill.title}
                              </h4>
                            </div>


                            {bill.status === "Pending" ? (
                              <div style={{ display: "flex", gap: "4px" }}>
                                <Button type="outline"
                                  variant="danger"
                                  size="small"
                                  onClick={() => updateBillStatus(report.id, bill.id, "Rejected")}>Reject</Button>
                                <Button type="outline"
                                  variant="success"
                                  size="small"
                                  onClick={() => updateBillStatus(report.id, bill.id, "Approved")}>Accept</Button>

                              </div>
                            ) : (
                              <StatusBadge status={bill.status} size="sm" />
                            )}

                          </div>

                          <div className="flex column space-between ">
                            <div>
                              <div className="bill-info-title">Wallet</div>
                              <div className="bill-purple-val">{bill.wallet}</div>
                            </div>
                            <div>
                              <div className="bill-info-title">Merchant</div>
                              <div className="bill-purple-val">{bill.merchant}</div>
                            </div>
                          </div>
                          <div>
                            <div className="bill-info-title">Category</div>
                            <div className="bill-purple-val">{bill.category}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex column space-between">
                        <div style={{ textAlign: "right" }}>
                          <div className="info-label bill-info-title">Amount</div>
                          <div className="bill-amount-val">
                            Rs. {Number(bill.amount).toLocaleString("en-IN")}
                          </div>
                        </div>

                        <button
                          onClick={() => setPreviewBillIndex(index)}
                          className="link-view-details"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="card right-policy-card">
              <div>
                <div className="info-label">
                  Approver:
                </div>
                <div style={{ marginTop: "8px", marginBottom: "12px" }}>
                  <NameBadge initials={report.approver?.initials || "TS"} name={report.approver?.name || "Tanish Shah"} />
                </div>

                <div>
                  <a
                    href="#history"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Report History: Submitted on " + report.uploadedDate + " by " + report.employee?.name);
                    }}
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#430DB4",
                      textDecoration: "underline",
                    }}
                  >
                    View Report History
                  </a>
                </div>
              </div>

              <div>
                <div className="info-label" style={{ marginBottom: "4px" }}>
                  Wallet Policies
                </div>
                <div style={{ fontSize: "14px", fontWeight: "400", color: "#080808" }}>
                  {report.walletPolicies || "Food Wallet, Travel Wallet"}
                </div>
              </div>

              <div>
                <div className="info-label" style={{ marginBottom: "4px" }}>
                  Additional Documents
                </div>
                <div style={{ fontSize: "13px", color: "#475569" }}>
                  {report.additionalDocs || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FileUploadModal
        isOpen={isAddBillOpen}
        onClose={() => setIsAddBillOpen(false)}
        onSubmit={(billData) => addBillToReport(report.id, billData)}
      />

      {previewBillIndex !== null && filteredBills[previewBillIndex] && (
        <BillPreviewModal
          isOpen={previewBillIndex !== null}
          onClose={() => setPreviewBillIndex(null)}
          bill={filteredBills[previewBillIndex]}
          billIndex={previewBillIndex}
          totalBills={filteredBills.length}
          onStatusChange={(billId, newStatus) => updateBillStatus(report.id, billId, newStatus)}
          onAddComment={(billId, text) => addCommentToBill(report.id, billId, text)}
          onUploadAttachment={(billId, attachment) => uploadBillAttachment(report.id, billId, attachment)}
          onDeleteAttachment={(attachmentId) => deleteBillAttachment(report.id, filteredBills[previewBillIndex].id, attachmentId)}
          onNextBill={() => setPreviewBillIndex((prev) => Math.min(prev + 1, filteredBills.length - 1))}
          onPrevBill={() => setPreviewBillIndex((prev) => Math.max(prev - 1, 0))}
        />
      )}
    </div>
  );
};

export default ReportDetailsPage;
