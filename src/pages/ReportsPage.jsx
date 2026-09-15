import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatusBadge from "../components/common/StatusBadge";
import SearchFilterBar from "../components/common/SearchFilterBar";
import CreateReportModal from "../components/modals/CreateReportModal";
import { useReports } from "../context/ReportsContext";
import NameBadge from "../components/common/NameBadge";

const ReportsPage = () => {
  const {
    reports,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedMonth,
    setSelectedMonth,
    createNewReport,
    resetToMock,
  } = useReports();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);

  const pendingCount = reports.filter((r) => r.status === "Pending").length;
  const totalCount = reports.length;

  const filteredReports = reports
    .filter((report) => {
      if (activeTab === "pending" && report.status !== "Pending") {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const empName = report.employee?.name?.toLowerCase() || "";
        const title = report.title?.toLowerCase() || "";
        const approver = report.approver?.name?.toLowerCase() || "";
        return empName.includes(q) || title.includes(q) || approver.includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortAsc) {
        return a.amount - b.amount;
      }
      return b.amount - a.amount;
    });

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        <div className="page-container">
          <div className="page-header-row">
            <h1 className="page-title">Reports</h1>
          </div>

          <div className="sub-header-nav-row">
            <div className="filter-tabs-group">
              <button
                onClick={() => setActiveTab("pending")}
                className={`tab-btn ${activeTab === "pending" ? "tab-btn--active" : ""}`}
              >
                Pending ({String(pendingCount).padStart(2, "0")})
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`tab-btn ${activeTab === "all" ? "tab-btn--active" : ""}`}
                >
                  All Reports ({String(totalCount).padStart(2, "0")})
                </button>

                {/* Month Selector Dropdown */}
                {/* <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="month-select"
                >
                  <option value="Dec-2025">Dec-2025</option>
                  <option value="Jan-2026">Jan-2026</option>
                  <option value="Feb-2026">Feb-2026</option>
                </select> */}
              </div>
            </div>

            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onRefresh={resetToMock}
              onSort={() => setSortAsc(!sortAsc)}
            />
          </div>

          <div className="card reports-table-card">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>SR NO.</th>
                  <th>EMPLOYEE NAME</th>
                  <th>REIMBURSEMENT REPORT</th>
                  <th>NO. OF BILLS</th>
                  <th>APPROVER</th>
                  <th>STATUS</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                      No expense reports found.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <span style={{ fontSize: "14px", fontWeight: "400", color: "#080808" }}>
                          {report.srNo}
                        </span>
                      </td>

                      <td>
                        <NameBadge
                          initials={report.employee?.initials}
                          name={report.employee?.name}
                        />
                        <div className="emp-id">
                          {report.employee?.id}
                        </div>
                      </td>

                      <td>
                        <div>
                          <Link to={`/report/${report.id}`} className="report-title-link">
                            {report.title}
                          </Link>
                          <div className="subtext-date">
                            Uploaded on - {report.uploadedDate}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: "14px", fontWeight: "400", color: "#080808" }}>
                          {report.bills?.length || 0}
                        </span>
                      </td>

                      <td>
                        <NameBadge
                          initials={report.approver?.initials}
                          name={report.approver?.name}
                        />
                      </td>

                      <td>
                        <StatusBadge status={report.status} />
                      </td>

                      <td>
                        <span style={{ fontSize: "14px", fontWeight: "400", color: "#080808" }}>
                          Rs. {Number(report.amount).toLocaleString("en-IN")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <CreateReportModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createNewReport}
      />
    </div>
  );
};

export default ReportsPage;
