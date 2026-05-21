/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileText, Cpu, Server, LayoutTemplate, Layers, GitMerge } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function App() {
  const [markdown, setMarkdown] = useState<string>("Loading architecture...");

  useEffect(() => {
    // Fetch the architecture document
    fetch("/ARCHITECTURE.md")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch ARCHITECTURE.md");
        return res.text();
      })
      .then((text) => setMarkdown(text))
      .catch((err) => {
        console.error(err);
        setMarkdown("# Error\nFailed to load architecture specification.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
              <Layers size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">WebSeal Architecture</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">System Specification</p>
            </div>
          </div>
          <div className="flex space-x-2 text-gray-400">
            <span className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <FileText size={20} />
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation / Summary */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 flex items-center mb-4 text-sm tracking-wide uppercase">
              <GitMerge size={16} className="mr-2 text-blue-600" />
              Core Layers
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <LayoutTemplate size={18} className="mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">1. Frontend</p>
                  <p className="text-xs text-gray-500 mt-0.5">Minimal UI. No intelligence.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Server size={18} className="mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">2. Backend</p>
                  <p className="text-xs text-gray-500 mt-0.5">TX Relayer. No intelligence.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Cpu size={18} className="mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">3. GenLayer Contract</p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">Core Trust & AI Engine.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2">Architectural Rule</p>
            <p className="text-sm text-blue-900/80 leading-relaxed">
              ONLY the deployed GenLayer contract performs intelligence. 
              The backend simply signs sponsored transactions.
            </p>
          </div>
        </div>

        {/* Markdown Content Panel */}
        <div className="lg:col-span-9">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm">
            <div className="prose prose-blue max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-gray-600 prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:rounded-xl prose-code:text-sm prose-code:font-mono">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
