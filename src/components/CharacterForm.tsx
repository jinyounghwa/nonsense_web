'use client';

import { useState } from 'react';
import { Character } from '@/types';

interface CharacterFormProps {
  onSubmit: (character: Omit<Character, 'id' | 'created_at'>) => void;
  initialValue?: Character;
  onCancel?: () => void;
}

const PRESET_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
  '#f59e0b', '#10b981', '#06b6d4', '#f97316',
];

export default function CharacterForm({
  onSubmit,
  initialValue,
  onCancel,
}: CharacterFormProps) {
  const [name, setName] = useState(initialValue?.name || '');
  const [description, setDescription] = useState(initialValue?.description || '');
  const [color, setColor] = useState(initialValue?.color || '#3b82f6');

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-slate-700/50 rounded-lg border border-purple-500/20 backdrop-blur-sm"
    >
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

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 transform hover:scale-105"
        >
          {initialValue ? '✏️ 수정' : '➕ 추가'}
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
