'use client';

import { useState } from 'react';
import { Character, Relationship, RELATIONSHIP_LABELS } from '@/types';

interface RelationshipFormProps {
  characters: Character[];
  onSubmit: (relationship: Omit<Relationship, 'id' | 'created_at'>) => void;
  onMultiSubmit?: (relationships: Omit<Relationship, 'id' | 'created_at'>[]) => void;
  initialValue?: Relationship;
  onCancel?: () => void;
}

export default function RelationshipForm({
  characters,
  onSubmit,
  onMultiSubmit,
  initialValue,
  onCancel,
}: RelationshipFormProps) {
  const [mode, setMode] = useState<'single' | 'multi'>('single');
  const [sourceId, setSourceId] = useState(initialValue?.sourceId || '');
  const [targetId, setTargetId] = useState(initialValue?.targetId || '');
  const [type, setType] = useState<Relationship['type']>(
    initialValue?.type || 'friend'
  );
  const [strength, setStrength] = useState<Relationship['strength']>(
    initialValue?.strength || 'medium'
  );
  const [description, setDescription] = useState(initialValue?.description || '');
  const [bulkInput, setBulkInput] = useState('');

  const handleSingleSubmit = (e: React.FormEvent) => {
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

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInput.trim()) {
      alert('관계 정보를 입력해주세요');
      return;
    }

    const lines = bulkInput.trim().split('\n');
    const relationships: Omit<Relationship, 'id' | 'created_at'>[] = [];

    lines.forEach((line) => {
      const parts = line.split('|').map(p => p.trim());
      if (parts[0] && parts[1]) {
        const source = characters.find(c => c.name === parts[0]);
        const target = characters.find(c => c.name === parts[1]);

        if (source && target && source.id !== target.id) {
          relationships.push({
            sourceId: source.id,
            targetId: target.id,
            type: (parts[2] || 'friend') as Relationship['type'],
            strength: (parts[3] || 'medium') as Relationship['strength'],
            description: parts[4] || '',
          });
        }
      }
    });

    if (relationships.length === 0) {
      alert('유효한 관계 정보가 없습니다. 캐릭터 이름이 정확한지 확인하세요.');
      return;
    }

    if (onMultiSubmit) {
      onMultiSubmit(relationships);
    }
    setBulkInput('');
  };

  return (
    <form
      onSubmit={mode === 'single' ? handleSingleSubmit : handleBulkSubmit}
      className="space-y-4 p-4 bg-slate-700/50 rounded-lg border border-purple-500/20 backdrop-blur-sm"
    >
      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('single')}
          className={`flex-1 py-2 px-3 rounded-md font-semibold text-sm transition-all ${
            mode === 'single'
              ? 'bg-green-600 text-white'
              : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
          }`}
        >
          1개 추가
        </button>
        <button
          type="button"
          onClick={() => setMode('multi')}
          className={`flex-1 py-2 px-3 rounded-md font-semibold text-sm transition-all ${
            mode === 'multi'
              ? 'bg-green-600 text-white'
              : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
          }`}
        >
          여러개 추가
        </button>
      </div>

      {mode === 'single' ? (
        <>
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
        </>
      ) : (
        <div>
          <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-widest">
            관계 정보 (캐릭터1 | 캐릭터2 | 종류 | 강도 | 설명)
          </label>
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="예시:&#10;주인공 | 조력자 | friend | strong | 오래된 친구&#10;주인공 | 적대자 | enemy | strong | 운명의 적&#10;조력자 | 적대자 | rival | medium | 경쟁 관계"
            rows={6}
            className="w-full px-3 py-2 bg-slate-600 border border-purple-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400 transition font-mono text-sm"
          />
          <p className="text-xs text-slate-400 mt-2">
            💡 한 줄에 하나씩, 파이프(|)로 구분하세요. 강도와 설명은 생략 가능합니다.
          </p>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 transform hover:scale-105"
        >
          {initialValue ? '✏️ 수정' : mode === 'single' ? '🔗 추가' : '🔗 모두 추가'}
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
