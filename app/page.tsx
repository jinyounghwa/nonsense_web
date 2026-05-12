'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Share2,
  Download,
  Settings,
  ChevronLeft,
  Plus,
  Save,
  Sparkles,
  Info,
  Menu,
  BarChart3,
  Undo2,
  Redo2,
  Shield,
  X,
} from 'lucide-react';
import CharacterForm from '@/components/CharacterForm';
import RelationshipForm from '@/components/RelationshipForm';
import GraphView from '@/components/GraphView';
import CharacterList from '@/components/CharacterList';
import RelationshipList from '@/components/RelationshipList';
import ExportImport from '@/components/ExportImport';
import StatsPanel from '@/components/StatsPanel';
import GroupManager from '@/components/GroupManager';
import { useGraph } from '@/hooks/useGraph';
import { Character, Relationship } from '@/types';

type TabType = 'character' | 'relationship' | 'stats' | 'export' | 'settings';
type EditMode = null | 'character' | 'relationship';

export default function Home() {
  const {
    graphData,
    addCharacter,
    addMultipleCharacters,
    updateCharacter,
    deleteCharacter,
    addRelationship,
    addMultipleRelationships,
    updateRelationship,
    deleteRelationship,
    savePositions,
    clearPositions,
    addGroup,
    updateGroup,
    deleteGroup,
    loadFromJSON,
    updateGraphInfo,
    undo,
    redo,
    canUndo,
    canRedo,
    loading,
  } = useGraph();

  const [activeTab, setActiveTab] = useState<TabType>('character');
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);
  const [graphTitle, setGraphTitle] = useState(graphData.title || '');
  const [graphDescription, setGraphDescription] = useState(graphData.description || '');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  useEffect(() => {
    setGraphTitle(graphData.title || '');
    setGraphDescription(graphData.description || '');
  }, [graphData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1115]">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-purple-500/20 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-8 text-slate-400 font-medium tracking-widest uppercase text-xs text-center animate-pulse">
            Initializing Narrative
          </p>
        </div>
      </div>
    );
  }

  const handleCharacterSubmit = (character: Omit<Character, 'id' | 'created_at'>) => {
    if (editingCharacter) {
      updateCharacter(editingCharacter.id, character);
      setEditingCharacter(null);
    } else {
      addCharacter(character);
    }
    setEditMode(null);
  };

  const handleMultiCharacterSubmit = (characters: Omit<Character, 'id' | 'created_at'>[]) => {
    addMultipleCharacters(characters);
    setEditMode(null);
  };

  const handleRelationshipSubmit = (relationship: Omit<Relationship, 'id' | 'created_at'>) => {
    if (editingRelationship) {
      updateRelationship(editingRelationship.id, relationship);
      setEditingRelationship(null);
    } else {
      addRelationship(relationship);
    }
    setEditMode(null);
  };

  const handleMultiRelationshipSubmit = (relationships: Omit<Relationship, 'id' | 'created_at'>[]) => {
    addMultipleRelationships(relationships);
    setEditMode(null);
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
    setEditMode('character');
    setActiveTab('character');
    if (!showSidebar) setShowSidebar(true);
  };

  const handleEditRelationship = (relationship: Relationship) => {
    setEditingRelationship(relationship);
    setEditMode('relationship');
    setActiveTab('relationship');
    if (!showSidebar) setShowSidebar(true);
  };

  const handleSaveGraphInfo = () => {
    updateGraphInfo(graphTitle, graphDescription);
  };

  const handleSelectNode = (characterId: string) => {
    if (characterId) {
      setSelectedCharacterId(characterId);
      setShowDetailPanel(true);
      setSelectedRelationshipId(null);
    } else {
      setSelectedCharacterId(null);
      setShowDetailPanel(false);
    }
  };

  const handleSelectEdge = (relationshipId: string) => {
    if (relationshipId) {
      setSelectedRelationshipId(relationshipId);
      setSelectedCharacterId(null);
      setShowDetailPanel(false);
    }
  };

  // Get selected character details
  const selectedCharacter = selectedCharacterId
    ? graphData.characters.find((c) => c.id === selectedCharacterId)
    : null;

  const selectedCharacterRelationships = selectedCharacterId
    ? graphData.relationships.filter(
        (r) => r.sourceId === selectedCharacterId || r.targetId === selectedCharacterId
      )
    : [];

  const selectedRelationship = selectedRelationshipId
    ? graphData.relationships.find((r) => r.id === selectedRelationshipId)
    : null;

  const tabs = [
    { id: 'character' as const, icon: Users, label: '인물' },
    { id: 'relationship' as const, icon: Share2, label: '관계' },
    { id: 'stats' as const, icon: BarChart3, label: '통계' },
    { id: 'export' as const, icon: Download, label: '추출' },
    { id: 'settings' as const, icon: Settings, label: '설정' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1115] text-slate-200">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: showSidebar ? 400 : 0, opacity: showSidebar ? 1 : 0 }}
        className="relative flex flex-col border-r border-white/5 glass-card z-30"
      >
        <div className="flex flex-col h-full w-[400px]">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-white tracking-tight">NarrativeWeb</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Story Design Suite</p>
              </div>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  canUndo
                    ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    : 'bg-white/[0.02] text-slate-700 cursor-not-allowed'
                }`}
                title="실행 취소 (Ctrl+Z)"
              >
                <Undo2 className="w-3 h-3" />
                취소
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  canRedo
                    ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    : 'bg-white/[0.02] text-slate-700 cursor-not-allowed'
                }`}
                title="다시 실행 (Ctrl+Shift+Z)"
              >
                <Redo2 className="w-3 h-3" />
                재실행
              </button>
            </div>

            <nav className="flex p-1 bg-white/5 rounded-xl border border-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setEditMode(null);
                    setEditingCharacter(null);
                    setEditingRelationship(null);
                  }}
                  className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-bold uppercase">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'character' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-display font-bold text-white">캐릭터 관리</h2>
                      <button
                        onClick={() => {
                          setEditMode('character');
                          setEditingCharacter(null);
                        }}
                        className="p-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-lg transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {editMode === 'character' && (
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                        <CharacterForm
                          onSubmit={handleCharacterSubmit}
                          onMultiSubmit={handleMultiCharacterSubmit}
                          groups={graphData.groups}
                          initialValue={editingCharacter || undefined}
                          onCancel={() => {
                            setEditMode(null);
                            setEditingCharacter(null);
                          }}
                        />
                      </div>
                    )}

                    {!editMode && (
                      <CharacterList
                        characters={graphData.characters}
                        onDelete={deleteCharacter}
                        onEdit={handleEditCharacter}
                        selectedId={selectedCharacterId || undefined}
                      />
                    )}
                  </div>
                )}

                {activeTab === 'relationship' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-display font-bold text-white">관계 설정</h2>
                      <button
                        onClick={() => {
                          setEditMode('relationship');
                          setEditingRelationship(null);
                        }}
                        className="p-2 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white rounded-lg transition-all"
                        disabled={graphData.characters.length < 2}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {editMode === 'relationship' && (
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                        <RelationshipForm
                          characters={graphData.characters}
                          onSubmit={handleRelationshipSubmit}
                          onMultiSubmit={handleMultiRelationshipSubmit}
                          initialValue={editingRelationship || undefined}
                          onCancel={() => {
                            setEditMode(null);
                            setEditingRelationship(null);
                          }}
                        />
                      </div>
                    )}

                    {!editMode && (
                      <>
                        {graphData.characters.length < 2 && (
                          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 items-start">
                            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-200/80 leading-relaxed font-medium">
                              관계를 추가하려면 최소 2명 이상의 캐릭터가 필요합니다.
                            </p>
                          </div>
                        )}
                        <RelationshipList
                          relationships={graphData.relationships}
                          characters={graphData.characters}
                          onDelete={deleteRelationship}
                          onEdit={handleEditRelationship}
                        />
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'stats' && <StatsPanel graphData={graphData} />}

                {activeTab === 'export' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-display font-bold text-white">데이터 내보내기/가져오기</h2>
                    <ExportImport graphData={graphData} onImport={loadFromJSON} />
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <h2 className="text-lg font-display font-bold text-white">프로젝트 설정</h2>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">프로젝트 제목</label>
                          <input
                            type="text"
                            value={graphTitle}
                            onChange={(e) => setGraphTitle(e.target.value)}
                            onBlur={handleSaveGraphInfo}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">프로젝트 설명</label>
                          <textarea
                            value={graphDescription}
                            onChange={(e) => setGraphDescription(e.target.value)}
                            onBlur={handleSaveGraphInfo}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                          />
                        </div>
                        <button
                          onClick={handleSaveGraphInfo}
                          className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                        >
                          <Save className="w-4 h-4" />
                          <span>변경사항 저장</span>
                        </button>
                      </div>
                    </div>

                    {/* Group Management */}
                    <div className="space-y-4">
                      <GroupManager
                        groups={graphData.groups || []}
                        onAdd={addGroup}
                        onUpdate={updateGroup}
                        onDelete={deleteGroup}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span>v0.3.0</span>
            <div className="flex gap-4">
              <span className="text-indigo-400">{graphData.characters.length} CHARS</span>
              <span className="text-purple-400">{graphData.relationships.length} RELS</span>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="relative flex-1 flex flex-col min-w-0">
        {/* Top Header Overlay */}
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-3 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-2xl"
            >
              {showSidebar ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="px-5 py-3 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
              <h2 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                {graphTitle || '무제 프로젝트'}
              </h2>
            </div>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            <div className="flex -space-x-2">
              {graphData.characters.slice(0, 5).map((char, i) => (
                <div
                  key={char.id}
                  className="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-lg overflow-hidden"
                  style={{ backgroundColor: char.color, zIndex: 10 - i }}
                >
                  {char.name.charAt(0)}
                </div>
              ))}
              {graphData.characters.length > 5 && (
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-400 shadow-lg z-0">
                  +{graphData.characters.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Graph Area */}
        <div className="absolute inset-0 bg-[#0f1115] bg-[radial-gradient(circle_at_50%_50%,#1a1d24_0%,#0f1115_100%)]">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <GraphView
            characters={graphData.characters}
            relationships={graphData.relationships}
            positions={graphData.positions}
            onSelectNode={handleSelectNode}
            onSelectEdge={handleSelectEdge}
            onSavePositions={savePositions}
            onClearPositions={clearPositions}
          />
        </div>

        {/* Character Detail Panel */}
        <AnimatePresence>
          {showDetailPanel && selectedCharacter && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-24 right-6 w-80 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      style={{ backgroundColor: selectedCharacter.color }}
                    >
                      {selectedCharacter.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-display font-bold text-white">{selectedCharacter.name}</h3>
                      {selectedCharacter.group && (
                        <span className="px-2 py-0.5 bg-white/10 rounded text-[9px] text-slate-400 font-bold">
                          {selectedCharacter.group}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailPanel(false);
                      setSelectedCharacterId(null);
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {selectedCharacter.description && (
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 border-l-2 border-indigo-500/30 pl-3">
                    {selectedCharacter.description}
                  </p>
                )}

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    관계 ({selectedCharacterRelationships.length})
                  </p>
                  {selectedCharacterRelationships.length === 0 ? (
                    <p className="text-xs text-slate-600 italic">관계가 없습니다.</p>
                  ) : (
                    selectedCharacterRelationships.map((rel) => {
                      const otherId = rel.sourceId === selectedCharacterId ? rel.targetId : rel.sourceId;
                      const other = graphData.characters.find((c) => c.id === otherId);
                      const isIncoming = rel.targetId === selectedCharacterId;

                      return (
                        <div
                          key={rel.id}
                          className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                        >
                          {other && (
                            <div
                              className="w-6 h-6 rounded flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                              style={{ backgroundColor: other.color }}
                            >
                              {other.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{other?.name || '?'}</p>
                            <p className="text-[9px] text-slate-500">{rel.label || rel.type}</p>
                          </div>
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: ['#10b981', '#ef4444', '#ec4899', '#3b82f6', '#f59e0b', '#8b5cf6', '#6b7280'][['friend', 'enemy', 'love', 'family', 'rival', 'secret', 'other'].indexOf(rel.type)] }}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-white/5 flex gap-2">
                <button
                  onClick={() => handleEditCharacter(selectedCharacter)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all"
                >
                  수정
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bottom Help */}
        <div className="absolute bottom-6 right-6 pointer-events-none">
          <div className="px-4 py-2 bg-slate-900/60 backdrop-blur-sm border border-white/5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Wheel</kbd> Zoom
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Drag</kbd> Move
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded">⌘Z</kbd> Undo
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
