import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
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
  { id: 50, name: "C (GCC 9)", value: "c" },
  { id: 54, name: "C++ (GCC 9)", value: "cpp" },
  { id: 62, name: "Java (OpenJDK 17)", value: "java" },
  { id: 63, name: "JavaScript (Node 18)", value: "javascript" },
  { id: 71, name: "Python (3.8)", value: "python" },
];

const ProblemCodeEditor = () => {
  const [activeTab, setActiveTab] = useState("result");
  const [language, setLanguage] = useState(LANGUAGES[4]);
  const [code, setCode] = useState("");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [isDarkTheme, setIsDarkTheme] = useState(() => document.documentElement.classList.contains("dark"));

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

  const toggleTheme = () => {
    const newTheme = isDarkTheme ? "light" : "dark";
    document.documentElement.classList.toggle("dark", !isDarkTheme);
    localStorage.setItem("theme", newTheme);
    setIsDarkTheme(!isDarkTheme);
  };

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
            {isLangDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg z-50 py-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang);
                      setIsLangDropdownOpen(false);
                    }}
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
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors border border-neutral-300 dark:border-neutral-700 rounded-md bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-700">
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
          <button className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-600 dark:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-400/10 transition-colors">
            <Play className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400" />
            Run
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white bg-[#8B5CF6] hover:bg-[#7c3aed] transition-colors shadow-[0_0_15px_rgba(139,92,246,0.2)] dark:shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Send className="w-4 h-4" />
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
        </div>
        <button className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex gap-4 p-4 bg-white dark:bg-[#121212] overflow-y-auto max-h-[260px] shrink-0 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        {activeTab === "result" ? (
          <>
            <div className="w-48 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex flex-col items-center justify-center p-4 h-full shrink-0">
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

            <div className="flex-1 flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 mb-3">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-bold">Runtime</span>
                  </div>
                  <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                    48ms
                  </div>
                  <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-3">
                    <div className="h-full w-[92%] bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-neutral-500">
                    Faster than 92.4% of Python3 submissions
                  </div>
                </div>

                <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-500 mb-3">
                    <Cpu className="w-4 h-4" />
                    <span className="text-sm font-bold">Memory</span>
                  </div>
                  <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                    23.7 MB
                  </div>
                  <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-3">
                    <div className="h-full w-[87%] bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.2)] dark:shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                  </div>
                  <div className="text-xs text-neutral-500">
                    Less memory than 87.1% of Python3 submissions
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 dark:bg-neutral-900 rounded-xl text-sm font-medium border border-neutral-200 dark:border-neutral-800 mt-auto">
                <div className="flex items-center gap-3">
                  <ListChecks className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Test Cases
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-500">
                    73 / 73 passed
                  </span>
                </div>
                <div className="text-neutral-500">
                  Language:{" "}
                  <span className="text-neutral-900 dark:text-white">
                    {language.name}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col w-full gap-4">
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium">
                Case 1
              </button>
              <button className="px-4 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-sm font-medium transition-colors">
                Case 2
              </button>
              <button className="px-4 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-sm font-medium transition-colors">
                Case 3
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-xs text-neutral-500 mb-1 font-medium">
                  amount =
                </div>
                <div className="bg-neutral-50 dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 font-mono text-sm text-neutral-800 dark:text-neutral-300">
                  5
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 mb-1 font-medium">
                  coins =
                </div>
                <div className="bg-neutral-50 dark:bg-[#1e1e1e] border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 font-mono text-sm text-neutral-800 dark:text-neutral-300">
                  [1, 2, 5]
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemCodeEditor;
