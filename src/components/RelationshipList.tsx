'use client';

import { useState } from 'react';
import { Character, Relationship, RELATIONSHIP_COLORS, RELATIONSHIP_LABELS } from '@/types';
import { Share2, Edit2, Trash2, Hash, ArrowRightLeft, Search, X, ArrowRight, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { RelationshipIcon } from './RelationshipIcon';

interface RelationshipListProps {
  relationships: Relationship[];
  characters: Character[];
  onDelete: (id: string) => void;
  onEdit: (relationship: Relationship) => void;
}

export default function RelationshipList({
  relationships,
  characters,
  onDelete,
  onEdit,
}: RelationshipListProps) {
  const [search, setSearch] = useState('');

  const getCharacter = (id: string) => {
    return characters.find((c) => c.id === id);
  };

  const filtered = relationships.filter((rel) => {
    const q = search.toLowerCase();
    const source = getCharacter(rel.sourceId);
    const target = getCharacter(rel.targetId);
    return (
      (source?.name || '').toLowerCase().includes(q) ||
      (target?.name || '').toLowerCase().includes(q) ||
      (rel.label || '').toLowerCase().includes(q) ||
      (rel.description || '').toLowerCase().includes(q) ||
      RELATIONSHIP_LABELS[rel.type].includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      {relationships.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="관계 검색..."
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
          관계 목록 ({filtered.length}{search && relationships.length !== filtered.length ? ` / ${relationships.length}` : ''})
        </span>
      </div>

      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {relationships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white/5 border border-dashed border-white/10 rounded-2xl">
            <Share2 className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-xs text-slate-500 font-medium text-center italic">
              설정된 관계가 없습니다.
              <br />위의 + 버튼을 눌러 추가하세요.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white/5 border border-dashed border-white/10 rounded-2xl">
            <Search className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-xs text-slate-500 font-medium text-center italic">
              &ldquo;{search}&rdquo;와(과) 일치하는 관계가 없습니다.
            </p>
          </div>
        ) : (
          filtered.map((rel, index) => {
            const source = getCharacter(rel.sourceId);
            const target = getCharacter(rel.targetId);

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                key={rel.id}
                className="group relative flex flex-col gap-2.5 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                onClick={() => onEdit(rel)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {source && (
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                          style={{ backgroundColor: source.color }}
                        >
                          {source.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-bold text-white truncate">{source?.name || '?'}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {rel.directional === false ? (
                        <ArrowRightLeft className="w-3 h-3 text-slate-600" />
                      ) : (
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {target && (
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                          style={{ backgroundColor: target.color }}
                        >
                          {target.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-bold text-white truncate">{target?.name || '?'}</span>
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onEdit(rel)}
                      className="p-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all"
                      title="수정"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('이 관계를 삭제하시겠습니까?')) {
                          onDelete(rel.id);
                        }
                      }}
                      className="p-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all"
                      title="삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: RELATIONSHIP_COLORS[rel.type] + '20',
                      color: RELATIONSHIP_COLORS[rel.type],
                    }}
                  >
                    <RelationshipIcon type={rel.type} className="w-3 h-3" />
                    {RELATIONSHIP_LABELS[rel.type]}
                  </div>
                  <div className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-500">
                    {rel.strength === 'weak' ? '약함' : rel.strength === 'medium' ? '보통' : '강함'}
                  </div>
                  {rel.directional === false && (
                    <div className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-500">
                      양방향
                    </div>
                  )}
                </div>

                {/* Edge Label */}
                {rel.label && (
                  <div className="flex items-center gap-2 px-2 py-1.5 bg-white/[0.03] rounded-lg border border-white/5">
                    <Tag className="w-3 h-3 text-indigo-400/60" />
                    <span className="text-[11px] text-indigo-300/70 font-medium italic">
                      {rel.label}
                    </span>
                  </div>
                )}

                {rel.description && (
                  <p className="text-[11px] text-slate-500 leading-relaxed italic border-l border-white/10 pl-3">
                    {rel.description}
                  </p>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

function Tag({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}
