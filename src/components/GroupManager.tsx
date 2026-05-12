'use client';

import { useState } from 'react';
import { CharacterGroup } from '@/types';
import { Plus, Edit2, Trash2, Check, X, Shield, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const GROUP_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
  '#f59e0b', '#10b981', '#06b6d4', '#f97316',
  '#64748b', '#84cc16',
];

interface GroupManagerProps {
  groups: CharacterGroup[];
  onAdd: (group: Omit<CharacterGroup, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<CharacterGroup>) => void;
  onDelete: (id: string) => void;
}

export default function GroupManager({ groups, onAdd, onUpdate, onDelete }: GroupManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(GROUP_COLORS[0]);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), color });
    setName('');
    setColor(GROUP_COLORS[Math.floor(Math.random() * GROUP_COLORS.length)]);
    setIsAdding(false);
  };

  const handleStartEdit = (group: CharacterGroup) => {
    setEditingId(group.id);
    setName(group.name);
    setColor(group.color);
  };

  const handleSaveEdit = () => {
    if (!editingId || !name.trim()) return;
    onUpdate(editingId, { name: name.trim(), color });
    setEditingId(null);
    setName('');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setName('');
    setColor(GROUP_COLORS[0]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          세력 / 그룹 관리
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {(isAdding || editingId) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-3"
        >
          <input
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="그룹 이름 (예: 주인공 진영)"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                editingId ? handleSaveEdit() : handleAdd();
              }
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <div className="flex items-center gap-2">
            <Palette className="w-3 h-3 text-slate-500" />
            <div className="flex gap-1.5 flex-wrap">
              {GROUP_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-110 ${
                    color === c ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={editingId ? handleSaveEdit : handleAdd}
              className="flex-1 flex items-center justify-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 rounded-lg text-xs transition-all"
            >
              <Check className="w-3 h-3" />
              {editingId ? '수정' : '추가'}
            </button>
            <button
              onClick={handleCancel}
              className="px-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Group List */}
      <div className="space-y-2">
        {groups.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-xs italic">
            세력/그룹을 추가하면 인물 분류가 편리해집니다.
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="group flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: group.color + '30' }}
              >
                <Shield className="w-4 h-4" style={{ color: group.color }} />
              </div>
              <span className="text-sm font-bold text-white flex-1">{group.name}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleStartEdit(group)}
                  className="p-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-md transition-all"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`'${group.name}' 그룹을 삭제하시겠습니까?`)) {
                      onDelete(group.id);
                    }
                  }}
                  className="p-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-md transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
