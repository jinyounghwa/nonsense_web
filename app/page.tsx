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

type TabType = 'character' | 'relationship' | 'graph';
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
    exportToJSON,
    loadFromJSON,
    updateGraphInfo,
    loading,
  } = useGraph();

  const [activeTab, setActiveTab] = useState<TabType>('graph');
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(
    null
  );
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [graphTitle, setGraphTitle] = useState(graphData.title || '');
  const [graphDescription, setGraphDescription] = useState(graphData.description || '');

  useEffect(() => {
    setGraphTitle(graphData.title || '');
    setGraphDescription(graphData.description || '');
  }, [graphData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">로딩 중...</p>
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

  const handleRelationshipSubmit = (
    relationship: Omit<Relationship, 'id' | 'created_at'>
  ) => {
    if (editingRelationship) {
      updateRelationship(editingRelationship.id, relationship);
      setEditingRelationship(null);
    } else {
      addRelationship(relationship);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">NarrativeWeb</h1>
              <p className="text-gray-600">웹소설 인물 관계도 생성기</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                프로젝트 제목
              </label>
              <input
                type="text"
                value={graphTitle}
                onChange={(e) => setGraphTitle(e.target.value)}
                placeholder="프로젝트 제목"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                value={graphDescription}
                onChange={(e) => setGraphDescription(e.target.value)}
                placeholder="프로젝트 설명"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSaveGraphInfo}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition"
            >
              프로젝트 정보 저장
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('character')}
                  className={`flex-1 py-3 px-4 font-medium text-sm transition ${
                    activeTab === 'character'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  캐릭터
                </button>
                <button
                  onClick={() => setActiveTab('relationship')}
                  className={`flex-1 py-3 px-4 font-medium text-sm transition ${
                    activeTab === 'relationship'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  관계
                </button>
                <button
                  onClick={() => setActiveTab('graph')}
                  className={`flex-1 py-3 px-4 font-medium text-sm transition ${
                    activeTab === 'graph'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  그래프
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
                    />
                  )}
                  {graphData.characters.length < 2 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                      관계를 추가하려면 최소 2개 이상의 캐릭터가 필요합니다
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

              {activeTab === 'graph' && <ExportImport graphData={graphData} onImport={loadFromJSON} />}
            </div>
          </div>

          {/* Graph View */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  인물 관계도
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({graphData.characters.length}명, {graphData.relationships.length}개 관계)
                  </span>
                </h2>
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
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2024 NarrativeWeb. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
