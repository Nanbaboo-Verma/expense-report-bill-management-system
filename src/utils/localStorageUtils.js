import { initialReports } from "./data";

const STORAGE_KEY = "optifii_expense_reports_v2";

/**
 * Loads expense reports from localStorage. If none exist, seeds initial mock data.
 * Recalculates total amounts dynamically based on bill amounts.
 * @returns {Array} Array of reports
 */
export const loadReports = () => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return syncReportCalculations(parsed);
      }
    }
  } catch (err) {
    console.error("Error reading expense reports from localStorage:", err);
  }

  // Save and return initial mock dataset
  saveReportsToStorage(initialReports);
  return syncReportCalculations(initialReports);
};

/**
 * Saves reports array to localStorage.
 * @param {Array} reports 
 */
export const saveReportsToStorage = (reports) => {
  try {
    const updated = syncReportCalculations(reports);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving expense reports to localStorage:", err);
  }
};

/**
 * Resets local storage to initial mock dataset.
 */
export const resetLocalStorageData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReports));
  return syncReportCalculations(initialReports);
};

/**
 * Helper to dynamically compute report status and total amounts based on bill states.
 * @param {Array} reports 
 */
export const syncReportCalculations = (reports) => {
  return reports.map((report) => {
    const bills = report.bills || [];
    const totalAmount = bills.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    const approvedAmount = bills
      .filter((b) => b.status === "Approved")
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

    // Compute overall report status if bills exist
    let computedStatus = report.status;
    if (bills.length > 0) {
      const approvedCount = bills.filter((b) => b.status === "Approved").length;
      const rejectedCount = bills.filter((b) => b.status === "Rejected").length;

      if (approvedCount === bills.length) {
        computedStatus = "Approved";
      } else if (rejectedCount === bills.length) {
        computedStatus = "Rejected";
      } else if (approvedCount > 0) {
        computedStatus = "Partially Approved";
      } else {
        computedStatus = "Pending";
      }
    }

    return {
      ...report,
      amount: totalAmount > 0 ? totalAmount : report.amount || 0,
      approvedAmount: approvedAmount,
      status: computedStatus,
    };
  });
};
