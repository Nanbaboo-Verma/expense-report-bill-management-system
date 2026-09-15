import { createContext, useContext, useState } from "react";
import {
  loadReports,
  saveReportsToStorage,
  resetLocalStorageData,
} from "../utils/localStorageUtils";

const ReportsContext = createContext();

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState(() => loadReports());
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("Dec-2025");

  const updateAndSaveReports = (newReports) => {
    setReports(newReports);
    saveReportsToStorage(newReports);
  };

  const updateBillStatus = (reportId, billId, status) => {
    const updated = reports.map((r) => {
      if (r.id !== reportId) return r;
      const updatedBills = r.bills.map((b) =>
        b.id === billId ? { ...b, status } : b
      );
      return { ...r, bills: updatedBills };
    });
    updateAndSaveReports(updated);
  };

  const updateReportStatus = (reportId, status) => {
    const updated = reports.map((r) => {
      if (r.id !== reportId) return r;
      const targetBillStatus = status === "Approved" ? "Approved" : "Rejected";
      const updatedBills = r.bills.map((b) => ({
        ...b,
        status: targetBillStatus,
      }));
      return { ...r, status, bills: updatedBills };
    });
    updateAndSaveReports(updated);
  };


  const batchUpdateBillsStatus = (reportId, billIds, status) => {
    const updated = reports.map((r) => {
      if (r.id !== reportId) return r;
      const updatedBills = r.bills.map((b) =>
        billIds.includes(b.id) ? { ...b, status } : b
      );
      return { ...r, bills: updatedBills };
    });
    updateAndSaveReports(updated);
  };


  const addCommentToBill = (reportId, billId, text, author = "Saksham Agarwal") => {
    if (!text.trim()) return;

    const newComment = {
      id: "c-" + Date.now(),
      author: author,
      authorInitials: author
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      timestamp: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      text: text.trim(),
    };

    const updated = reports.map((r) => {
      if (r.id !== reportId) return r;
      const updatedBills = r.bills.map((b) => {
        if (b.id !== billId) return b;
        return {
          ...b,
          comments: [...(b.comments || []), newComment],
        };
      });
      return { ...r, bills: updatedBills };
    });

    updateAndSaveReports(updated);
  };


  const addBillToReport = (reportId, billData) => {
    const newBill = {
      id: "b-" + Date.now(),
      title: billData.title || "New Expense",
      uploadedDate: new Date().toLocaleDateString("en-GB"),
      wallet: billData.wallet || "Travel Wallet",
      category: billData.category || "General",
      merchant: billData.merchant || "Vendor",
      amount: Number(billData.amount) || 0,
      status: "Pending",
      clientName: billData.clientName || "Sai Enterprise",
      projectId: billData.projectId || "PJ-0001",
      remarks: billData.remarks || "-",
      attachments: billData.attachments || [],
      comments: [],
    };

    const updated = reports.map((r) => {
      if (r.id !== reportId) return r;
      return {
        ...r,
        bills: [...r.bills, newBill],
      };
    });

    updateAndSaveReports(updated);
  };


  const uploadBillAttachment = (reportId, billId, attachment) => {
    const updated = reports.map((r) => {
      if (r.id !== reportId) return r;
      const updatedBills = r.bills.map((b) => {
        if (b.id !== billId) return b;
        return {
          ...b,
          attachments: [...(b.attachments || []), attachment],
        };
      });
      return { ...r, bills: updatedBills };
    });
    updateAndSaveReports(updated);
  };


  const deleteBillAttachment = (reportId, billId, attachmentId) => {
    const updated = reports.map((r) => {
      if (r.id !== reportId) return r;
      const updatedBills = r.bills.map((b) => {
        if (b.id !== billId) return b;
        return {
          ...b,
          attachments: (b.attachments || []).filter(
            (att) => att.id !== attachmentId
          ),
        };
      });
      return { ...r, bills: updatedBills };
    });
    updateAndSaveReports(updated);
  };


  const createNewReport = (reportData) => {
    const newReport = {
      id: "rep-" + Date.now(),
      srNo: String(reports.length + 1).padStart(2, "0"),
      title: reportData.title || `Report - ${reports.length + 1}`,
      month: reportData.month || "Dec-2025",
      uploadedDate: new Date().toLocaleDateString("en-GB"),
      employee: {
        id: "Emp. ID - 0005",
        name: reportData.employeeName || "Saksham Agarwal",
        initials: "SA",
        grade: "II",
        department: "Technology",
        email: "sakshamagarwal@giftryt.com",
      },
      approver: {
        name: reportData.approver || "Tanish Shah",
        initials: "TS",
      },
      status: "Pending",
      walletPolicies: "Food Wallet, Travel Wallet",
      additionalDocs: "-",
      bills: reportData.bills || [],
    };

    updateAndSaveReports([newReport, ...reports]);
  };


  const resetToMock = () => {
    const fresh = resetLocalStorageData();
    setReports(fresh);
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedMonth,
        setSelectedMonth,
        updateBillStatus,
        updateReportStatus,
        batchUpdateBillsStatus,
        addCommentToBill,
        addBillToReport,
        uploadBillAttachment,
        deleteBillAttachment,
        createNewReport,
        resetToMock,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => useContext(ReportsContext);
