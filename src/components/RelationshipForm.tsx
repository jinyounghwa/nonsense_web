'use client';

import { useState } from 'react';
import { Character, Relationship, RELATIONSHIP_LABELS } from '@/types';

interface RelationshipFormProps {
  characters: Character[];
  onSubmit: (relationship: Omit<Relationship, 'id' | 'created_at'>) => void;
  initialValue?: Relationship;
  onCancel?: () => void;
}

export default function RelationshipForm({
  characters,
  onSubmit,
  initialValue,
  onCancel,
}: RelationshipFormProps) {
  const [sourceId, setSourceId] = useState(initialValue?.sourceId || '');
  const [targetId, setTargetId] = useState(initialValue?.targetId || '');
  const [type, setType] = useState<Relationship['type']>(
    initialValue?.type || 'friend'
  );
  const [strength, setStrength] = useState<Relationship['strength']>(
    initialValue?.strength || 'medium'
  );
  const [description, setDescription] = useState(initialValue?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sourceId || !targetId) {
      alert('두 캐릭터를 모두 선택해주세요');
      return;
    }

    if (sourceId === targetId) {
      alert('같은 캐릭터끼리는 관계를 설정할 수 없습니다');
      return;
    }

    onSubmit({ sourceId, targetId, type, strength, description });
    setSourceId('');
    setTargetId('');
    setType('friend');
    setStrength('medium');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            캐릭터 1
          </label>
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">선택</option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            캐릭터 2
          </label>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">선택</option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          관계 종류
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as Relationship['type'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          관계 강도
        </label>
        <select
          value={strength}
          onChange={(e) => setStrength(e.target.value as Relationship['strength'])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="weak">약함</option>
          <option value="medium">중간</option>
          <option value="strong">강함</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          설명 (선택)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="관계에 대한 설명..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition"
        >
          {initialValue ? '수정' : '추가'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}
