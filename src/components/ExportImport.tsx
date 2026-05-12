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

  return (
    <div className="space-y-3 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800">내보내기/불러오기</h3>

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition"
        >
          JSON 다운로드
        </button>
        <button
          onClick={handleImportClick}
          className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md transition"
        >
          JSON 불러오기
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
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {importError}
        </div>
      )}

      <div className="text-xs text-gray-500 pt-2 border-t">
        <p>💾 JSON 파일로 프로젝트를 저장하고 불러올 수 있습니다</p>
      </div>
    </div>
  );
}
