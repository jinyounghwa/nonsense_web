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
      <h3 className="text-lg font-semibold text-gray-800">캐릭터 목록</h3>
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {characters.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">캐릭터가 없습니다</p>
        ) : (
          characters.map((char) => (
            <div
              key={char.id}
              className={`flex items-center gap-2 p-2 rounded-md transition ${
                selectedId === char.id
                  ? 'bg-blue-100 border border-blue-300'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: char.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {char.name}
                </p>
                {char.description && (
                  <p className="text-xs text-gray-600 truncate">
                    {char.description}
                  </p>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => onEdit(char)}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition"
                >
                  수정
                </button>
                <button
                  onClick={() => {
                    if (confirm(`'${char.name}'을(를) 삭제하시겠습니까?`)) {
                      onDelete(char.id);
                    }
                  }}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
