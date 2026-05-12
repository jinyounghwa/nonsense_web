'use client';

import { useState } from 'react';
import { Character, CharacterGroup } from '@/types';
import { UserPlus, Users, X, Check, Paintbrush, Info, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CharacterFormProps {
  onSubmit: (character: Omit<Character, 'id' | 'created_at'>) => void;
  onMultiSubmit?: (characters: Omit<Character, 'id' | 'created_at'>[]) => void;
  groups?: CharacterGroup[];
  initialValue?: Character;
  onCancel?: () => void;
}

const PRESET_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
  '#f59e0b', '#10b981', '#06b6d4', '#f97316',
  '#1e293b', '#64748b', '#ffffff', '#000000',
];

export default function CharacterForm({
  onSubmit,
  onMultiSubmit,
  groups = [],
  initialValue,
  onCancel,
}: CharacterFormProps) {
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [name, setName] = useState(initialValue?.name || '');
  const [description, setDescription] = useState(initialValue?.description || '');
  const [color, setColor] = useState(initialValue?.color || '#3b82f6');
  const [group, setGroup] = useState(initialValue?.group || '');
  const [bulkInput, setBulkInput] = useState('');

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description: description.trim(), color, group: group || undefined });
    setName('');
    setDescription('');
    setColor('#3b82f6');
    setGroup('');
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;

    const lines = bulkInput.trim().split('\n');
    const characters: Omit<Character, 'id' | 'created_at'>[] = [];

    lines.forEach((line, index) => {
      const parts = line.split('|').map(p => p.trim());
      if (parts[0]) {
        characters.push({
          name: parts[0],
          description: parts[1] || '',
          color: parts[2] || PRESET_COLORS[index % PRESET_COLORS.length],
          group: parts[3] || undefined,
        });
      }
    });

    if (characters.length === 0) return;

    if (onMultiSubmit) {
      onMultiSubmit(characters);
    }
    setBulkInput('');
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      {!initialValue && (
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              mode === 'single'
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <UserPlus className="w-3 h-3" />
            단일 추가
          </button>
          <button
            type="button"
            onClick={() => setMode('multi')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              mode === 'multi'
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Users className="w-3 h-3" />
            일괄 추가
          </button>
        </div>
      )}

      <form onSubmit={mode === 'single' ? handleSingleSubmit : handleBulkSubmit} className="space-y-5">
        <AnimatePresence mode="wait">
          {mode === 'single' ? (
            <motion.div
              key="single"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">캐릭터 이름</label>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 루인 벨제뷔트"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">설명 및 역할</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="예: 제국 제1기사단장, 주인공의 스승"
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                />
              </div>

              {groups.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">소속 세력/그룹</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer hover:bg-white/10 appearance-none"
                  >
                    <option value="" className="bg-slate-900">없음</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.name} className="bg-slate-900">
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                  <Paintbrush className="w-3 h-3" />
                  테마 색상
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`aspect-square rounded-lg border-2 transition-all hover:scale-110 active:scale-95 ${
                        color === c ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <div className="relative group aspect-square rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all overflow-hidden">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                    />
                    <Plus className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="multi"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">일괄 데이터 입력</label>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={'이름 | 설명 | 색상 | 그룹\n루인 | 기사단장 | #3b82f6 | 주인공 진영\n엘레나 | 성녀 | #ec4899 | 주인공 진영'}
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
                />
              </div>
              <div className="flex gap-2 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-indigo-300/70 leading-relaxed font-medium">
                  각 줄에 한 명씩 입력. 파이프(|)로 이름, 설명, 색상, 그룹 순으로 구분.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            {initialValue ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{initialValue ? '수정 완료' : mode === 'single' ? '캐릭터 추가' : '일괄 등록'}</span>
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold rounded-xl transition-all border border-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
