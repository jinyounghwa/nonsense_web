'use client';

import { useState } from 'react';
import { Character } from '@/types';

interface CharacterFormProps {
  onSubmit: (character: Omit<Character, 'id' | 'created_at'>) => void;
  onMultiSubmit?: (characters: Omit<Character, 'id' | 'created_at'>[]) => void;
  initialValue?: Character;
  onCancel?: () => void;
}

const PRESET_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
  '#f59e0b', '#10b981', '#06b6d4', '#f97316',
];

export default function CharacterForm({
  onSubmit,
  onMultiSubmit,
  initialValue,
  onCancel,
}: CharacterFormProps) {
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [name, setName] = useState(initialValue?.name || '');
  const [description, setDescription] = useState(initialValue?.description || '');
  const [color, setColor] = useState(initialValue?.color || '#3b82f6');
  const [bulkInput, setBulkInput] = useState('');

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('캐릭터 이름을 입력해주세요');
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim(), color });
    setName('');
    setDescription('');
    setColor('#3b82f6');
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInput.trim()) {
      alert('캐릭터 정보를 입력해주세요');
      return;
    }

    const lines = bulkInput.trim().split('\n');
    const characters: Omit<Character, 'id' | 'created_at'>[] = [];

    lines.forEach((line, index) => {
      const parts = line.split('|').map(p => p.trim());
      if (parts[0]) {
        characters.push({
          name: parts[0],
          description: parts[1] || '',
          color: parts[2] || PRESET_COLORS[index % PRESET_COLORS.length],
        });
      }
    });

    if (characters.length === 0) {
      alert('유효한 캐릭터 정보가 없습니다');
      return;
    }

    if (onMultiSubmit) {
      onMultiSubmit(characters);
    }
    setBulkInput('');
  };

  return (
    <form
      onSubmit={mode === 'single' ? handleSingleSubmit : handleBulkSubmit}
      className="space-y-4 p-4 bg-slate-700/50 rounded-lg border border-purple-500/20 backdrop-blur-sm"
    >
      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('single')}
          className={`flex-1 py-2 px-3 rounded-md font-semibold text-sm transition-all ${
            mode === 'single'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
          }`}
        >
          1개 추가
        </button>
        <button
          type="button"
          onClick={() => setMode('multi')}
          className={`flex-1 py-2 px-3 rounded-md font-semibold text-sm transition-all ${
            mode === 'multi'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
          }`}
        >
          여러개 추가
        </button>
      </div>

      {mode === 'single' ? (
        <>
          <div>
            <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-widest">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="캐릭터 이름"
              className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-widest">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="캐릭터 설명..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-widest">
              색상
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c ? 'border-white ring-2 ring-white ring-offset-2 ring-offset-slate-700' : 'border-slate-500'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <label className="text-xs text-purple-300">직접 선택:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-8 cursor-pointer rounded border border-purple-500/30"
              />
            </div>
          </div>
        </>
      ) : (
        <div>
          <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-widest">
            캐릭터 정보 (이름 | 설명 | 색상)
          </label>
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="예시:&#10;주인공 | 용감한 검사 | #3b82f6&#10;조력자 | 현명한 마법사 | #8b5cf6&#10;적대자 | 신비로운 암흑기사"
            rows={6}
            className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400 transition font-mono text-sm"
          />
          <p className="text-xs text-slate-400 mt-2">
            💡 한 줄에 하나씩, 파이프(|)로 구분하세요. 색상은 생략 가능합니다.
          </p>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 transform hover:scale-105"
        >
          {initialValue ? '✏️ 수정' : mode === 'single' ? '➕ 추가' : '➕ 모두 추가'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}
