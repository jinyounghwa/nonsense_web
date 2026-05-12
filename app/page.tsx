'use client';

import { useState, useEffect } from 'react';
import CharacterForm from '@/components/CharacterForm';
import RelationshipForm from '@/components/RelationshipForm';
import GraphView from '@/components/GraphView';
import CharacterList from '@/components/CharacterList';
import RelationshipList from '@/components/RelationshipList';
import ExportImport from '@/components/ExportImport';
import { useGraph } from '@/hooks/useGraph';
import { Character, Relationship } from '@/types';

type TabType = 'character' | 'relationship' | 'export';
type EditMode = null | 'character' | 'relationship';

export default function Home() {
  const {
    graphData,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addRelationship,
    updateRelationship,
    deleteRelationship,
    loadFromJSON,
    updateGraphInfo,
    loading,
  } = useGraph();

  const [activeTab, setActiveTab] = useState<TabType>('character');
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [graphTitle, setGraphTitle] = useState(graphData.title || '');
  const [graphDescription, setGraphDescription] = useState(graphData.description || '');

  useEffect(() => {
    setGraphTitle(graphData.title || '');
    setGraphDescription(graphData.description || '');
  }, [graphData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-white">로딩 중...</p>
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
    characters.forEach(char => addCharacter(char));
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
    relationships.forEach(rel => addRelationship(rel));
    setEditMode(null);
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
    setEditMode('character');
    setActiveTab('character');
  };

  const handleEditRelationship = (relationship: Relationship) => {
    setEditingRelationship(relationship);
    setEditMode('relationship');
    setActiveTab('relationship');
  };

  const handleSaveGraphInfo = () => {
    updateGraphInfo(graphTitle, graphDescription);
    alert('프로젝트 정보가 저장되었습니다');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ✨ NarrativeWeb
              </h1>
              <p className="text-purple-300 text-sm mt-1">웹소설 인물 관계도 생성기</p>
            </div>
          </div>
          <div className="space-y-3 bg-slate-700/30 rounded-lg p-4 backdrop-blur-sm border border-purple-500/10">
            <div>
              <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-widest">
                프로젝트 제목
              </label>
              <input
                type="text"
                value={graphTitle}
                onChange={(e) => setGraphTitle(e.target.value)}
                placeholder="프로젝트 제목을 입력하세요"
                className="w-full px-4 py-2 bg-slate-700 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-widest">
                설명
              </label>
              <textarea
                value={graphDescription}
                onChange={(e) => setGraphDescription(e.target.value)}
                placeholder="프로젝트 설명을 입력하세요"
                rows={2}
                className="w-full px-4 py-2 bg-slate-700 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400 transition"
              />
            </div>
            <button
              onClick={handleSaveGraphInfo}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
            >
              💾 저장
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-lg overflow-hidden border border-purple-500/20 shadow-xl">
              <div className="flex gap-1 p-1">
                <button
                  onClick={() => setActiveTab('character')}
                  className={`flex-1 py-3 px-4 font-semibold text-sm transition-all rounded-md ${
                    activeTab === 'character'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  👤 캐릭터
                </button>
                <button
                  onClick={() => setActiveTab('relationship')}
                  className={`flex-1 py-3 px-4 font-semibold text-sm transition-all rounded-md ${
                    activeTab === 'relationship'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  🔗 관계
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  className={`flex-1 py-3 px-4 font-semibold text-sm transition-all rounded-md ${
                    activeTab === 'export'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  ⚙️ 내보내기
                </button>
              </div>
            </div>

            {/* Forms & Lists */}
            <div className="space-y-4">
              {activeTab === 'character' && (
                <>
                  {editMode === 'character' && (
                    <CharacterForm
                      onSubmit={handleCharacterSubmit}
                      initialValue={editingCharacter || undefined}
                      onCancel={() => {
                        setEditMode(null);
                        setEditingCharacter(null);
                      }}
                    />
                  )}
                  {editMode !== 'character' && (
                    <CharacterForm
                      onSubmit={handleCharacterSubmit}
                      onMultiSubmit={handleMultiCharacterSubmit}
                    />
                  )}
                  <CharacterList
                    characters={graphData.characters}
                    onDelete={deleteCharacter}
                    onEdit={handleEditCharacter}
                    selectedId={selectedCharacterId || undefined}
                  />
                </>
              )}

              {activeTab === 'relationship' && (
                <>
                  {editMode === 'relationship' && (
                    <RelationshipForm
                      characters={graphData.characters}
                      onSubmit={handleRelationshipSubmit}
                      initialValue={editingRelationship || undefined}
                      onCancel={() => {
                        setEditMode(null);
                        setEditingRelationship(null);
                      }}
                    />
                  )}
                  {editMode !== 'relationship' && (
                    <RelationshipForm
                      characters={graphData.characters}
                      onSubmit={handleRelationshipSubmit}
                      onMultiSubmit={handleMultiRelationshipSubmit}
                    />
                  )}
                  {graphData.characters.length < 2 && (
                    <div className="p-3 bg-amber-500/20 border border-amber-500/50 rounded-lg text-sm text-amber-300">
                      ⚠️ 관계를 추가하려면 최소 2명 이상의 캐릭터가 필요합니다
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

              {activeTab === 'export' && <ExportImport graphData={graphData} onImport={loadFromJSON} />}
            </div>
          </div>

          {/* Graph View */}
          <div className="lg:col-span-3 h-screen sticky top-24">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden border border-purple-500/20">
              <div className="p-4 border-b border-purple-500/20">
                <h2 className="text-2xl font-bold text-white">
                  🎭 인물 관계도
                  <span className="ml-3 text-sm font-normal text-purple-300">
                    {graphData.characters.length}명 · {graphData.relationships.length}개 관계
                  </span>
                </h2>
              </div>
              <div className="bg-slate-900/50">
                <GraphView
                  characters={graphData.characters}
                  relationships={graphData.relationships}
                  onSelectNode={setSelectedCharacterId}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/30 border-t border-purple-500/20 mt-12 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-slate-400">
          <p>Made with ❤️ for storytellers · NarrativeWeb © 2024</p>
        </div>
      </footer>
    </div>
  );
}
