import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import apiClient from "../../config/ApiClient";
import toast from "react-hot-toast";
import { 
  ArrowLeft, Eye, Save, Upload, Plus, Trash2, 
  Settings, Code, FileText, CheckCircle2, List, 
  Terminal, AlertCircle, HelpCircle, Briefcase, Tag, Info,
  X
} from "lucide-react";

export default function CreateProblem() {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [isPremium, setIsPremium] = useState(false);
  const [description, setDescription] = useState("");
  
  const [examples, setExamples] = useState([
    { input: "", output: "", explanation: "" }
  ]);
  
  const [constraints, setConstraints] = useState([""]);
  const [hints, setHints] = useState([""]);
  
  const [selectedLang, setSelectedLang] = useState("Python 3");
  const [starterCode, setStarterCode] = useState({
    "Python 3": "class Solution:\n    def solve(self):\n        pass",
    "Java": "class Solution {\n    public void solve() {\n    }\n}",
    "C++": "class Solution {\npublic:\n    void solve() {\n    }\n};",
    "JavaScript": "/**\n * @return {void}\n */\nvar solve = function() {\n    \n};"
  });

  const [testCases, setTestCases] = useState([
    { input: "", expectedOutput: "" },
    { input: "", expectedOutput: "" }
  ]);

  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const [companies, setCompanies] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);

  const [timeLimit, setTimeLimit] = useState(2000);
  const [memoryLimit, setMemoryLimit] = useState(256);
  const [languagesAllowed, setLanguagesAllowed] = useState(["Python 3", "Java", "C++", "JavaScript"]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagsRes = await apiClient.get("/problem/tag");
        const compRes = await apiClient.get("/problem/company");
        
        const tagsData = tagsRes.data?.data;
        if (Array.isArray(tagsData)) setAvailableTags(tagsData);
        else if (tagsData && tagsData.content) setAvailableTags(tagsData.content);
        
        const compData = compRes.data?.data;
        if (Array.isArray(compData)) setAvailableCompanies(compData);
        else if (compData && compData.content) setAvailableCompanies(compData.content);
      } catch (error) {
        console.error("Failed to fetch tags/companies", error);
      }
    };
    fetchData();
  }, []);

  // Validation
  const hasTitle = title.trim().length > 0;
  const hasDifficulty = !!difficulty;
  const hasDescription = description.trim().length > 0;
  const validTestCasesCount = testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim()).length;
  const hasMinTestCases = validTestCasesCount >= 2;
  
  const checklist = [
    { label: "Title", value: title || "Missing title", isValid: hasTitle },
    { label: "Difficulty", value: difficulty, isValid: hasDifficulty },
    { label: "Description", value: hasDescription ? "Provided" : "Missing problem statement", isValid: hasDescription },
    { label: "Test Cases (min 2)", value: `${validTestCasesCount} valid cases`, isValid: hasMinTestCases },
  ];
  
  const completeCount = checklist.filter(item => item.isValid).length;
  const totalCount = checklist.length;
  const completionPercentage = Math.round((completeCount / totalCount) * 100);

  // Handlers
  const handleAddExample = () => setExamples([...examples, { input: "", output: "", explanation: "" }]);
  const handleRemoveExample = (idx) => setExamples(examples.filter((_, i) => i !== idx));
  const handleExampleChange = (idx, field, val) => {
    const newExamples = [...examples];
    newExamples[idx][field] = val;
    setExamples(newExamples);
  };

  const handleAddConstraint = () => setConstraints([...constraints, ""]);
  const handleRemoveConstraint = (idx) => setConstraints(constraints.filter((_, i) => i !== idx));
  const handleConstraintChange = (idx, val) => {
    const newConstraints = [...constraints];
    newConstraints[idx] = val;
    setConstraints(newConstraints);
  };

  const handleAddHint = () => setHints([...hints, ""]);
  const handleRemoveHint = (idx) => setHints(hints.filter((_, i) => i !== idx));
  const handleHintChange = (idx, val) => {
    const newHints = [...hints];
    newHints[idx] = val;
    setHints(newHints);
  };

  const handleAddTestCase = () => setTestCases([...testCases, { input: "", expectedOutput: "" }]);
  const handleRemoveTestCase = (idx) => setTestCases(testCases.filter((_, i) => i !== idx));
  const handleTestCaseChange = (idx, field, val) => {
    const newTestCases = [...testCases];
    newTestCases[idx][field] = val;
    setTestCases(newTestCases);
  };

  const handleAddTag = (e) => {
    const selectedTag = e.target.value;
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
    }
    e.target.value = "";
  };
  const handleRemoveTag = (tagToRemove) => setTags(tags.filter(t => t !== tagToRemove));

  const handleAddCompany = (e) => {
    const selectedCompany = e.target.value;
    if (selectedCompany && !companies.includes(selectedCompany)) {
      setCompanies([...companies, selectedCompany]);
    }
    e.target.value = "";
  };
  const handleRemoveCompany = (companyToRemove) => setCompanies(companies.filter(c => c !== companyToRemove));

  const handleCodeChange = (e) => {
    setStarterCode({ ...starterCode, [selectedLang]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    if (completionPercentage !== 100) {
      toast.error("Please fill all required fields before publishing");
      return;
    }
    
    setIsSubmitting(true);
    const loadingToast = toast.loading("Publishing problem...");
    
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

      const problemPayload = {
        title,
        difficulty: difficulty.toUpperCase(),
        isPremium,
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

      const problemRes = await apiClient.post("/problem", problemPayload);
      const problemId = problemRes.data?.data?.id || problemRes.data?.data?.ID;

      if (!problemId) {
        throw new Error("Failed to get created problem ID");
      }

      const validTestCases = testCases.filter(tc => tc.input.trim() && tc.expectedOutput.trim());
      for (const tc of validTestCases) {
        await apiClient.post("/problem/testcase", {
          problemsId: problemId,
          input: tc.input.trim(),
          output: tc.expectedOutput.trim(),
          isHidden: false
        });
      }

      const langMapping = {
        "Python 3": "PYTHON",
        "Java": "JAVA",
        "C++": "CPP",
        "JavaScript": "JAVASCRIPT"
      };
      
      for (const [uiLang, code] of Object.entries(starterCode)) {
        if (code && code.trim() && langMapping[uiLang]) {
          await apiClient.post("/problem/boilerplate", {
            problemsId: problemId,
            language: langMapping[uiLang],
            boilerplate: code.trim()
          });
        }
      }

      toast.success("Problem published successfully!", { id: loadingToast });
      navigate("/admin/problems");
    } catch (error) {
      console.error("Publish error:", error);
      toast.error(error.response?.data?.message || "Failed to publish problem", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col text-white bg-[#0a0a0a] -m-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#111111] sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/problems")} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span className="font-medium text-sm">Back to Problems</span>
          </button>
          <div className="h-4 w-px bg-white/10"></div>
          <h1 className="text-lg font-bold tracking-tight">Create New Problem</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePublish} 
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors shadow-lg ${isSubmitting ? 'bg-[#7c3aed]/50 cursor-not-allowed shadow-[#7c3aed]/10' : 'bg-[#7c3aed] hover:bg-[#6d28d9] shadow-[#7c3aed]/20'}`}
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Upload size={16} />
            )}
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
      
      {/* Stepper (Fake for UI matching) */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#111111]/80 backdrop-blur-md flex items-center justify-center gap-6 overflow-x-auto hide-scrollbar">
         <div className="flex items-center gap-2 text-[#22c55e] whitespace-nowrap"><CheckCircle2 size={16}/> <span className="text-sm font-medium">Basic Info</span></div>
         <div className="w-8 h-px bg-white/10 shrink-0"></div>
         <div className="flex items-center gap-2 text-[#7c3aed] whitespace-nowrap"><span className="w-5 h-5 rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-[#7c3aed]/30">2</span> <span className="text-sm font-medium">Description</span></div>
         <div className="w-8 h-px bg-white/10 shrink-0"></div>
         <div className="flex items-center gap-2 text-gray-500 whitespace-nowrap"><span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">3</span> <span className="text-sm font-medium">Examples</span></div>
         <div className="w-8 h-px bg-white/10 shrink-0"></div>
         <div className="flex items-center gap-2 text-gray-500 whitespace-nowrap"><span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">4</span> <span className="text-sm font-medium">Hints & Tags</span></div>
         <div className="w-8 h-px bg-white/10 shrink-0"></div>
         <div className="flex items-center gap-2 text-gray-500 whitespace-nowrap"><span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">5</span> <span className="text-sm font-medium">Test Cases</span></div>
         <div className="w-8 h-px bg-white/10 shrink-0"></div>
         <div className="flex items-center gap-2 text-gray-500 whitespace-nowrap"><span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">6</span> <span className="text-sm font-medium">Solution</span></div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Form) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-[#161616] border border-white/5 rounded-xl p-6 shadow-xl">
               <div className="flex items-center gap-2 mb-6">
                 <div className="p-2 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed]"><Settings size={18} /></div>
                 <h2 className="text-base font-bold text-white tracking-tight">Basic Information</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Problem Title</label>
                   <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. Coin Change II" className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 transition-all placeholder:text-gray-600" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Difficulty</label>
                   <div className="flex bg-[#111111] border border-white/10 rounded-lg p-1">
                     {["Easy", "Medium", "Hard"].map(level => (
                       <button 
                         key={level}
                         onClick={() => setDifficulty(level)}
                         className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                           difficulty === level 
                             ? level === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                               : level === 'Medium' ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20'
                               : 'bg-red-500/10 text-red-500 border border-red-500/20'
                             : 'text-gray-400 hover:text-white'
                         }`}
                       >
                         {level}
                       </button>
                     ))}
                   </div>
                 </div>
                 <div className="space-y-2 flex flex-col justify-center pt-1">
                   <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Premium Only</label>
                   <div className="flex items-center gap-3">
                     <div 
                       onClick={() => setIsPremium(!isPremium)}
                       className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${isPremium ? 'bg-[#7c3aed]' : 'bg-white/10 hover:bg-white/20'}`}
                     >
                       <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isPremium ? 'translate-x-6' : 'translate-x-1 bg-gray-400'}`}></div>
                     </div>
                     <span className="text-sm font-medium text-gray-400">{isPremium ? 'Yes' : 'No'}</span>
                   </div>
                 </div>
               </div>
            </div>

            {/* Problem Description */}
            <div className="bg-[#161616] border border-white/5 rounded-xl p-6 shadow-xl">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2">
                   <div className="p-2 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed]"><FileText size={18} /></div>
                   <h2 className="text-base font-bold text-white tracking-tight">Problem Description</h2>
                 </div>
                 <div className="flex items-center gap-1 bg-[#111111] p-1 rounded-lg border border-white/5">
                    <button className="p-1.5 rounded bg-white/10 text-white hover:bg-white/20 transition-colors"><span className="font-bold text-xs px-1">B</span></button>
                    <button className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-colors"><span className="italic text-xs font-serif px-1">I</span></button>
                    <button className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-colors"><Code size={14}/></button>
                    <button className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-colors"><span className="text-xs font-mono px-0.5">&lt;/&gt;</span></button>
                 </div>
               </div>
               <textarea 
                 value={description}
                 onChange={e => setDescription(e.target.value)}
                 rows={8}
                 placeholder="Write problem statement here. You can use markdown formatting. Describe the task clearly..." 
                 className="w-full bg-[#111111] border border-white/10 rounded-lg p-4 text-sm text-gray-200 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 transition-all resize-y placeholder:text-gray-600"
               ></textarea>
               <div className="flex justify-between items-center mt-3">
                 <span className="text-xs text-gray-500 font-medium">Markdown supported</span>
                 <span className="text-xs text-gray-500 font-medium">{description.length} / 5000</span>
               </div>
            </div>

            {/* Examples */}
            <div className="bg-[#161616] border border-white/5 rounded-xl p-6 shadow-xl">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2">
                   <div className="p-2 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed]"><List size={18} /></div>
                   <h2 className="text-base font-bold text-white tracking-tight">Examples</h2>
                 </div>
                 <button onClick={handleAddExample} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7c3aed]/10 text-[#7c3aed] text-xs font-bold hover:bg-[#7c3aed]/20 transition-colors border border-[#7c3aed]/20 uppercase tracking-wider">
                   <Plus size={14} /> Add Example
                 </button>
               </div>
               
               <div className="space-y-5">
                 {examples.map((ex, idx) => (
                   <div key={idx} className="p-5 bg-[#111111] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                     <div className="flex justify-between items-center mb-4">
                       <h3 className="text-sm font-bold text-white flex items-center gap-2">
                         <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs text-gray-300">{idx + 1}</span> 
                         Example
                       </h3>
                       <button onClick={() => handleRemoveExample(idx)} className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 size={14}/></button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="space-y-1.5">
                         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Input</label>
                         <textarea value={ex.input} onChange={e => handleExampleChange(idx, 'input', e.target.value)} rows={2} className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg p-3 text-sm text-[#c084fc] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 outline-none font-mono transition-all resize-y" placeholder="nums = [1,2,3]"></textarea>
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Output</label>
                         <textarea value={ex.output} onChange={e => handleExampleChange(idx, 'output', e.target.value)} rows={2} className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg p-3 text-sm text-[#4ade80] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 outline-none font-mono transition-all resize-y" placeholder="6"></textarea>
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Explanation</label>
                         <textarea value={ex.explanation} onChange={e => handleExampleChange(idx, 'explanation', e.target.value)} rows={2} className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg p-3 text-sm text-gray-300 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 outline-none transition-all resize-y" placeholder="Explanation..."></textarea>
                       </div>
                     </div>
                   </div>
                 ))}
                 {examples.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No examples added.</p>}
               </div>
            </div>

            {/* Constraints */}
            <div className="bg-[#161616] border border-white/5 rounded-xl p-6 shadow-xl">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2">
                   <div className="p-2 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed]"><AlertCircle size={18} /></div>
                   <h2 className="text-base font-bold text-white tracking-tight">Constraints</h2>
                 </div>
               </div>
               
               <div className="space-y-3">
                 {constraints.map((c, idx) => (
                   <div key={idx} className="flex items-center gap-3 bg-[#111111] p-1.5 rounded-lg border border-white/5 focus-within:border-[#7c3aed] focus-within:ring-1 focus-within:ring-[#7c3aed]/50 transition-all">
                     <div className="w-1.5 h-1.5 rounded-full bg-gray-500 ml-3 shrink-0"></div>
                     <input value={c} onChange={e => handleConstraintChange(idx, e.target.value)} type="text" placeholder="1 <= n <= 10^4" className="flex-1 bg-transparent p-2 text-sm text-gray-300 outline-none font-mono" />
                     <button onClick={() => handleRemoveConstraint(idx)} className="text-red-500 hover:text-red-400 p-2 rounded hover:bg-red-500/10 transition-colors"><Trash2 size={14}/></button>
                   </div>
                 ))}
                 
                 <button onClick={handleAddConstraint} className="flex items-center gap-2 text-[#7c3aed] text-sm font-bold hover:text-[#6d28d9] transition-colors mt-4 px-2 py-1 uppercase tracking-wider">
                   <Plus size={16} /> Add Constraint
                 </button>
               </div>
            </div>

            {/* Hints */}
            <div className="bg-[#161616] border border-white/5 rounded-xl p-6 shadow-xl">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2">
                   <div className="p-2 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed]"><HelpCircle size={18} /></div>
                   <h2 className="text-base font-bold text-white tracking-tight">Hints</h2>
                 </div>
                 <button onClick={handleAddHint} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7c3aed]/10 text-[#7c3aed] text-xs font-bold hover:bg-[#7c3aed]/20 transition-colors border border-[#7c3aed]/20 uppercase tracking-wider">
                   <Plus size={14} /> Add Hint
                 </button>
               </div>
               
               <div className="space-y-4">
                 {hints.map((h, idx) => (
                   <div key={idx} className="flex gap-3 items-start group">
                     <div className="w-7 h-7 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#7c3aed] flex items-center justify-center text-xs font-bold mt-1 shrink-0">{idx + 1}</div>
                     <textarea value={h} onChange={e => handleHintChange(idx, e.target.value)} rows={1} placeholder="Hint..." className="flex-1 bg-[#111111] border border-white/5 rounded-lg p-3 text-sm text-gray-300 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 outline-none resize-y transition-all min-h-[44px]"></textarea>
                     <button onClick={() => handleRemoveHint(idx)} className="text-red-500 hover:text-red-400 p-2 mt-1 rounded hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                   </div>
                 ))}
                 {hints.length === 0 && <p className="text-sm text-gray-500 text-center py-2">No hints added.</p>}
               </div>
            </div>

            {/* Starter Code */}
            <div className="bg-[#161616] border border-white/5 rounded-xl p-6 shadow-xl">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2">
                   <div className="p-2 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed]"><Code size={18} /></div>
                   <h2 className="text-base font-bold text-white tracking-tight">Starter Code</h2>
                 </div>
                 <div className="relative">
                   <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)} className="bg-[#111111] border border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-white focus:outline-none focus:border-[#7c3aed] appearance-none cursor-pointer">
                      {languagesAllowed.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                   </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                   </div>
                 </div>
               </div>
               
               <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden shadow-inner">
                 <div className="flex items-center px-4 py-3 bg-[#111111] border-b border-white/5 gap-3">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                     <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                     <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
                   </div>
                   <span className="text-xs text-gray-400 font-mono tracking-wider ml-1">
                     {selectedLang === "Python 3" ? "solution.py" : 
                      selectedLang === "Java" ? "Solution.java" : 
                      selectedLang === "C++" ? "solution.cpp" : "solution.js"}
                   </span>
                 </div>
                 <textarea 
                   value={starterCode[selectedLang] || ""}
                   onChange={handleCodeChange}
                   rows={8}
                   className="w-full bg-transparent p-5 text-sm text-[#e2e8f0] font-mono focus:outline-none resize-y leading-relaxed"
                 ></textarea>
               </div>
            </div>

            {/* Test Cases */}
            <div className="bg-[#161616] border border-white/5 rounded-xl p-6 shadow-xl">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2">
                   <div className="p-2 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed]"><Terminal size={18} /></div>
                   <h2 className="text-base font-bold text-white tracking-tight">Test Cases</h2>
                 </div>
                 <button onClick={handleAddTestCase} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7c3aed]/10 text-[#7c3aed] text-xs font-bold hover:bg-[#7c3aed]/20 transition-colors border border-[#7c3aed]/20 uppercase tracking-wider">
                   <Plus size={14} /> Add Test Case
                 </button>
               </div>
               
               <div className="space-y-4">
                 {testCases.map((tc, idx) => (
                   <div key={idx} className="p-4 bg-[#111111] border border-white/5 rounded-xl flex gap-4 hover:border-white/10 transition-colors relative group">
                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">{idx < 9 ? `0${idx + 1}` : idx + 1}</div>
                     <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Input</label>
                         <textarea value={tc.input} onChange={e => handleTestCaseChange(idx, 'input', e.target.value)} rows={3} className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg p-3 text-sm text-[#c084fc] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 outline-none font-mono transition-all resize-none" placeholder="amount = 5\ncoins = [1,2,5]"></textarea>
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expected Output</label>
                         <textarea value={tc.expectedOutput} onChange={e => handleTestCaseChange(idx, 'expectedOutput', e.target.value)} rows={3} className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg p-3 text-sm text-[#4ade80] focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 outline-none font-mono transition-all resize-none" placeholder="4"></textarea>
                       </div>
                     </div>
                     <button onClick={() => handleRemoveTestCase(idx)} className="absolute right-4 top-4 text-red-500 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                   </div>
                 ))}
                 {testCases.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No test cases added.</p>}
               </div>
            </div>
            
          </div>

          {/* Right Column (Sidebar Settings) */}
          <div className="space-y-6">
            
            {/* Tags / Topics */}
            <div className="bg-[#161616] border border-white/5 rounded-xl p-6 shadow-xl sticky top-[100px]">
               <div className="flex items-center gap-2 mb-5">
                 <div className="p-2 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed]"><Tag size={18} /></div>
                 <h2 className="text-base font-bold text-white tracking-tight">Tags / Topics</h2>
               </div>
               <div className="flex flex-wrap gap-2 mb-4">
                 {tags.map(tag => (
                   <span key={tag} className="px-3 py-1.5 rounded-md bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                     {tag} <button onClick={() => handleRemoveTag(tag)} className="hover:text-white hover:bg-[#7c3aed]/20 rounded-full p-0.5 transition-colors"><X size={12} /></button>
                   </span>
                 ))}
               </div>
               <div className="relative">
                 <select 
                   onChange={handleAddTag}
                   value=""
                   className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 transition-all appearance-none cursor-pointer" 
                 >
                   <option value="" disabled>Select a tag to add...</option>
                   {availableTags.map(t => (
                     <option key={t.id || t.ID || t.name} value={t.name}>{t.name}</option>
                   ))}
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                 </div>
               </div>
            </div>

            {/* Companies */}
            <div className="bg-[#161616] border border-white/5 rounded-xl p-6 shadow-xl">
               <div className="flex items-center gap-2 mb-5">
                 <div className="p-2 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed]"><Briefcase size={18} /></div>
                 <h2 className="text-base font-bold text-white tracking-tight">Companies</h2>
               </div>
               <div className="flex flex-wrap gap-2 mb-4">
                 {companies.map(company => (
                   <span key={company} className="px-3 py-1.5 rounded-md bg-white/5 text-gray-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                     {company} <button onClick={() => handleRemoveCompany(company)} className="hover:text-white hover:bg-white/10 rounded-full p-0.5 transition-colors"><X size={12} /></button>
                   </span>
                 ))}
               </div>
               <div className="relative">
                 <select 
                   onChange={handleAddCompany}
                   value=""
                   className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 transition-all appearance-none cursor-pointer" 
                 >
                   <option value="" disabled>Select a company to add...</option>
                   {availableCompanies.map(c => (
                     <option key={c.id || c.ID || c.name} value={c.name}>{c.name}</option>
                   ))}
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                 </div>
               </div>
            </div>

            {/* Metadata */}
            <div className="bg-[#161616] border border-white/5 rounded-xl p-6 shadow-xl">
               <div className="flex items-center gap-2 mb-5">
                 <div className="p-2 bg-[#7c3aed]/10 rounded-lg text-[#7c3aed]"><Info size={18} /></div>
                 <h2 className="text-base font-bold text-white tracking-tight">Metadata</h2>
               </div>
               <div className="space-y-5">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Time Limit (ms)</label>
                   <div className="relative">
                     <input value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} type="number" className="w-full bg-[#111111] border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 transition-all" />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">ms</span>
                   </div>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Memory Limit (MB)</label>
                   <div className="relative">
                     <input value={memoryLimit} onChange={e => setMemoryLimit(Number(e.target.value))} type="number" className="w-full bg-[#111111] border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 transition-all" />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">MB</span>
                   </div>
                 </div>
                 <div className="space-y-2.5">
                   <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Languages Allowed</label>
                   <div className="flex flex-wrap gap-2">
                     {languagesAllowed.map(lang => (
                       <span key={lang} className="px-2.5 py-1 rounded bg-white/5 text-xs font-medium text-gray-300 border border-white/10">
                         {lang}
                       </span>
                     ))}
                   </div>
                 </div>
               </div>
            </div>

            {/* Publish Checklist */}
            <div className="bg-[#161616] border border-white/5 rounded-xl p-6 shadow-xl">
               <div className="flex items-center justify-between mb-5">
                 <div className="flex items-center gap-2">
                   <div className="p-2 bg-[#22c55e]/10 rounded-lg text-[#22c55e]"><CheckCircle2 size={18} /></div>
                   <h2 className="text-base font-bold text-white tracking-tight">Publish Checklist</h2>
                 </div>
               </div>
               
               <div className="space-y-4">
                 {checklist.map((item, idx) => (
                   <div key={idx} className="flex gap-3 items-start">
                     {item.isValid ? (
                       <CheckCircle2 size={16} className="text-[#22c55e] mt-0.5 shrink-0" />
                     ) : (
                       <div className="w-4 h-4 rounded-full border-2 border-gray-600 mt-0.5 shrink-0"></div>
                     )}
                     <div>
                       <p className={`text-sm font-medium ${item.isValid ? 'text-gray-200' : 'text-gray-400'}`}>{item.label}</p>
                       <p className="text-xs text-gray-500 mt-1">{item.value}</p>
                     </div>
                   </div>
                 ))}
                 
                 <div className="mt-6 pt-5 border-t border-white/5">
                   <div className="flex justify-between items-center mb-2.5">
                     <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{completeCount}/{totalCount} Complete</span>
                     <span className={`text-xs font-bold ${completionPercentage === 100 ? 'text-[#22c55e]' : 'text-[#f59e0b]'}`}>{completionPercentage}%</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                     <div 
                       className={`h-full rounded-full transition-all duration-500 ${completionPercentage === 100 ? 'bg-[#22c55e]' : 'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]'}`} 
                       style={{ width: `${completionPercentage}%` }}
                     ></div>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
