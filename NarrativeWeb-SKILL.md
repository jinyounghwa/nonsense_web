# NarrativeWeb SKILL

웹소설 창작자를 위한 인물 관계도 생성기 - 기술 상세 스펙

---

## 프로젝트 구조

```
narrativeweb/
├── frontend/              # Next.js 15 프론트엔드
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── api/       # Next.js API Routes (선택)
│   │   ├── components/
│   │   │   ├── CharacterForm.tsx
│   │   │   ├── RelationshipForm.tsx
│   │   │   ├── GraphView.tsx
│   │   │   └── ExportImport.tsx
│   │   ├── hooks/
│   │   │   ├── useGraph.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.js
│
└── backend/               # Node.js API (필요시)
    ├── src/
    │   ├── db/
    │   │   ├── connection.ts
    │   │   └── migrations/
    │   ├── routes/
    │   │   ├── characters.ts
    │   │   └── relationships.ts
    │   ├── models/
    │   │   ├── Character.ts
    │   │   └── Relationship.ts
    │   └── index.ts
    ├── package.json
    └── .env.local
```

---

## 기술 스택

### 프론트엔드

| 항목 | 선택 | 버전 |
|------|------|------|
| **프레임워크** | Next.js | 15.x |
| **언어** | TypeScript | 최신 |
| **그래프 라이브러리** | vis-network | ^9.1.0 |
| **스타일** | Tailwind CSS | ^3.4.0 |
| **폼 관리** | React Hook Form | ^7.x |
| **HTTP 클라이언트** | fetch (내장) 또는 axios | axios ^1.6.0 |
| **상태 관리** | React Context / Zustand | Zustand ^4.x (선택) |
| **번들러** | Turbopack (Next.js 기본) | - |

### 백엔드

| 항목 | 선택 | 버전 |
|------|------|------|
| **프레임워크** | Express 또는 NestJS | Express ^4.18.0 |
| **ORM** | Prisma | ^5.x |
| **데이터베이스** | PostgreSQL | 14+ |
| **환경 변수** | dotenv | ^16.x |
| **CORS** | cors | ^2.8.5 |

---

## 데이터베이스 스키마 (PostgreSQL)

### 테이블 1: Characters

```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  graph_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3b82f6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (graph_id) REFERENCES graphs(id) ON DELETE CASCADE
);

CREATE INDEX idx_characters_graph_id ON characters(graph_id);
```

### 테이블 2: Relationships

```sql
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  graph_id UUID NOT NULL,
  source_id UUID NOT NULL,
  target_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL 
    CHECK (type IN ('friend', 'enemy', 'love', 'family', 'rival', 'secret', 'other')),
  strength VARCHAR(50) DEFAULT 'medium'
    CHECK (strength IN ('weak', 'medium', 'strong')),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (graph_id) REFERENCES graphs(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (target_id) REFERENCES characters(id) ON DELETE CASCADE
);

CREATE INDEX idx_relationships_graph_id ON relationships(graph_id);
CREATE INDEX idx_relationships_source ON relationships(source_id);
CREATE INDEX idx_relationships_target ON relationships(target_id);
```

### 테이블 3: Graphs

```sql
CREATE TABLE graphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 타임라인 추가 (Phase 2)

```sql
CREATE TABLE relationship_timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id UUID NOT NULL,
  start_date DATE,
  end_date DATE,
  change_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE
);
```

---

## API 스펙

### BASE_URL: `http://localhost:5000/api`

#### 1. 캐릭터 관리

**POST /graphs/:graphId/characters**
```json
{
  "name": "string",
  "description": "string (optional)",
  "color": "string (hex color)"
}

Response: { id, name, description, color, created_at }
```

**GET /graphs/:graphId/characters**
```
Response: [ { id, name, description, color, created_at }, ... ]
```

**PUT /characters/:characterId**
```json
{
  "name": "string",
  "description": "string",
  "color": "string"
}

Response: { id, name, description, color, updated_at }
```

**DELETE /characters/:characterId**
```
Response: { success: true }
```

#### 2. 관계 관리

**POST /graphs/:graphId/relationships**
```json
{
  "sourceId": "uuid",
  "targetId": "uuid",
  "type": "friend|enemy|love|family|rival|secret|other",
  "strength": "weak|medium|strong",
  "description": "string (optional)"
}

Response: { id, sourceId, targetId, type, strength, description, created_at }
```

**GET /graphs/:graphId/relationships**
```
Response: [ { id, sourceId, targetId, type, strength, description, created_at }, ... ]
```

**PUT /relationships/:relationshipId**
```json
{
  "type": "string",
  "strength": "string",
  "description": "string"
}

Response: { id, sourceId, targetId, type, strength, description, updated_at }
```

**DELETE /relationships/:relationshipId**
```
Response: { success: true }
```

#### 3. 그래프 관리

