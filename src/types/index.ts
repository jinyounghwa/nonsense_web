export interface Character {
  id: string;
  name: string;
  description?: string;
  color: string;
  group?: string;
  created_at?: string;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'friend' | 'enemy' | 'love' | 'family' | 'rival' | 'secret' | 'other';
  strength: 'weak' | 'medium' | 'strong';
  label?: string;
  description?: string;
  directional?: boolean;
  created_at?: string;
}

export interface CharacterGroup {
  id: string;
  name: string;
  color: string;
}

export interface GraphData {
  id?: string;
  title?: string;
  description?: string;
  characters: Character[];
  relationships: Relationship[];
  positions?: Record<string, { x: number; y: number }>;
  groups?: CharacterGroup[];
}

export interface Node {
  id: string;
  label: string;
  title: string;
  color: {
    background: string;
    border: string;
    highlight?: {
      background: string;
      border: string;
    };
  };
  font: {
    color: string;
    size: number;
    face: string;
  };
  shadow: {
    enabled: boolean;
    color: string;
    size: number;
    x: number;
    y: number;
  };
  x?: number;
  y?: number;
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  label?: string;
  color: {
    color: string;
    opacity: number;
    highlight?: string;
  };
  width: number;
  title: string;
  font?: {
    size: number;
    color: string;
    face: string;
    strokeWidth: number;
    strokeColor: string;
    align: string;
  };
  arrows?: {
    to?: { enabled: boolean; scaleFactor?: number; type?: string };
  };
}

export const RELATIONSHIP_COLORS: Record<Relationship['type'], string> = {
  friend: '#10b981',
  enemy: '#ef4444',
  love: '#ec4899',
  family: '#3b82f6',
  rival: '#f59e0b',
  secret: '#8b5cf6',
  other: '#6b7280',
};

export const RELATIONSHIP_LABELS: Record<Relationship['type'], string> = {
  friend: '친구',
  enemy: '적',
  love: '사랑',
  family: '가족',
  rival: '경쟁',
  secret: '비밀',
  other: '기타',
};

export const STRENGTH_WIDTH: Record<Relationship['strength'], number> = {
  weak: 1,
  medium: 2,
  strong: 3,
};

export const STRENGTH_LABELS: Record<Relationship['strength'], string> = {
  weak: '약함',
  medium: '보통',
  strong: '강함',
};
