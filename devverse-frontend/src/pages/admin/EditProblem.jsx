import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, Eye, Archive, Save, Plus, Trash2, 
  Settings, FileText, CheckCircle2, List, 
  Terminal, AlertCircle, Bookmark, Tag, Building2,
  BarChart2, BookOpen, Clock
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../../config/ApiClient";

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data States
  const [problemNumber, setProblemNumber] = useState("#" + id);
  const [dbId, setDbId] = useState("prob_" + Math.random().toString(36).substring(7));
  const [title, setTitle] = useState("Loading...");
  const [difficulty, setDifficulty] = useState("Medium");
  const [status, setStatus] = useState("Published");
  const [description, setDescription] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  
  const [examples, setExamples] = useState([]);
  const [constraints, setConstraints] = useState([""]);
  const [hints, setHints] = useState([""]);
  const [submissions, setSubmissions] = useState([]);
  
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  
  const [companies, setCompanies] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemRes, tagsRes, companiesRes, subsRes] = await Promise.all([
          apiClient.get(`/problem/${id}`),
          apiClient.get("/problem/tag"),
          apiClient.get("/problem/company"),
          apiClient.get(`/problem/submission/problem/${id}`).catch(() => ({ data: { success: false } }))
        ]);

        if (tagsRes.data?.success) {
          setAvailableTags(tagsRes.data.data.content || tagsRes.data.data || []);
        }
        if (companiesRes.data?.success) {
          setAvailableCompanies(companiesRes.data.data.content || companiesRes.data.data || []);
        }

        if (subsRes && subsRes.data?.success) {
          setSubmissions(subsRes.data.data.content || subsRes.data.data || []);
        }

        if (problemRes.data?.success) {
          const p = problemRes.data.data;
          setTitle(p.title);
          setDifficulty(p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1).toLowerCase());
          setIsPremium(p.isPremium || false);
          
          let descText = p.description || "";
          let parsedExamples = [];
          let parsedConstraints = [];
          
          const exMatch = descText.indexOf("### Examples");
          const constMatch = descText.indexOf("### Constraints");
          
          if (exMatch !== -1) {
            const examplesStr = descText.substring(exMatch + 12, constMatch !== -1 ? constMatch : undefined);
            const blocks = examplesStr.split(/\*\*Example \d+:\*\*/).filter(Boolean);
            parsedExamples = blocks.map(block => {
              const inputMatch = block.match(/- \*\*Input:\*\* `([^`]+)`/);
              const outputMatch = block.match(/- \*\*Output:\*\* `([^`]+)`/);
              const expMatch = block.match(/- \*\*Explanation:\*\* (.*?)(?=\n-|$)/);
              return {
                input: inputMatch ? inputMatch[1] : "",
                output: outputMatch ? outputMatch[1] : "",
                explanation: expMatch ? expMatch[1]?.trim() : ""
              };
            }).filter(ex => ex.input || ex.output);
            
            descText = descText.substring(0, exMatch).trim();
          }
          
          if (constMatch !== -1) {
            const constraintsStr = p.description.substring(constMatch + 15);
            parsedConstraints = constraintsStr.split("\n")
              .map(line => line.trim())
              .filter(line => line.startsWith("- `"))
              .map(line => line.replace(/^- `/, "").replace(/`$/, ""));
          }
          
          setDescription(descText);
          if (parsedExamples.length > 0) setExamples(parsedExamples);
          if (parsedConstraints.length > 0) setConstraints(parsedConstraints);
          
          if (p.hints) setHints(p.hints.split("\n").filter(h => h.trim()));
          if (p.tags) setTags(p.tags.map(t => t.name));
          if (p.companies) setCompanies(p.companies.map(c => c.name));
          
          setProblemNumber("#" + (p.ID || p.id || id));
          setDbId("prob_" + (p.slug || p.ID || id));
          setStatus(p.status || "Published");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load problem data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Event Handlers
  const handleAddExample = () => setExamples([...examples, { input: "", output: "", explanation: "" }]);
  const handleRemoveExample = (index) => setExamples(examples.filter((_, i) => i !== index));
  const handleExampleChange = (index, field, value) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  const handleAddConstraint = () => setConstraints([...constraints, ""]);
  const handleRemoveConstraint = (index) => setConstraints(constraints.filter((_, i) => i !== index));
  const handleConstraintChange = (index, value) => {
    const newConstraints = [...constraints];
    newConstraints[index] = value;
    setConstraints(newConstraints);
  };

  const handleAddHint = () => setHints([...hints, ""]);
  const handleRemoveHint = (index) => setHints(hints.filter((_, i) => i !== index));
  const handleHintChange = (index, value) => {
    const newHints = [...hints];
    newHints[index] = value;
    setHints(newHints);
  };

  const handleAddTag = (e) => {
    const selected = e.target.value;
    if (selected && !tags.includes(selected)) {
      setTags([...tags, selected]);
    }
    e.target.value = "";
  };
  const handleRemoveTag = (tag) => setTags(tags.filter(t => t !== tag));

  const handleAddCompany = (e) => {
    const selected = e.target.value;
    if (selected && !companies.includes(selected)) {
      setCompanies([...companies, selected]);
    }
    e.target.value = "";
  };
  const handleRemoveCompany = (company) => setCompanies(companies.filter(c => c !== company));

  const handleSave = async () => {
    setIsSaving(true);
    const saveToast = toast.loading("Saving changes...");
    try {
      let finalDescription = description;
      
      if (examples.length > 0) {
        finalDescription += "\n\n### Examples\n";
        examples.forEach((ex, i) => {
          if (ex.input || ex.output) {
            finalDescription += `**Example ${i + 1}:**\n`;
            finalDescription += `- **Input:** \`${ex.input}\`\n`;
            finalDescription += `- **Output:** \`${ex.output}\`\n`;
            if (ex.explanation) finalDescription += `- **Explanation:** ${ex.explanation}\n\n`;
            else finalDescription += "\n";
          }
        });
      }
      
      if (constraints.length > 0 && constraints.some(c => c.trim())) {
        finalDescription += "\n### Constraints\n";
        constraints.forEach(c => {
          if (c.trim()) finalDescription += `- \`${c.trim()}\`\n`;
        });
      }

      const payload = {
        title,
        difficulty: difficulty.toUpperCase(),
        isPremium,
        status,
        description: finalDescription,
        hints: hints.filter(h => h.trim()).join("\n"),
        tags: tags.map(t => {
          const found = availableTags.find(at => at.name === t);
          return found ? { ID: found.id || found.ID, name: t } : { name: t };
        }),
        companies: companies.map(c => {
          const found = availableCompanies.find(ac => ac.name === c);
          return found ? { ID: found.id || found.ID, name: c } : { name: c };
        })
      };
      
      await apiClient.patch(`/problem/${id}`, payload);
      toast.success("Changes saved successfully!", { id: saveToast });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes", { id: saveToast });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this problem? This action cannot be undone.")) return;
    
    const deleteToast = toast.loading("Deleting problem...");
    try {
      await apiClient.delete(`/problem/${id}`);
      toast.success("Problem deleted successfully", { id: deleteToast });
      navigate("/admin/problems");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete problem", { id: deleteToast });
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-white bg-[#0a0a0a] min-h-screen -m-8">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#111111] sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/problems")} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Problems</span>
          </button>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-gray-400">{problemNumber}</span>
            <span className="font-semibold">{title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              difficulty === 'Easy' ? 'text-green-400 bg-green-400/10' :
              difficulty === 'Medium' ? 'text-orange-400 bg-orange-400/10' :
              'text-red-400 bg-red-400/10'
            }`}>
              {difficulty}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium text-emerald-400 bg-emerald-400/10">
              {status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#b91c1c]/10 hover:bg-[#b91c1c]/20 text-[#ef4444] text-sm font-medium transition-colors border border-[#ef4444]/20 mr-2"
          >
            <Trash2 size={16} /> Delete Problem
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors shadow-lg ${isSaving ? 'bg-[#7c3aed]/50 cursor-not-allowed' : 'bg-[#7c3aed] hover:bg-[#6d28d9] shadow-[#7c3aed]/20'}`}
          >
            {isSaving ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <Save size={16} />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 p-6 gap-6 h-[calc(100vh-73px)] overflow-hidden">
        
        {/* Left Column (Scrollable) */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Problem Details */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6 text-purple-400">
              <Settings size={18} />
              <h2 className="text-base font-semibold text-white">Problem Details</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Problem Number</label>
                <input 
                  type="text" 
                  value={problemNumber} 
                  readOnly
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-400 focus:outline-none cursor-not-allowed font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Database ID</label>
                <input 
                  type="text" 
                  value={dbId} 
                  readOnly
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-purple-400 focus:outline-none cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Two Sum" 
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Difficulty</label>
                <div className="relative">
                  <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                  >
                    <option className="bg-[#111] text-green-400" value="Easy">Easy</option>
                    <option className="bg-[#111] text-orange-400" value="Medium">Medium</option>
                    <option className="bg-[#111] text-red-400" value="Hard">Hard</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</label>
                <div className="relative">
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
                  >
                    <option className="bg-[#111] text-emerald-400" value="Published">Published</option>
                    <option className="bg-[#111] text-amber-400" value="Draft">Draft</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-blue-400">
                <FileText size={18} />
                <h2 className="text-base font-semibold text-white">Problem Description</h2>
              </div>
            </div>
            
            <div className="border border-white/10 rounded-lg overflow-hidden bg-black/40 flex flex-col min-h-[300px]">
              <div className="flex items-center gap-1 border-b border-white/10 p-2 bg-[#1a1a1a]">
                <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><span className="font-bold font-serif px-1">B</span></button>
                <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><span className="italic font-serif px-1">I</span></button>
                <div className="w-px h-4 bg-white/10 mx-1"></div>
                <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors text-xs font-mono px-2">Code</button>
                <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors text-xs font-mono px-2 bg-white/5">`code`</button>
                <div className="w-px h-4 bg-white/10 mx-1"></div>
                <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><List size={14} /></button>
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full flex-1 bg-transparent p-4 text-sm text-gray-300 focus:outline-none resize-none leading-relaxed"
                placeholder="Write problem description here..."
              ></textarea>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-pink-400">
                <CheckCircle2 size={18} />
                <h2 className="text-base font-semibold text-white">Examples</h2>
              </div>
              <button onClick={handleAddExample} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 text-xs font-medium transition-colors border border-pink-500/20">
                <Plus size={14} /> Add Example
              </button>
            </div>
            <div className="space-y-4">
              {examples.map((ex, index) => (
                <div key={index} className="bg-black/40 border border-white/10 rounded-lg p-4 group">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-300">Example {index + 1}</h3>
                    <button onClick={() => handleRemoveExample(index)} className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Input</label>
                      <textarea value={ex.input} onChange={(e) => handleExampleChange(index, "input", e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md p-3 text-sm text-gray-300 font-mono h-24 focus:outline-none focus:border-pink-500/50 resize-none" placeholder="coins = [1,2,5]&#10;amount = 11"></textarea>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Output</label>
                      <textarea value={ex.output} onChange={(e) => handleExampleChange(index, "output", e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md p-3 text-sm text-gray-300 font-mono h-24 focus:outline-none focus:border-pink-500/50 resize-none" placeholder="3"></textarea>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Explanation</label>
                    <textarea value={ex.explanation} onChange={(e) => handleExampleChange(index, "explanation", e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-md p-3 text-sm text-gray-300 h-16 focus:outline-none focus:border-pink-500/50 resize-none" placeholder="11 = 5 + 5 + 1"></textarea>
                  </div>
                </div>
              ))}
              {examples.length === 0 && <div className="text-center py-8 border border-dashed border-white/10 rounded-lg text-gray-500 text-sm">No examples added yet.</div>}
            </div>
          </div>

          {/* Constraints */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-indigo-400">
                <AlertCircle size={18} />
                <h2 className="text-base font-semibold text-white">Constraints</h2>
              </div>
            </div>
            <div className="space-y-3">
              {constraints.map((constraint, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="text-gray-500 shrink-0"><Plus size={14} className="rotate-45" /></div>
                  <input type="text" value={constraint} onChange={(e) => handleConstraintChange(index, e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-300 font-mono focus:outline-none focus:border-indigo-500/50 transition-all" placeholder="1 <= coins.length <= 12" />
                  <button onClick={() => handleRemoveConstraint(index)} className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Trash2 size={16} /></button>
                </div>
              ))}
              <button onClick={handleAddConstraint} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium mt-2 transition-colors">
                <Plus size={16} /> Add constraint
              </button>
            </div>
          </div>

          {/* Hints */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-yellow-400">
                <Terminal size={18} />
                <h2 className="text-base font-semibold text-white">Hints</h2>
              </div>
              <button onClick={handleAddHint} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs font-medium transition-colors border border-yellow-500/20">
                <Plus size={14} /> Add Hint
              </button>
            </div>
            <div className="space-y-3">
              {hints.map((hint, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold shrink-0">{index + 1}</div>
                  <input type="text" value={hint} onChange={(e) => handleHintChange(index, e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-yellow-500/50 transition-all" placeholder="Think of building a table..." />
                  <button onClick={() => handleRemoveHint(index)} className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Trash2 size={16} /></button>
                </div>
              ))}
              {hints.length === 0 && <div className="text-center py-4 text-gray-500 text-sm">No hints added.</div>}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-6 shadow-xl mb-4">
            <div className="flex items-center gap-2 mb-6 text-cyan-400">
              <Clock size={18} />
              <h2 className="text-base font-semibold text-white">Recent Submissions</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Verdict</th>
                    <th className="pb-3 font-medium">Language</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">When</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {submissions.slice(0, 5).map(sub => (
                    <tr key={sub.ID || sub.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="py-3 font-medium text-blue-400">@{sub.userId || "user"}</td>
                      <td className={`py-3 font-semibold ${sub.status === 'ACCEPTED' ? 'text-emerald-500' : 'text-red-500'}`}>{sub.status}</td>
                      <td className="py-3 text-gray-400">{sub.language}</td>
                      <td className="py-3 text-gray-400">{sub.executionTimeMs || '-'}ms</td>
                      <td className="py-3 text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-gray-500">No submissions yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>

        {/* Right Column (Fixed panels) */}
        <div className="w-[320px] flex flex-col gap-6 shrink-0 overflow-y-auto custom-scrollbar">
          
          {/* Tags / Topics */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Tag size={16} />
              <h3 className="text-sm font-semibold text-white">Tags / Topics</h3>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((t, i) => (
                <div key={i} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 transition-colors px-2.5 py-1 rounded-md text-xs font-medium text-gray-300 group cursor-default border border-white/5">
                  {t}
                  <button onClick={() => handleRemoveTag(t)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 ml-1 transition-all"><Plus size={12} className="rotate-45" /></button>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <select onChange={handleAddTag} value="" className="w-full bg-black/40 border border-white/10 rounded-lg px-9 py-2 text-sm text-gray-400 focus:outline-none focus:border-emerald-500/50 appearance-none transition-all">
                <option value="" disabled>Add tag...</option>
                {availableTags.map((tag) => (
                  <option key={tag.ID || tag.id} value={tag.name} className="bg-[#111]">{tag.name}</option>
                ))}
              </select>
              <Plus size={14} className="absolute left-3 top-2.5 text-gray-500" />
            </div>
          </div>

          {/* Companies */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-rose-400">
              <Building2 size={16} />
              <h3 className="text-sm font-semibold text-white">Companies</h3>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {companies.map((c, i) => (
                <div key={i} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 transition-colors px-2.5 py-1 rounded-md text-xs font-medium text-gray-300 group cursor-default border border-white/5">
                  {c}
                  <button onClick={() => handleRemoveCompany(c)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 ml-1 transition-all"><Plus size={12} className="rotate-45" /></button>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <select onChange={handleAddCompany} value="" className="w-full bg-black/40 border border-white/10 rounded-lg px-9 py-2 text-sm text-gray-400 focus:outline-none focus:border-rose-500/50 appearance-none transition-all">
                <option value="" disabled>Add company...</option>
                {availableCompanies.map((comp) => (
                  <option key={comp.ID || comp.id} value={comp.name} className="bg-[#111]">{comp.name}</option>
                ))}
              </select>
              <Plus size={14} className="absolute left-3 top-2.5 text-gray-500" />
            </div>
          </div>

          {/* Stats */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-5 text-gray-300">
              <BarChart2 size={16} />
              <h3 className="text-sm font-semibold text-white">Stats</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Submissions</span>
                <span className="font-semibold text-white">1.2M</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Acceptance Rate</span>
                <span className="font-semibold text-emerald-400">61.4%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Likes</span>
                <span className="font-semibold text-pink-400">4,812</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Dislikes</span>
                <span className="font-semibold text-gray-400">312</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Solution Views</span>
                <span className="font-semibold text-white">89,334</span>
              </div>
            </div>
          </div>

          {/* Editorial Status */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-5 text-indigo-400">
              <BookOpen size={16} />
              <h3 className="text-sm font-semibold text-white">Editorial Status</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Editorial</span>
                <span className="font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full text-xs">Published</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Premium Only</span>
                <button 
                  onClick={() => setIsPremium(!isPremium)}
                  className={`w-9 h-5 rounded-full relative transition-colors duration-200 ease-in-out ${isPremium ? 'bg-purple-600' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm ${isPremium ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </button>
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-medium transition-colors border border-indigo-500/20">
                <BookOpen size={14} /> Edit Editorial
              </button>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default EditProblem;