**POST /graphs**
```json
{
  "title": "string",
  "description": "string (optional)"
}

Response: { id, title, description, created_at }
```

**GET /graphs/:graphId**
```
Response: {
  id,
  title,
  description,
  characters: [ ... ],
  relationships: [ ... ]
}
```

**GET /graphs/:graphId/export**
```
Response: {
  characters: [ ... ],
  relationships: [ ... ]
}
(JSON 형식, 다운로드 가능)
```

**POST /graphs/:graphId/import**
```json
{
  "characters": [ ... ],
  "relationships": [ ... ]
}

Response: { success: true, graph: { ... } }
```

---

## React 타입 정의

```typescript
// src/types/index.ts

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
```

---

## 컴포넌트 구조

### 1. CharacterForm.tsx

**역할**: 캐릭터 추가/수정 폼

**Props**:
```typescript
{
  onSubmit: (character: Character) => void;
  initialValue?: Character;
}
```

**기능**:
- 이름, 설명 입력
- 색상 선택 (color picker)
- 폼 검증 (이름 필수)
- 제출/취소 버튼

### 2. RelationshipForm.tsx

**역할**: 관계 추가/수정 폼

**Props**:
```typescript
{
  characters: Character[];
  onSubmit: (relationship: Relationship) => void;
  initialValue?: Relationship;
}
```

**기능**:
- 인물 1, 인물 2 선택 (select)
- 관계 종류 선택 (7가지)
- 강도 선택 (weak/medium/strong)
- 설명 입력 (선택)
- 유효성: 같은 인물끼리는 불가

### 3. GraphView.tsx

**역할**: vis-network 기반 그래프 렌더링

**Props**:
```typescript
{
  characters: Character[];
  relationships: Relationship[];
  onSelectNode?: (characterId: string) => void;
  onSelectEdge?: (relationshipId: string) => void;
}
```

**기능**:
- 노드 렌더링 (캐릭터)
- 엣지 렌더링 (관계, 색상+굵기 구분)
- 드래그, 줌, 패닝
- 물리 시뮬레이션 (자동 배치)
- 더블클릭 노드 선택

### 4. ExportImport.tsx

**역할**: JSON 다운로드/업로드

**Props**:
```typescript
{
  graphData: GraphData;
  onImport: (data: GraphData) => void;
}
```

**기능**:
- JSON 다운로드 (timestamp 파일명)
- JSON 업로드 (파일 선택, 파싱)
- 에러 처리

### 5. CharacterList.tsx

**역할**: 캐릭터 목록 표시 및 관리

**Props**:
```typescript
{
  characters: Character[];
  onDelete: (id: string) => void;
  onEdit: (character: Character) => void;
  selectedId?: string;
}
```

**기능**:
- 캐릭터 리스트 (색상 도트 + 이름)
- 삭제 버튼
- 선택 상태 하이라이트

### 6. RelationshipList.tsx

**역할**: 관계 목록 표시 및 관리

**Props**:
```typescript
{
  relationships: Relationship[];
  characters: Character[];
  onDelete: (id: string) => void;
  onEdit: (relationship: Relationship) => void;
}
```

**기능**:
- 관계 리스트 (A ↔ B 형태)
- 관계 타입 배지 (색상)
- 삭제 버튼

---

## 상태 관리 패턴

### useGraph Hook

```typescript
const {
  graphData,
  addCharacter,
  updateCharacter,
  deleteCharacter,
  addRelationship,
  updateRelationship,
  deleteRelationship,
  loadFromJSON,
  exportToJSON,
  loading,
  error
} = useGraph();
```

**저장소**:
- 로컬 스토리지 (초기, MVP)
- PostgreSQL + API (Phase 2)

### 로컬 스토리지 키

```
narrativeweb:graphs:list          // 그래프 목록 (UUID[])
narrativeweb:graph:{graphId}      // 그래프 데이터 (GraphData JSON)
```

---

