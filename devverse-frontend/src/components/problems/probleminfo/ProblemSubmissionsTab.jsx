import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import apiClient from "../../../config/ApiClient";

const ProblemSubmissionsTab = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoadingSubmissions(true);
        const res = await apiClient.get(
          `/problem/submission/problem/${problemId}`
        );
        if (res.data?.success) {
          setSubmissions(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoadingSubmissions(false);
      }
    };
    if (problemId) fetchSubmissions();
  }, [problemId]);

  return (
    <div className="text-sm text-neutral-700 dark:text-neutral-300 mb-8 overflow-x-auto">
      <table className="w-full text-left border-collapse whitespace-nowrap min-w-[500px]">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
            <th className="py-3 font-medium">Time Submitted</th>
            <th className="py-3 font-medium">Status</th>
            <th className="py-3 font-medium">Runtime</th>
            <th className="py-3 font-medium">Memory</th>
            <th className="py-3 font-medium">Language</th>
          </tr>
        </thead>
        <tbody>
          {loadingSubmissions ? (
            <tr>
              <td colSpan="5" className="py-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-600 dark:text-[#9A7DFF]" />
              </td>
            </tr>
          ) : submissions.length > 0 ? (
            submissions.map((sub) => (
              <tr
                key={sub.ID || sub.id}
                className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <td className="py-3">
                  {sub.createdAt
                    ? new Date(sub.createdAt).toLocaleString()
                    : "N/A"}
                </td>
                <td
                  className={`py-3 font-medium ${
                    sub.status === "ACCEPTED"
                      ? "text-emerald-600 dark:text-emerald-500"
                      : "text-red-600 dark:text-red-500"
                  }`}
                >
                  {sub.status || "N/A"}
                </td>
                <td className="py-3">
                  {sub.executionTimeMs != null
                    ? `${sub.executionTimeMs} ms`
                    : "N/A"}
                </td>
                <td className="py-3">
                  {sub.memoryUsedKb != null
                    ? `${(sub.memoryUsedKb / 1024).toFixed(1)} MB`
                    : "N/A"}
                </td>
                <td className="py-3">{sub.language || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-8 text-center text-neutral-500">
                No submissions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemSubmissionsTab;
