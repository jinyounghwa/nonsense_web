export interface Character {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at?: string;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'friend' | 'enemy' | 'love' | 'family' | 'rival' | 'secret' | 'other';
  strength: 'weak' | 'medium' | 'strong';
  description?: string;
  created_at?: string;
}

export interface GraphData {
  id?: string;
  title?: string;
  description?: string;
  characters: Character[];
  relationships: Relationship[];
}

export interface Node {
  id: string;
  label: string;
  title: string;
  color: {
    background: string;
    border: string;
  };
  font: {
    color: string;
    size: number;
  };
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  color: {
    color: string;
    opacity: number;
  };
  width: number;
  title: string;
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
