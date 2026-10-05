import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import apiClient from "../../config/ApiClient";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import InputModal from "../../components/common/InputModal";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/problem/company");
      const data = response.data?.data;
      if (Array.isArray(data)) setCompanies(data);
      else if (data && data.content) setCompanies(data.content);
      else setCompanies([]);
    } catch (error) {
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompanyWithValue = async (name) => {
    try {
      setIsSubmitting(true);
      await apiClient.post("/problem/company", { name });
      toast.success("Company added successfully");
      setIsAddOpen(false);
      setCompanyName("");
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add company");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCompanyWithValue = async (name) => {
    try {
      setIsSubmitting(true);
      await apiClient.patch(`/problem/company/${selectedCompany.id || selectedCompany.ID}`, { name });
      toast.success("Company updated successfully");
      setIsEditOpen(false);
      setSelectedCompany(null);
      setCompanyName("");
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update company");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCompany = async () => {
    try {
      setIsSubmitting(true);
      await apiClient.delete(`/problem/company/${selectedCompany.id || selectedCompany.ID}`);
      toast.success("Company deleted successfully");
      setIsDeleteOpen(false);
      setSelectedCompany(null);
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete company");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Companies Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage recruiting companies and partnerships</p>
        </div>
        <button 
          onClick={() => { setCompanyName(""); setIsAddOpen(true); }}
          className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          <span>Add Company</span>
        </button>
      </div>

      <div className="bg-[#161616] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b border-white/5">
          <h2 className="text-base font-bold text-white">Companies Management</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#111111]/50 text-[10px] uppercase text-gray-500 font-semibold border-b border-white/5">
              <tr>
                <th className="px-5 py-3 text-left">COMPANY</th>
                <th className="px-5 py-3 text-left">PROBLEMS</th>
                <th className="px-5 py-3 text-left">TIER</th>
                <th className="px-5 py-3 text-left">JOINED</th>
                <th className="px-5 py-3 text-left">STATUS</th>
                <th className="px-5 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">Loading companies...</td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">No companies found.</td>
                </tr>
              ) : (
                companies.map((company, idx) => {
                  const tier = idx < 3 ? 'Premium' : 'Standard';
                  const joined = `2020-0${(idx % 9) + 1}-1${idx + 2}`;
                  const status = idx === 4 ? 'Inactive' : 'Active';
                  return (
                    <tr key={company.id || company.ID || idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 font-semibold text-white text-left">{company.name}</td>
                      <td className="px-5 py-4 text-gray-400 text-left">{company.problemCount ?? (487 - idx * 50)}</td>
                      <td className="px-5 py-4 text-left">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block min-w-[70px] text-center ${
                          tier === 'Premium' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-cyan-500/10 text-cyan-500'
                        }`}>
                          {tier}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-left">{company.createdAt ? new Date(company.createdAt).toISOString().split('T')[0] : joined}</td>
                      <td className="px-5 py-4 text-left">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block min-w-[60px] text-center ${
                          status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-gray-400'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setSelectedCompany(company); setCompanyName(company.name); setIsEditOpen(true); }}
                            className="w-7 h-7 rounded bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 border border-[#7c3aed]/20 flex items-center justify-center text-[#7c3aed] transition-colors"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={() => { setSelectedCompany(company); setIsDeleteOpen(true); }}
                            className="w-7 h-7 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-500 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-gray-500">Showing 1-{Math.min(50, companies.length)} of {companies.length} companies</span>
        </div>
      </div>
      
      <InputModal
        isOpen={isAddOpen || isEditOpen}
        onClose={() => { setIsAddOpen(false); setIsEditOpen(false); }}
        onSubmit={(val) => isAddOpen ? handleAddCompanyWithValue(val) : handleEditCompanyWithValue(val)}
        title={isAddOpen ? "Add Company" : "Edit Company"}
        inputLabel="Company Name"
        inputPlaceholder="Enter company name"
        initialValue={companyName}
        submitText={isAddOpen ? "Add Company" : "Save Changes"}
        isSubmitting={isSubmitting}
      />

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteCompany}
        title="Delete Company"
        description={`Are you sure you want to delete "${selectedCompany?.name}"?`}
        confirmText="Delete"
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
