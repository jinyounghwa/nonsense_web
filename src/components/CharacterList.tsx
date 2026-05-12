'use client';

import { Character } from '@/types';

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
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-purple-300 uppercase tracking-widest">캐릭터 목록</h3>
      <div className="space-y-1 max-h-96 overflow-y-auto pr-2">
        {characters.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">캐릭터가 없습니다</p>
        ) : (
          characters.map((char) => (
            <div
              key={char.id}
              className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                selectedId === char.id
                  ? 'bg-purple-600/40 border border-purple-500 shadow-lg'
                  : 'bg-slate-700/40 border border-slate-600/50 hover:bg-slate-700/60 hover:border-purple-500/30'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-white/30"
                style={{ backgroundColor: char.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {char.name}
                </p>
                {char.description && (
                  <p className="text-xs text-slate-400 truncate">
                    {char.description}
                  </p>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => onEdit(char)}
                  className="text-xs bg-blue-600/70 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
                  title="수정"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (confirm(`'${char.name}'을(를) 삭제하시겠습니까?`)) {
                      onDelete(char.id);
                    }
                  }}
                  className="text-xs bg-red-600/70 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
