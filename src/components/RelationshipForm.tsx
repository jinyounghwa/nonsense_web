'use client';

import { useState } from 'react';
import { Character, Relationship, RELATIONSHIP_LABELS } from '@/types';
import { Share2, Plus, X, Check, Info, ArrowRightLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [label, setLabel] = useState(initialValue?.label || '');
  const [description, setDescription] = useState(initialValue?.description || '');
  const [directional, setDirectional] = useState(initialValue?.directional !== undefined ? initialValue.directional : true);
  const [bulkInput, setBulkInput] = useState('');

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) return;

    onSubmit({
      sourceId,
      targetId,
      type,
      strength,
      label: label.trim() || undefined,
      description: description.trim() || undefined,
      directional,
    });
    if (!initialValue) {
      setSourceId('');
      setTargetId('');
      setType('friend');
      setStrength('medium');
      setLabel('');
      setDescription('');
      setDirectional(true);
    }
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;

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
            label: parts[4] || undefined,
            description: parts[5] || undefined,
            directional: parts[6] !== 'false',
          });
        }
      }
    });

    if (relationships.length === 0) return;

    if (onMultiSubmit) {
      onMultiSubmit(relationships);
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
            <Share2 className="w-3 h-3" />
            단일 설정
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
            <Plus className="w-3 h-3" />
            일괄 등록
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
              {/* Character Selection */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1 text-center block">인물 1</label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none text-center cursor-pointer hover:bg-white/10"
                  >
                    <option value="" className="bg-slate-900">선택</option>
                    {characters.map((char) => (
                      <option key={char.id} value={char.id} className="bg-slate-900">
                        {char.name}{char.group ? ` (${char.group})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mt-6">
                  {directional ? (
                    <ArrowRight className="w-4 h-4 text-slate-700" />
                  ) : (
                    <ArrowRightLeft className="w-4 h-4 text-slate-700" />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1 text-center block">인물 2</label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none text-center cursor-pointer hover:bg-white/10"
                  >
                    <option value="" className="bg-slate-900">선택</option>
                    {characters.map((char) => (
                      <option key={char.id} value={char.id} className="bg-slate-900">
                        {char.name}{char.group ? ` (${char.group})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type & Strength */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">관계 종류</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Relationship['type'])}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer hover:bg-white/10"
                  >
                    {Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => (
                      <option key={key} value={key} className="bg-slate-900">
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">유대 강도</label>
                  <select
                    value={strength}
                    onChange={(e) => setStrength(e.target.value as Relationship['strength'])}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer hover:bg-white/10"
                  >
                    <option value="weak" className="bg-slate-900">약함</option>
                    <option value="medium" className="bg-slate-900">보통</option>
                    <option value="strong" className="bg-slate-900">강함</option>
                  </select>
                </div>
              </div>

              {/* Edge Label - NEW */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                  <Share2 className="w-3 h-3" />
                  관계선 라벨
                  <span className="text-slate-700 normal-case font-normal">(선 위에 표시될 텍스트)</span>
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder={`예: ${RELATIONSHIP_LABELS[type]}`}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
                <p className="text-[9px] text-slate-600 ml-1">
                  비워두면 관계 종류({RELATIONSHIP_LABELS[type]})가 자동으로 표시됩니다.
                </p>
              </div>

              {/* Direction Toggle - NEW */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1 block">방향성</label>
                  <p className="text-[9px] text-slate-600 ml-1 mt-0.5">
                    {directional ? '단방향: A → B 화살표 표시' : '양방향: A ↔ B 화살표 없음'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDirectional(!directional)}
                  className={`relative w-11 h-6 rounded-full transition-all ${
                    directional ? 'bg-indigo-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      directional ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">관계 상세 설명</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="예: 어릴 적부터 함께 자란 소꿉친구"
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                />
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
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">일괄 관계 입력</label>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={'인물1 | 인물2 | 종류 | 강도 | 라벨 | 설명 | 방향\n루인 | 엘레나 | friend | strong | 소꿉친구 | 어릴 적 친구 | false'}
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
                />
              </div>
              <div className="flex gap-2 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-indigo-300/70 leading-relaxed font-medium">
                  종류: friend, enemy, love, family, rival, secret, other<br/>
                  강도: weak, medium, strong<br/>
                  방향: true(단방향), false(양방향)
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
            <span>{initialValue ? '수정 완료' : mode === 'single' ? '관계 추가' : '일괄 등록'}</span>
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
