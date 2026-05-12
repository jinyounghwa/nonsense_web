'use client';

import { Character } from '@/types';
import { User, Edit2, Trash2, Hash } from 'lucide-react';
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
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-500 mb-2">
        <Hash className="w-3 h-3" />
        <span className="text-[10px] font-bold uppercase tracking-widest">인물 목록 ({characters.length})</span>
      </div>
      
      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {characters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white/5 border border-dashed border-white/10 rounded-2xl">
            <User className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-xs text-slate-500 font-medium text-center italic">등록된 캐릭터가 없습니다.<br/>위의 + 버튼을 눌러 추가하세요.</p>
          </div>
        ) : (
          characters.map((char, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={char.id}
              className={`group relative flex items-center gap-3 p-3 rounded-xl transition-all ${
                selectedId === char.id
                  ? 'bg-indigo-500/20 border border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <div
                className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold shadow-inner relative overflow-hidden"
                style={{ backgroundColor: char.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                <span className="relative z-10">{char.name.charAt(0)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                  {char.name}
                </p>
                {char.description && (
                  <p className="text-[11px] text-slate-500 truncate mt-0.5 leading-tight font-medium">
                    {char.description}
                  </p>
                )}
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
