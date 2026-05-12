'use client';

import { Character, Relationship, RELATIONSHIP_COLORS, RELATIONSHIP_LABELS } from '@/types';
import { Share2, Edit2, Trash2, Hash, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const getCharacter = (id: string) => {
    return characters.find((c) => c.id === id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-slate-500 mb-2">
        <Hash className="w-3 h-3" />
        <span className="text-[10px] font-bold uppercase tracking-widest">관계 목록 ({relationships.length})</span>
      </div>

      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {relationships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white/5 border border-dashed border-white/10 rounded-2xl">
            <Share2 className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-xs text-slate-500 font-medium text-center italic">설정된 관계가 없습니다.<br/>위의 + 버튼을 눌러 추가하세요.</p>
          </div>
        ) : (
          relationships.map((rel, index) => {
            const source = getCharacter(rel.sourceId);
            const target = getCharacter(rel.targetId);
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={rel.id}
                className="group relative flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-white truncate">{source?.name || 'Unknown'}</span>
                    <ArrowRightLeft className="w-3 h-3 text-slate-600 shrink-0" />
                    <span className="text-xs font-bold text-white truncate">{target?.name || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

                <div className="flex items-center gap-2">
                  <div 
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: RELATIONSHIP_COLORS[rel.type] + '40', color: RELATIONSHIP_COLORS[rel.type] }}
                  >
                    {RELATIONSHIP_LABELS[rel.type]}
                  </div>
                  <div className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-500">
                    {rel.strength === 'weak' ? '약함' : rel.strength === 'medium' ? '보통' : '강함'}
                  </div>
                </div>

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
