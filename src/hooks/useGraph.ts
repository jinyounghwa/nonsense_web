'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Character, CharacterGroup, GraphData, Relationship } from '@/types';

const STORAGE_KEY = 'narrativeweb:graph';
const MAX_HISTORY = 50;

const DEFAULT_DATA: GraphData = {
  id: uuidv4(),
  title: '새로운 프로젝트',
  description: '웹소설의 주요 등장인물들의 관계를 그려보세요.',
  characters: [
    { id: uuidv4(), name: '주인공', description: '이야기의 중심', color: '#3b82f6', created_at: new Date().toISOString() },
    { id: uuidv4(), name: '조력자', description: '주인공을 돕는 역할', color: '#10b981', created_at: new Date().toISOString() },
    { id: uuidv4(), name: '적대자', description: '주인공의 장애물', color: '#ef4444', created_at: new Date().toISOString() },
    { id: uuidv4(), name: '사랑하는 사람', description: '감정적 연결', color: '#ec4899', created_at: new Date().toISOString() },
  ],
  relationships: [],
  groups: [
    { id: uuidv4(), name: '주인공 진영', color: '#3b82f6' },
    { id: uuidv4(), name: '적대 진영', color: '#ef4444' },
    { id: uuidv4(), name: '중립', color: '#6b7280' },
  ],
};

const createDefaultRelationships = (characters: typeof DEFAULT_DATA.characters) => [
  {
    id: uuidv4(),
    sourceId: characters[0].id,
    targetId: characters[1].id,
    type: 'friend' as const,
    strength: 'strong' as const,
    label: '믿을 수 있는 파트너',
    description: '오랜 시간 함께해온 전우',
    directional: false,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    sourceId: characters[0].id,
    targetId: characters[2].id,
    type: 'enemy' as const,
    strength: 'strong' as const,
    label: '숙명의 적',
    description: '숙명의 적',
    directional: true,
    created_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    sourceId: characters[0].id,
    targetId: characters[3].id,
    type: 'love' as const,
    strength: 'medium' as const,
    label: '애틋한 감정',
    description: '애틋한 감정',
    directional: false,
    created_at: new Date().toISOString(),
  },
];

