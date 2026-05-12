'use client';

import { useState } from 'react';
import { Character } from '@/types';
import { User, Edit2, Trash2, Hash, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface CharacterListProps {
  characters: Character[];
  onDelete: (id: string) => void;
  onEdit: (character: Character) => void;
  selectedId?: string;
}

export default function CharacterList({
  characters,
  onDelete,
  onEdit,
  selectedId,
}: CharacterListProps) {
  const [search, setSearch] = useState('');

  const filtered = characters.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      (c.group || '').toLowerCase().includes(q)
    );
  });

  const groupCounts: Record<string, number> = {};
  characters.forEach((c) => {
    const g = c.group || '미분류';
    groupCounts[g] = (groupCounts[g] || 0) + 1;
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      {characters.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="인물 검색..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 text-slate-500">
        <Hash className="w-3 h-3" />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          인물 목록 ({filtered.length}{search && characters.length !== filtered.length ? ` / ${characters.length}` : ''})
        </span>
      </div>

      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {characters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white/5 border border-dashed border-white/10 rounded-2xl">
            <User className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-xs text-slate-500 font-medium text-center italic">
              등록된 캐릭터가 없습니다.
              <br />위의 + 버튼을 눌러 추가하세요.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white/5 border border-dashed border-white/10 rounded-2xl">
            <Search className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-xs text-slate-500 font-medium text-center italic">
              &ldquo;{search}&rdquo;와(과) 일치하는 인물이 없습니다.
            </p>
          </div>
        ) : (
          filtered.map((char, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              key={char.id}
              className={`group relative flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                selectedId === char.id
                  ? 'bg-indigo-500/20 border border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10'
              }`}
              onClick={() => onEdit(char)}
            >
              <div
                className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold shadow-inner relative overflow-hidden"
                style={{ backgroundColor: char.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                <span className="relative z-10">{char.name.charAt(0)}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                    {char.name}
                  </p>
                  {char.group && (
                    <span className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] text-slate-400 font-bold shrink-0 truncate max-w-[80px]">
                      {char.group}
                    </span>
                  )}
                </div>
                {char.description && (
                  <p className="text-[11px] text-slate-500 truncate mt-0.5 leading-tight font-medium">
                    {char.description}
                  </p>
                )}
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEdit(char)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all"
                  title="수정"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`'${char.name}'을(를) 삭제하시겠습니까?`)) {
                      onDelete(char.id);
                    }
                  }}
                  className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all"
                  title="삭제"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