## Tailwind CSS 커스텀 설정

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'relationship-friend': '#10b981',
        'relationship-enemy': '#ef4444',
        'relationship-love': '#ec4899',
        'relationship-family': '#3b82f6',
        'relationship-rival': '#f59e0b',
        'relationship-secret': '#8b5cf6',
      },
    },
  },
  plugins: [],
};
```

---

## vis-network 설정

### 네트워크 옵션

```typescript
const options = {
  physics: {
    enabled: true,
    stabilization: {
      iterations: 200,
      fit: true,
    },
    barnesHut: {
      gravitationalConstant: -15000,
      centralGravity: 0.3,
      springLength: 150,
      springConstant: 0.04,
    },
  },
  interaction: {
    navigationButtons: true,
    keyboard: true,
    zoomView: true,
    dragView: true,
  },
  nodes: {
    shape: 'circle',
    scaling: {
      min: 30,
      max: 60,
      label: {
        enabled: true,
        min: 14,
        max: 30,
      },
    },
    font: {
      size: 14,
      face: 'Georgia, serif',
      color: '#ffffff',
      bold: {
        size: 16,
      },
    },
  },
  edges: {
    smooth: {
      type: 'continuous',
    },
    arrows: {
      to: { enabled: false },
    },
  },
};
```

### 노드 데이터 변환

```typescript
const nodes = characters.map(char => ({
  id: char.id,
  label: char.name,
  title: char.description || '',
  color: {
    background: char.color,
    border: '#ffffff',
    highlight: {
      background: '#ffffff',
      border: char.color,
    },
  },
}));
```

### 엣지 데이터 변환

```typescript
const RELATIONSHIP_COLORS = {
  friend: '#10b981',
  enemy: '#ef4444',
  love: '#ec4899',
  family: '#3b82f6',
  rival: '#f59e0b',
  secret: '#8b5cf6',
  other: '#6b7280',
};

const STRENGTH_WIDTH = {
  weak: 1,
  medium: 2,
  strong: 3,
};

const edges = relationships.map(rel => ({
  id: rel.id,
  from: rel.sourceId,
  to: rel.targetId,
  color: {
    color: RELATIONSHIP_COLORS[rel.type],
    opacity: 0.7,
  },
  width: STRENGTH_WIDTH[rel.strength],
  title: `${rel.type} (${rel.strength})`,
}));
```

---

## 개발 시작 체크리스트

### 초기 설정

- [ ] Next.js 15 프로젝트 생성
  ```bash
  npx create-next-app@latest narrativeweb --typescript --tailwind
  ```
- [ ] 패키지 설치
  ```bash
  npm install vis-network react-hook-form axios
  ```
- [ ] PostgreSQL 로컬 설정 (psql 또는 Docker)
  ```bash
  docker run --name narrativeweb-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
  ```

### 프론트엔드 (Phase 1)

- [ ] 타입 정의 (`src/types/index.ts`)
- [ ] useGraph Hook 구현 (로컬스토리지)
- [ ] CharacterForm 컴포넌트
- [ ] RelationshipForm 컴포넌트
- [ ] GraphView 컴포넌트 (vis-network)
- [ ] CharacterList, RelationshipList 컴포넌트
- [ ] ExportImport 컴포넌트
- [ ] 메인 페이지 (app/page.tsx) 통합
- [ ] 스타일링 (Tailwind)

### 백엔드 (Phase 2)

- [ ] Express 앱 초기화
- [ ] PostgreSQL 연결 (Prisma 또는 pg)
- [ ] 데이터베이스 마이그레이션
- [ ] Characters API 구현
- [ ] Relationships API 구현
- [ ] Graphs API 구현
- [ ] CORS 설정
- [ ] 에러 처리 미들웨어

### 통합 (Phase 3)

- [ ] API 클라이언트 (axios interceptor)
- [ ] useGraph Hook을 API 연동으로 변경
- [ ] 로컬스토리지 → 서버 저장소 마이그레이션
- [ ] 인증 (JWT 토큰, 선택)

---

## 개발 팁

### 로컬 테스트 데이터

```typescript
const mockGraphData: GraphData = {
  characters: [
    { id: '1', name: 'Alice', color: '#3b82f6', description: 'Protagonist' },
    { id: '2', name: 'Bob', color: '#8b5cf6', description: 'Mentor' },
    { id: '3', name: 'Carol', color: '#ec4899', description: 'Antagonist' },
  ],
  relationships: [
    { id: '1', sourceId: '1', targetId: '2', type: 'family', strength: 'strong' },
    { id: '2', sourceId: '1', targetId: '3', type: 'enemy', strength: 'medium' },
    { id: '3', sourceId: '2', targetId: '3', type: 'rival', strength: 'weak' },
  ],
};
```

### vis-network 디버깅

```typescript
// 네트워크 인스턴스 콘솔 접근
window.network = networkInstance;
network.fit(); // 모든 노드 맞추기
network.physics.startSimulation(); // 물리 재시작
```

### 성능 최적화

- 500개 이상 관계 시: 물리 시뮬레이션 비활성화
- 대량 업데이트: React 배치 처리 (자동)
- 메모리: 주기적 로컬스토리지 정리

---

## 배포 (선택)

### Vercel (Next.js 프론트)

```bash
vercel deploy
```

### Railway, Heroku, DigitalOcean (Backend)

- PostgreSQL 클라우드 인스턴스 사용
- 환경 변수 설정 (.env)
- 데이터베이스 마이그레이션 자동화

---

## 참고 자료

- vis-network 문서: https://visjs.github.io/vis-network/docs/network/
- Next.js 15: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- PostgreSQL: https://www.postgresql.org/docs/
- TypeScript: https://www.typescriptlang.org/docs/
