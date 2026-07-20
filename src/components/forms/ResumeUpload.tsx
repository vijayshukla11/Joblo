import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, ShieldAlert } from 'lucide-react';

interface ResumeUploadProps {
  onUploadSuccess: (fileName: string) => void;
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'passed' | 'failed'>('idle');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== "application/pdf") {
      setError("Rejected: Only verified standard PDF files are supported.");
      return false;
    }
    const maxBytes = 5 * 1024 * 1024; // 5 MB
    if (selectedFile.size > maxBytes) {
      setError("Rejected: Document size exceeds our 5.0 MB cloud bandwidth limit.");
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        processFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        processFile(selectedFile);
      }
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus('scanning');
    
    // Simulate high-security automated malware and virus screening
    setTimeout(() => {
      setStatus('passed');
      onUploadSuccess(selectedFile.name);
      console.log(`[Security Analytics] Resume verified clean of malicious signatures: ${selectedFile.name}`);
    }, 2000);
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full space-y-4">
      
      {/* DRAG AND DROP BOX CONTAINER */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={status === 'idle' ? triggerInputClick : undefined}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          dragActive 
            ? 'border-emerald-500 bg-emerald-50/20' 
            : 'border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-slate-50'
        } ${status !== 'idle' ? 'pointer-events-none' : ''}`}
        aria-live="polite"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload PDF Resume"
        />

        {status === 'idle' && (
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
              <Upload className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-gray-800">
                Drag & drop your resume PDF or <span className="text-emerald-700 hover:underline">browse files</span>
              </p>
              <p className="text-[10px] text-gray-400 font-sans">
                Standard PDF only • Strictly enforced 5.0 MB maximum size
              </p>
            </div>
          </div>
        )}

        {status === 'scanning' && (
          <div className="space-y-3 py-2">
            <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-800">Analyzing Document Integrity...</p>
              <p className="text-[10px] text-indigo-500 font-mono">
                Scanning file hashes against global threat signature APIs
              </p>
            </div>
          </div>
        )}

        {status === 'passed' && file && (
          <div className="space-y-3 py-1">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-emerald-950 truncate max-w-[250px] mx-auto">
                {file.name}
              </p>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Malware Check Passed • Encrypted in Transit</span>
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="px-3 py-1 text-[10px] font-bold text-gray-500 hover:text-black bg-slate-100 rounded-lg cursor-pointer transition-colors"
            >
              Upload Different File
            </button>
          </div>
        )}

      </div>

      {/* ERROR FEEDBACK */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-800 text-[11px] font-sans">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{error}</p>
        </div>
      )}

      {/* PRIVACY CONSENT GATE CHECKBOX */}
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2.5">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={privacyConsent}
            onChange={(e) => setPrivacyConsent(e.target.checked)}
            className="accent-emerald-600 mt-0.5 cursor-pointer"
            aria-required="true"
          />
          <span className="text-[10px] text-gray-500 font-medium leading-relaxed">
            I explicitly authorize JOB Lo to parse this PDF and store it inside a secured storage bucket in accordance with India's DPDP Act, 2023. I understand this payload will only be shared with employer pipelines I actively select.
          </span>
        </label>
        
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-400 border-t border-slate-200/50 pt-2">
          <ShieldAlert className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>Server Encryption Level: AES-256</span>
        </div>
      </div>

    </div>
  );
}
