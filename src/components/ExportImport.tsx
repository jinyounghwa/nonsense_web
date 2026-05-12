'use client';

import { useRef, useState } from 'react';
import { GraphData } from '@/types';
import { Download, Upload, FileJson, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExportImportProps {
  graphData: GraphData;
  onImport: (data: GraphData) => void;
}

export default function ExportImport({ graphData, onImport }: ExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExport = () => {
    const data = {
      title: graphData.title,
      description: graphData.description,
      characters: graphData.characters,
      relationships: graphData.relationships,
    };
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `narrativeweb-${graphData.title || 'export'}-${timestamp}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content) as GraphData;

        if (!Array.isArray(data.characters) || !Array.isArray(data.relationships)) {
          throw new Error('올바른 NarrativeWeb 데이터 형식이 아닙니다.');
        }

        onImport(data);
        setImportStatus('success');
        setErrorMessage(null);
        setTimeout(() => setImportStatus('idle'), 3000);
      } catch (err) {
        setImportStatus('error');
        setErrorMessage(err instanceof Error ? err.message : '파일을 읽는 중 오류가 발생했습니다.');
        setTimeout(() => setImportStatus('idle'), 5000);
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadSample = () => {
    const sampleData = {
      title: '샘플 프로젝트',
      description: '웹소설 예시 - 판타지 이야기',
      characters: [
        { id: '1', name: '에리엘', description: '검사', color: '#3b82f6' },
        { id: '2', name: '루시안', description: '마법사', color: '#8b5cf6' },
        { id: '3', name: '모르간', description: '암흑 기사', color: '#ef4444' },
        { id: '4', name: '아리엘', description: '엘프 궁수', color: '#06b6d4' },
      ],
      relationships: [
        { id: '1', sourceId: '1', targetId: '2', type: 'friend', strength: 'strong', description: '오래된 친구' },
        { id: '2', sourceId: '1', targetId: '3', type: 'enemy', strength: 'strong', description: '운명의 적' },
        { id: '3', sourceId: '1', targetId: '4', type: 'love', strength: 'medium', description: '모르는 감정' },
        { id: '4', sourceId: '2', targetId: '4', type: 'friend', strength: 'medium', description: '동료' },
      ],
    };

    const blob = new Blob([JSON.stringify(sampleData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'narrativeweb-sample.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={handleExport}
          className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 rounded-2xl transition-all text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">데이터 내보내기</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">현재 프로젝트를 JSON 파일로 저장합니다.</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleImportClick}
          className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 rounded-2xl transition-all text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">데이터 불러오기</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">저장된 JSON 파일을 불러와 복원합니다.</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleDownloadSample}
          className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-amber-500/30 rounded-2xl transition-all text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">샘플 데이터</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">구조를 파악할 수 있는 예시 데이터를 받습니다.</p>
            </div>
          </div>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
          데이터는 브라우저 로컬 스토리지에 자동 저장되지만, 브라우저 캐시 삭제 시 데이터가 소실될 수 있습니다. 중요한 프로젝트는 반드시 파일로 백업하세요.
        </p>
      </div>

      <motion.div
        animate={importStatus !== 'idle' ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        className="fixed bottom-10 left-10 right-10 sm:left-auto sm:right-10 sm:w-80 z-50 pointer-events-none"
      >
        {importStatus === 'success' && (
          <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-xs font-bold uppercase tracking-widest">불러오기 성공</p>
          </div>
        )}
        {importStatus === 'error' && (
          <div className="p-4 bg-red-500 text-white rounded-2xl shadow-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p className="text-xs font-bold uppercase tracking-widest">{errorMessage}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
