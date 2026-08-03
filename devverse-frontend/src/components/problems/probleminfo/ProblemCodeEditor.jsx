import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import apiClient from "../../../config/ApiClient";
import {
  ChevronRight,
  Code2,
  Moon,
  Sun,
  Minus,
  Plus,
  RotateCcw,
  Maximize,
  FileCode2,
  Play,
  Send,
  SquareTerminal,
  CheckCircle2,
  X,
  Clock,
  Cpu,
  ListChecks,
} from "lucide-react";

const LANGUAGES = [
  { id: 50, name: "C (GCC 9)", value: "c", bpKey: "C" },
  { id: 54, name: "C++ (GCC 9)", value: "cpp", bpKey: "CPP" },
  { id: 62, name: "Java (OpenJDK 17)", value: "java", bpKey: "JAVA" },
  { id: 63, name: "JavaScript (Node 18)", value: "javascript", bpKey: "JAVASCRIPT" },
  { id: 71, name: "Python (3.8)", value: "python", bpKey: "PYTHON" },
];

const ProblemCodeEditor = ({ problemId }) => {
  const [activeTab, setActiveTab] = useState("test-cases");
  const [language, setLanguage] = useState(LANGUAGES[4]);
  const [code, setCode] = useState("");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [isDarkTheme, setIsDarkTheme] = useState(() => document.documentElement.classList.contains("dark"));
  
  const [boilerplates, setBoilerplates] = useState([]);
  const [loadingBp, setLoadingBp] = useState(true);
  const [bpError, setBpError] = useState(false);
  const [availableLangs, setAvailableLangs] = useState([]);

  const [testCases, setTestCases] = useState([]);
  const [loadingTc, setLoadingTc] = useState(false);
  const [tcError, setTcError] = useState(false);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [hasResult, setHasResult] = useState(false);
  
  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [activeResultCase, setActiveResultCase] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkTheme(document.documentElement.classList.contains("dark"));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!problemId) return;
    const fetchBoilerplates = async () => {
      try {
        setLoadingBp(true);
        const res = await apiClient.get(`/problem/boilerplate/problem/${problemId}`);
        if (res.data?.data && res.data.data.length > 0) {
          setBoilerplates(res.data.data);
          
          const available = LANGUAGES.filter(lang => 
            res.data.data.some(bp => bp.language === lang.bpKey)
          );
          
          if (available.length > 0) {
            setAvailableLangs(available);
            setLanguage(available[0]);
            
            const bp = res.data.data.find(b => b.language === available[0].bpKey);
            if (bp) setCode(bp.boilerplate);
            setBpError(false);
          } else {
            setBpError(true);
          }
        } else {
          setBpError(true);
        }
      } catch (err) {
        setBpError(true);
      } finally {
        setLoadingBp(false);
      }
    };
    fetchBoilerplates();
  }, [problemId]);

  useEffect(() => {
    if (!problemId) return;
    const fetchTestCases = async () => {
      try {
        setLoadingTc(true);
        const res = await apiClient.get(`/problem/testcase/problem/${problemId}`);
        if (res.data?.data) {
          const publicTc = res.data.data.filter(tc => !tc.isHidden);
          setTestCases(publicTc);
          setTcError(false);
        } else {
          setTestCases([]);
          setTcError(false);
        }
      } catch (err) {
        setTcError(true);
      } finally {
        setLoadingTc(false);
      }
    };
    fetchTestCases();
  }, [problemId]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
    const bp = boilerplates.find(b => b.language === lang.bpKey);
    if (bp) {
      setCode(bp.boilerplate);
    }
  };

  const checkIsAccepted = (stdout, expected) => {
    if (!stdout && !expected) return true;
    if (!stdout || !expected) return false;
    return stdout.trim() === expected.trim();
  };

  const handleRun = async () => {
    if (!testCases || testCases.length === 0) return;
    
    setIsRunning(true);
    setHasResult(true);
    setActiveTab("result");
    setRunResults(null);
    setSubmitResult(null);
    setActiveResultCase(0);

    try {
      const results = await Promise.all(
        testCases.map(async (tc) => {
          const res = await apiClient.post("/codebox/test", {
            code: code,
            languageId: language.id,
            stdin: tc.input
          });
          const data = res.data?.data || {};
          
          const passed = checkIsAccepted(data.stdout, tc.output);
          const hasCompileError = data.status?.id === 6;
          const hasRuntimeError = ![3, 6].includes(data.status?.id) && data.status?.id !== undefined;

          return {
            ...data,
            passed,
            expectedOutput: tc.output,
            input: tc.input,
            hasCompileError,
            hasRuntimeError
          };
        })
      );
      setRunResults(results);
    } catch (err) {
      console.error("Run error", err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problemId) return;
    
    setIsSubmitting(true);
    setHasResult(true);
    setActiveTab("result");
    setSubmitResult(null);
    setRunResults(null);

    try {
      const res = await apiClient.post("/problem/submission/submit", {
        problemsId: problemId,
        code: code,
        language: language.bpKey,
        status: "PENDING",
        executionTimeMs: 0,
        memoryUsedKb: 0
      });
      setSubmitResult(res.data?.data);
    } catch (err) {
      console.error("Submit error", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = isDarkTheme ? "light" : "dark";
    document.documentElement.classList.toggle("dark", !isDarkTheme);
    localStorage.setItem("theme", newTheme);
    setIsDarkTheme(!isDarkTheme);
  };

  if (loadingBp) {
    return (
      <div className="w-1/2 flex flex-col bg-neutral-50 dark:bg-[#1e1e1e] transition-colors items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-500"></div>
      </div>
    );
  }

  if (bpError) {
    return (
      <div className="w-1/2 flex flex-col bg-neutral-50 dark:bg-[#1e1e1e] transition-colors items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4">
          <Code2 className="w-8 h-8 text-red-600 dark:text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Editor Unavailable</h3>
        <p className="text-neutral-500 dark:text-neutral-400">
          Boilerplate code is not available for this problem yet. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-1/2 flex flex-col bg-neutral-50 dark:bg-[#1e1e1e] transition-colors">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] text-xs transition-colors">
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors text-neutral-900 dark:text-white font-medium"
            >
              <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{language.name}</span>
              <ChevronRight className={`w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 transition-transform ${isLangDropdownOpen ? "-rotate-90" : "rotate-90"}`} />
            </button>
            {isLangDropdownOpen && availableLangs.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg z-50 py-1">
                {availableLangs.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${language.id === lang.id ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" : "text-neutral-700 dark:text-neutral-300"}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isDarkTheme ? "Light" : "Dark"}</span>
          </button>
          <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800/50">
            <button
              onClick={() => setFontSize(Math.max(10, fontSize - 1))}
              className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white text-neutral-500 dark:text-neutral-400 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-neutral-900 dark:text-white font-medium">
              {fontSize}
            </span>
            <button
              onClick={() => setFontSize(Math.min(30, fontSize + 1))}
              className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white text-neutral-500 dark:text-neutral-400 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleLanguageChange(language)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors border border-neutral-300 dark:border-neutral-700 rounded-md bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors border border-neutral-300 dark:border-neutral-700 rounded-md bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-700">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 px-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] transition-colors">
        <div className="flex items-center gap-2 px-4 py-2 border-t-2 border-purple-600 dark:border-purple-500 bg-neutral-50 dark:bg-[#1e1e1e] text-purple-700 dark:text-purple-400 text-sm">
          <FileCode2 className="w-4 h-4" />
          <span className="font-medium">solution.{language.value === "python" ? "py" : language.value === "javascript" ? "js" : language.value === "java" ? "java" : language.value === "cpp" ? "cpp" : "c"}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-1"></div>
        </div>
        <button className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex bg-white dark:bg-[#1e1e1e] relative overflow-hidden transition-colors">
        <Editor
          height="100%"
          language={language.value}
          theme={isDarkTheme ? "vs-dark" : "light"}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
          }}
          loading={
            <div className="flex items-center justify-center h-full w-full bg-white dark:bg-[#1e1e1e]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-500"></div>
            </div>
          }
        />
      </div>

      <div className="flex items-center justify-between px-4 py-1.5 bg-white dark:bg-[#1a1a1a] text-[11px] text-neutral-500 border-t border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div>
          {language.name} &nbsp;&nbsp;&nbsp; UTF-8
        </div>
        <div className="flex items-center gap-4">
          <span>Spaces: 4</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>No errors</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-[#121212] transition-colors">
        <div className="flex items-center gap-2 text-neutral-500 text-sm bg-neutral-200/50 dark:bg-neutral-900/50 px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-800">
          <SquareTerminal className="w-4 h-4" />
          <span>
            Ctrl+Enter <span className="text-neutral-600">to run</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-colors ${isRunning ? 'text-neutral-400 border border-neutral-400 cursor-not-allowed' : 'text-emerald-600 dark:text-emerald-400 border border-emerald-600 dark:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-400/10'}`}
          >
            {isRunning ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-400"></div>
            ) : (
              <Play className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400" />
            )}
            Run
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)] dark:shadow-[0_0_15px_rgba(139,92,246,0.3)] ${isSubmitting ? 'bg-neutral-400 cursor-not-allowed shadow-none dark:shadow-none' : 'bg-[#8B5CF6] hover:bg-[#7c3aed]'}`}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
            Submit
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 border-t border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] transition-colors">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("test-cases")}
            className={`flex items-center gap-2 px-4 py-3 transition-colors text-sm font-medium ${
              activeTab === "test-cases"
                ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <SquareTerminal className="w-4 h-4" />
            Test Cases
          </button>
          {hasResult && (
            <button
              onClick={() => setActiveTab("result")}
              className={`flex items-center gap-2 px-4 py-3 transition-colors text-sm font-medium ${
                activeTab === "result"
                  ? "border-b-2 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Result
            </button>
          )}
        </div>
        <button className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex gap-4 p-4 bg-white dark:bg-[#121212] overflow-y-auto max-h-fit shrink-0 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        {activeTab === "result" ? (
          <div className="flex flex-col w-full gap-4">
            {isRunning || isSubmitting ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 dark:border-purple-500"></div>
                <span className="ml-3 text-sm text-neutral-500">{isRunning ? "Running..." : "Submitting..."}</span>
              </div>
            ) : submitResult ? (
              <div className="flex flex-col gap-4">
                 {submitResult.submission.status === "ACCEPTED" ? (
                   <>
                     <div className="w-48 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex flex-col items-center justify-center p-4 shrink-0">
                       <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-3">
                         <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                       </div>
                       <div className="text-emerald-600 dark:text-emerald-500 font-bold text-xl mb-1">
                         Accepted
                       </div>
                       <div className="text-emerald-600/60 dark:text-emerald-500/60 text-xs text-center">
                         All test cases passed
                       </div>
                     </div>
                     
                     <div className="flex flex-col gap-4 mt-2">
                       <div className="flex gap-4">
                         <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                           <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 mb-3">
                             <Clock className="w-4 h-4" />
                             <span className="text-sm font-bold">Runtime</span>
                           </div>
                           <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                             {submitResult.submission.executionTimeMs} ms
                           </div>
                         </div>
                         <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                           <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-500 mb-3">
                             <Cpu className="w-4 h-4" />
                             <span className="text-sm font-bold">Memory</span>
                           </div>
                           <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                             {(submitResult.submission.memoryUsedKb / 1024).toFixed(1)} MB
                           </div>
                         </div>
                       </div>
                     </div>
                   </>
                 ) : (
                   <div className="flex flex-col gap-4">
                     <div className="text-2xl font-bold text-red-500">
                       {submitResult.submission.status.replace(/_/g, " ")}
                     </div>
                     <div className="text-sm text-neutral-600 dark:text-neutral-400">
                       {submitResult.passedTestCases} / {submitResult.totalTestCases} test cases passed.
                     </div>
                     {submitResult.failedTestCase && (
                       <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-lg flex flex-col gap-2">
                          <span className="font-bold text-sm text-neutral-700 dark:text-neutral-300">Failed Test Case</span>
                          <div>
                            <div className="text-xs text-neutral-500 mb-1">Input</div>
                            <div className="font-mono text-xs bg-white dark:bg-[#1e1e1e] p-2 rounded border border-neutral-200 dark:border-neutral-700 whitespace-pre-wrap">{submitResult.failedTestCase.input}</div>
                          </div>
                          {submitResult.failedTestCase.yourOutput && (
                            <div>
                              <div className="text-xs text-neutral-500 mb-1">Output</div>
                              <div className="font-mono text-xs p-2 rounded border bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 whitespace-pre-wrap break-all">{submitResult.failedTestCase.yourOutput}</div>
                            </div>
                          )}
                          <div>
                            <div className="text-xs text-neutral-500 mb-1">Expected Output</div>
                            <div className="font-mono text-xs bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 p-2 rounded whitespace-pre-wrap">{submitResult.failedTestCase.expectedOutput}</div>
                          </div>
                          {(submitResult.failedTestCase.compileError || submitResult.failedTestCase.runtimeError) && (
                            <div className="mt-2 text-red-500 font-mono text-xs whitespace-pre-wrap">
                              {submitResult.failedTestCase.compileError || submitResult.failedTestCase.runtimeError}
                            </div>
                          )}
                       </div>
                     )}
                   </div>
                 )}
              </div>
            ) : runResults ? (
              <div className="flex flex-col gap-4">
                {runResults.some(r => r.hasCompileError) ? (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4">
                    <div className="text-red-600 dark:text-red-500 font-bold text-lg mb-2">Compilation Error</div>
                    <pre className="text-xs text-red-600/80 dark:text-red-400 font-mono whitespace-pre-wrap">
                      {runResults.find(r => r.hasCompileError)?.compile_output}
                    </pre>
                  </div>
                ) : runResults.some(r => r.hasRuntimeError) ? (
                  <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-4">
                    <div className="text-orange-600 dark:text-orange-500 font-bold text-lg mb-2">Runtime Error</div>
                    <pre className="text-xs text-orange-600/80 dark:text-orange-400 font-mono whitespace-pre-wrap">
                      {runResults.find(r => r.hasRuntimeError)?.stderr}
                    </pre>
                  </div>
                ) : (
                  <>
                    <div className={`text-2xl font-bold ${runResults.every(r => r.passed) ? "text-emerald-500" : "text-red-500"}`}>
                      {runResults.every(r => r.passed) ? "Accepted" : "Wrong Answer"}
                    </div>
                    <div className="flex gap-2">
                      {runResults.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveResultCase(i)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                            activeResultCase === i
                              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${r.passed ? "bg-emerald-500" : "bg-red-500"}`}></div>
                          Case {i + 1}
                        </button>
                      ))}
                    </div>
                    
                    {runResults[activeResultCase] && (
                      <div className="flex flex-col gap-4 mt-2">
                        <div>
                          <div className="text-xs text-neutral-500 mb-1 font-medium">Input</div>
                          <div className="bg-neutral-50 dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 font-mono text-sm text-neutral-800 dark:text-neutral-300 whitespace-pre-wrap">
                            {runResults[activeResultCase].input}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-neutral-500 mb-1 font-medium">Output</div>
                          <div className="bg-neutral-50 dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 font-mono text-sm text-neutral-800 dark:text-neutral-300 whitespace-pre-wrap break-all">
                            {runResults[activeResultCase].stdout || "No output"}
                          </div>
                        </div>
                        {!runResults[activeResultCase].passed && (
                          <div>
                            <div className="text-xs text-neutral-500 mb-1 font-medium">Expected Output</div>
                            <div className="bg-neutral-50 dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 font-mono text-sm text-neutral-800 dark:text-neutral-300 whitespace-pre-wrap">
                              {runResults[activeResultCase].expectedOutput}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-neutral-500 text-sm flex items-center justify-center py-8">
                Run code to see results
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col w-full gap-4">
            {loadingTc ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 dark:border-purple-500"></div>
              </div>
            ) : tcError ? (
              <div className="text-red-500 text-sm py-4">Failed to load test cases.</div>
            ) : testCases.length === 0 ? (
              <div className="text-neutral-500 text-sm py-4">No public test cases available.</div>
            ) : (
              <>
                <div className="flex gap-2">
                  {testCases.map((tc, idx) => (
                    <button
                      key={tc.id || tc.ID || idx}
                      onClick={() => setActiveTestCase(idx)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeTestCase === idx
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>
                
                {testCases[activeTestCase] && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="text-xs text-neutral-500 mb-1 font-medium">Input =</div>
                      <div className="bg-neutral-50 dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 font-mono text-sm text-neutral-800 dark:text-neutral-300 whitespace-pre-wrap">
                        {testCases[activeTestCase].input}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 mb-1 font-medium">Expected Output =</div>
                      <div className="bg-neutral-50 dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 font-mono text-sm text-neutral-800 dark:text-neutral-300 whitespace-pre-wrap">
                        {testCases[activeTestCase].output}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemCodeEditor;
