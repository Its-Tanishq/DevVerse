import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiClient from "../../config/ApiClient";
import toast from "react-hot-toast";
import { CalendarClock, ChevronLeft, ChevronRight, Wand2, Loader2, Save } from "lucide-react";

export default function DailyChallenges() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigningDate, setAssigningDate] = useState(null);
  
  // Custom manual assign state
  const [manualDate, setManualDate] = useState(null);
  const [manualProblemId, setManualProblemId] = useState("");
  const [manualSubmitting, setManualSubmitting] = useState(false);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      const res = await apiClient.get(`/problem/dc/schedule?startDate=${startDate}&endDate=${endDate}`);
      if (res.data?.success) {
        setChallenges(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [currentDate]);

  const handleAutoAssign = async (dateStr) => {
    setAssigningDate(dateStr);
    try {
      const res = await apiClient.post(`/problem/dc/auto-assign?date=${dateStr}`);
      if (res.data?.success) {
        toast.success("Problem auto-assigned successfully");
        fetchSchedule();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to auto-assign problem");
    } finally {
      setAssigningDate(null);
    }
  };

  const handleManualAssign = async (e) => {
    e.preventDefault();
    if (!manualDate || !manualProblemId) return;
    
    setManualSubmitting(true);
    try {
      const res = await apiClient.post(`/problem/dc`, {
        date: manualDate,
        problemsId: parseInt(manualProblemId)
      });
      if (res.data?.success) {
        toast.success("Problem assigned successfully");
        setManualDate(null);
        setManualProblemId("");
        fetchSchedule();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign problem");
    } finally {
      setManualSubmitting(false);
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calendar logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), i));
    calendarDays.push(d.toISOString().split('T')[0]);
  }

  const getChallengeForDate = (dateStr) => {
    return challenges.find(c => c.date === dateStr);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="inline-flex items-center gap-2 bg-[#F2F1FE] dark:bg-[#7c3aed]/15 rounded-full px-3 py-1 text-[13px] font-medium text-[#7c3aed]">
              <CalendarClock size={12} />
              Daily Challenges
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mt-3">
            Schedule Management
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage and auto-assign problems for daily challenges.
          </p>
        </div>
      </div>

      <div className="flex gap-8 flex-col lg:flex-row">
        {/* Calendar */}
        <div className="flex-1 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 bg-accent/50 hover:bg-accent rounded-lg transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 bg-accent/50 hover:bg-accent rounded-lg transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((dateStr, idx) => {
                if (!dateStr) return <div key={`empty-${idx}`} className="p-2 rounded-xl" />;
                
                const challenge = getChallengeForDate(dateStr);
                const dayNum = parseInt(dateStr.split('-')[2]);
                const isAssigning = assigningDate === dateStr;

                return (
                  <div key={dateStr} className={`min-h-24 p-3 rounded-xl border flex flex-col ${challenge ? 'border-[#7c3aed]/50 bg-[#7c3aed]/5' : 'border-border bg-accent/20'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`font-semibold ${challenge ? 'text-[#7c3aed]' : 'text-muted-foreground'}`}>{dayNum}</span>
                      {!challenge && (
                        <button 
                          onClick={() => handleAutoAssign(dateStr)}
                          disabled={isAssigning}
                          title="Auto Assign"
                          className="p-1.5 bg-[#F2F1FE] dark:bg-[#7c3aed]/15 text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isAssigning ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                        </button>
                      )}
                    </div>
                    {challenge && (
                      <div className="mt-auto text-xs font-medium text-foreground bg-background border border-border p-1.5 rounded-md truncate" title={challenge.problems?.title}>
                        #{challenge.problems?.ID || challenge.problems?.id} {challenge.problems?.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Manual Assign Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">Manual Assign</h2>
            <form onSubmit={handleManualAssign} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <input 
                  type="date" 
                  required
                  value={manualDate || ''}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Problem ID</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 1"
                  value={manualProblemId}
                  onChange={(e) => setManualProblemId(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50"
                />
              </div>
              <button 
                type="submit"
                disabled={manualSubmitting || !manualDate || !manualProblemId}
                className="w-full flex items-center justify-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {manualSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Assign Problem
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
