'use client';

import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Character, GraphData, Relationship } from '@/types';

const STORAGE_KEY = 'narrativeweb:graph';

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setGraphData(JSON.parse(saved));
      } else {
        const newId = uuidv4();
        const initialData: GraphData = {
          id: newId,
          title: 'My Characters',
          description: '',
          characters: [],
          relationships: [],
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

  const addCharacter = useCallback(
    (character: Omit<Character, 'id' | 'created_at'>) => {
      const newCharacter: Character = {
        ...character,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      };
      const updated = {
        ...graphData,
        characters: [...graphData.characters, newCharacter],
      };
      setGraphData(updated);
      saveToStorage(updated);
      return newCharacter;
    },
    [graphData, saveToStorage]
  );

  const updateCharacter = useCallback(
    (id: string, updates: Partial<Character>) => {
      const updated = {
        ...graphData,
        characters: graphData.characters.map((char) =>
          char.id === id ? { ...char, ...updates } : char
        ),
      };
      setGraphData(updated);
      saveToStorage(updated);
    },
    [graphData, saveToStorage]
  );

  const deleteCharacter = useCallback(
    (id: string) => {
      const updated = {
        ...graphData,
        characters: graphData.characters.filter((char) => char.id !== id),
        relationships: graphData.relationships.filter(
          (rel) => rel.sourceId !== id && rel.targetId !== id
        ),
      };
      setGraphData(updated);
      saveToStorage(updated);
    },
    [graphData, saveToStorage]
  );

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
      const updated = {
        ...graphData,
        relationships: [...graphData.relationships, newRelationship],
      };
      setGraphData(updated);
      saveToStorage(updated);
      setError(null);
      return newRelationship;
    },
    [graphData, saveToStorage]
  );

  const updateRelationship = useCallback(
    (id: string, updates: Partial<Relationship>) => {
      const updated = {
        ...graphData,
        relationships: graphData.relationships.map((rel) =>
          rel.id === id ? { ...rel, ...updates } : rel
        ),
      };
      setGraphData(updated);
      saveToStorage(updated);
    },
    [graphData, saveToStorage]
  );

  const deleteRelationship = useCallback(
    (id: string) => {
      const updated = {
        ...graphData,
        relationships: graphData.relationships.filter((rel) => rel.id !== id),
      };
      setGraphData(updated);
      saveToStorage(updated);
    },
    [graphData, saveToStorage]
  );

  const exportToJSON = useCallback(() => {
    const data = {
      characters: graphData.characters,
      relationships: graphData.relationships,
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
      const updated = {
        ...graphData,
        characters: data.characters || [],
        relationships: data.relationships || [],
      };
      setGraphData(updated);
      saveToStorage(updated);
    },
    [graphData, saveToStorage]
  );

  const updateGraphInfo = useCallback(
    (title: string, description: string) => {
      const updated = { ...graphData, title, description };
      setGraphData(updated);
      saveToStorage(updated);
    },
    [graphData, saveToStorage]
  );

  return {
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
    error,
    setError,
  };
};
