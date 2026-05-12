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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-slate-700/50 rounded-lg border border-purple-500/20 backdrop-blur-sm"
    >
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-widest">
            캐릭터 1
          </label>
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition"
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
          <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-widest">
            캐릭터 2
          </label>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition"
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
        <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-widest">
          관계 종류
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as Relationship['type'])}
          className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition"
        >
          {Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-widest">
          강도
        </label>
        <select
          value={strength}
          onChange={(e) => setStrength(e.target.value as Relationship['strength'])}
          className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition"
        >
          <option value="weak">약함</option>
          <option value="medium">중간</option>
          <option value="strong">강함</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-widest">
          설명
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="관계에 대한 설명..."
          rows={2}
          className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400 transition"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 transform hover:scale-105"
        >
          {initialValue ? '✏️ 수정' : '🔗 추가'}
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