export const useGraph = () => {
  const [graphData, setGraphData] = useState<GraphData>({
    id: '',
    title: 'My Characters',
    description: '',
    characters: [],
    relationships: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Undo/Redo history
  const pastRef = useRef<GraphData[]>([]);
  const futureRef = useRef<GraphData[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration: ensure new fields exist
        if (!parsed.groups) parsed.groups = [];
        if (!parsed.positions) parsed.positions = {};
        parsed.characters?.forEach((c: Character) => {
          if (c.group === undefined) c.group = '';
        });
        parsed.relationships?.forEach((r: Relationship) => {
          if (r.label === undefined) r.label = '';
          if (r.directional === undefined) r.directional = true;
        });
        setGraphData(parsed);
      } else {
        const initialData: GraphData = {
          ...DEFAULT_DATA,
          relationships: createDefaultRelationships(DEFAULT_DATA.characters),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        setGraphData(initialData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = useCallback((data: GraphData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
    }
  }, []);

  const pushHistory = useCallback((current: GraphData) => {
    pastRef.current = [...pastRef.current.slice(-(MAX_HISTORY - 1)), current];
    futureRef.current = [];
  }, []);

  const updateState = useCallback(
    (updater: (prev: GraphData) => GraphData) => {
      setGraphData((prev) => {
        const updated = updater(prev);
        pushHistory(prev);
        saveToStorage(updated);
        return updated;
      });
    },
    [pushHistory, saveToStorage]
  );

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    setGraphData((current) => {
      futureRef.current = [...futureRef.current, current];
      const prev = pastRef.current[pastRef.current.length - 1];
      pastRef.current = pastRef.current.slice(0, -1);
      saveToStorage(prev);
      return prev;
    });
  }, [saveToStorage]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    setGraphData((current) => {
      pastRef.current = [...pastRef.current, current];
      const next = futureRef.current[futureRef.current.length - 1];
      futureRef.current = futureRef.current.slice(0, -1);
      saveToStorage(next);
      return next;
    });
  }, [saveToStorage]);

  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  // Character operations
  const addCharacter = useCallback(
    (character: Omit<Character, 'id' | 'created_at'>) => {
      const newCharacter: Character = {
        ...character,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      };
      updateState((prev) => ({
        ...prev,
        characters: [...prev.characters, newCharacter],
      }));
      return newCharacter;
    },
    [updateState]
  );

  const addMultipleCharacters = useCallback(
    (characters: Omit<Character, 'id' | 'created_at'>[]) => {
      const newChars: Character[] = characters.map((c) => ({
        ...c,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      }));
      updateState((prev) => ({
        ...prev,
        characters: [...prev.characters, ...newChars],
      }));
      return newChars;
    },
    [updateState]
  );

  const updateCharacter = useCallback(
    (id: string, updates: Partial<Character>) => {
      updateState((prev) => ({
        ...prev,
        characters: prev.characters.map((char) =>
          char.id === id ? { ...char, ...updates } : char
        ),
      }));
    },
    [updateState]
  );

  const deleteCharacter = useCallback(
    (id: string) => {
      updateState((prev) => ({
        ...prev,
        characters: prev.characters.filter((char) => char.id !== id),
        relationships: prev.relationships.filter(
          (rel) => rel.sourceId !== id && rel.targetId !== id
        ),
        positions: prev.positions
          ? Object.fromEntries(Object.entries(prev.positions).filter(([key]) => key !== id))
          : {},
      }));
    },
    [updateState]
  );

  // Relationship operations
  const addRelationship = useCallback(
    (relationship: Omit<Relationship, 'id' | 'created_at'>) => {
      if (relationship.sourceId === relationship.targetId) {
        setError('Cannot create relationship with the same character');
        return null;
      }
      const newRelationship: Relationship = {
        ...relationship,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      };
      updateState((prev) => ({
        ...prev,
        relationships: [...prev.relationships, newRelationship],
      }));
      setError(null);
      return newRelationship;
    },
    [updateState]
  );

  const addMultipleRelationships = useCallback(
    (relationships: Omit<Relationship, 'id' | 'created_at'>[]) => {
      const valid = relationships.filter((r) => r.sourceId !== r.targetId);
      if (valid.length === 0) return [];
      const newRels: Relationship[] = valid.map((r) => ({
        ...r,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      }));
      updateState((prev) => ({
        ...prev,
        relationships: [...prev.relationships, ...newRels],
      }));
      return newRels;
    },
    [updateState]
  );

  const updateRelationship = useCallback(
    (id: string, updates: Partial<Relationship>) => {
      updateState((prev) => ({
        ...prev,
        relationships: prev.relationships.map((rel) =>
          rel.id === id ? { ...rel, ...updates } : rel
        ),
      }));
    },
    [updateState]
  );

  const deleteRelationship = useCallback(
    (id: string) => {
      updateState((prev) => ({
        ...prev,
        relationships: prev.relationships.filter((rel) => rel.id !== id),
      }));
    },
    [updateState]
  );

  // Position operations
  const savePositions = useCallback(
    (positions: Record<string, { x: number; y: number }>) => {
      updateState((prev) => ({
        ...prev,
        positions: { ...prev.positions, ...positions },
      }));
    },
    [updateState]
  );

  const clearPositions = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      positions: {},
    }));
  }, [updateState]);

  // Group operations
  const addGroup = useCallback(
    (group: Omit<CharacterGroup, 'id'>) => {
      const newGroup: CharacterGroup = { ...group, id: uuidv4() };
      updateState((prev) => ({
        ...prev,
        groups: [...(prev.groups || []), newGroup],
      }));
      return newGroup;
    },
    [updateState]
  );

  const updateGroup = useCallback(
    (id: string, updates: Partial<CharacterGroup>) => {
      updateState((prev) => ({
        ...prev,
        groups: (prev.groups || []).map((g) =>
          g.id === id ? { ...g, ...updates } : g
        ),
      }));
    },
    [updateState]
  );

  const deleteGroup = useCallback(
    (id: string) => {
      updateState((prev) => ({
        ...prev,
        groups: (prev.groups || []).filter((g) => g.id !== id),
        characters: prev.characters.map((c) =>
          c.group === id ? { ...c, group: '' } : c
        ),
      }));
    },
    [updateState]
  );

  // Export/Import
  const exportToJSON = useCallback(() => {
    const data = {
      title: graphData.title,
      description: graphData.description,
      characters: graphData.characters,
      relationships: graphData.relationships,
      groups: graphData.groups,
      positions: graphData.positions,
    };
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `narrativeweb-${graphData.title}-${timestamp}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [graphData]);

  const loadFromJSON = useCallback(
    (data: GraphData) => {
      updateState((prev) => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        characters: data.characters || [],
        relationships: data.relationships || [],
        groups: data.groups || prev.groups || [],
        positions: data.positions || {},
      }));
    },
    [updateState]
  );

  const updateGraphInfo = useCallback(
    (title: string, description: string) => {
      updateState((prev) => ({ ...prev, title, description }));
    },
    [updateState]
  );

  return {
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
    exportToJSON,
    loadFromJSON,
    updateGraphInfo,
    undo,
    redo,
    canUndo,
    canRedo,
    loading,
    error,
    setError,
  };
};
