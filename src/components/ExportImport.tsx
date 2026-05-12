'use client';

import { useRef, useState } from 'react';
import { GraphData } from '@/types';

interface ExportImportProps {
  graphData: GraphData;
  onImport: (data: GraphData) => void;
}

export default function ExportImport({ graphData, onImport }: ExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

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
          throw new Error('Invalid file format');
        }

        onImport(data);
        setImportError(null);
        alert('성공적으로 불러왔습니다');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setImportError(`파일을 읽을 수 없습니다: ${message}`);
        alert(`파일을 읽을 수 없습니다: ${message}`);
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
    <div className="space-y-3 p-4 bg-slate-700/50 rounded-lg border border-purple-500/20 backdrop-blur-sm">
      <h3 className="text-sm font-bold text-purple-300 uppercase tracking-widest">내보내기 & 불러오기</h3>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExport}
            className="bg-purple-600/80 hover:bg-purple-600 text-white font-semibold py-2 px-3 rounded-md transition text-sm"
          >
            📥 내보내기
          </button>
          <button
            onClick={handleImportClick}
            className="bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold py-2 px-3 rounded-md transition text-sm"
          >
            📤 불러오기
          </button>
        </div>
        <button
          onClick={handleDownloadSample}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          📋 샘플 다운로드
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {importError && (
        <div className="p-3 bg-red-600/20 border border-red-500/50 rounded text-sm text-red-300">
          ⚠️ {importError}
        </div>
      )}

      <div className="text-xs text-slate-400 pt-2 border-t border-slate-600/50">
        <p>💾 JSON으로 프로젝트를 저장하고 복구할 수 있습니다</p>
      </div>
    </div>
  );
}
