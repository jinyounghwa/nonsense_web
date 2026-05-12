# NarrativeWeb

웹소설 창작자를 위한 인물 관계도 생성기

## 개요

NarrativeWeb은 웹소설, 웹툰, 게임 스토리 등을 창작할 때 캐릭터와 그들의 관계를 시각적으로 정의하고 관리할 수 있는 인터랙티브 도구입니다.

## 주요 기능

### 1. 캐릭터 관리
- 캐릭터 추가, 수정, 삭제
- 캐릭터별 색상 선택
- 상세 설명 추가 가능

### 2. 관계 정의
- 캐릭터 간 관계 설정 (친구, 적, 사랑, 가족, 경쟁, 비밀, 기타)
- 관계 강도 설정 (약함, 중간, 강함)
- 관계별 상세 설명

### 3. 시각화
- 인터랙티브 그래프 뷰
- 드래그, 줌, 패닝 가능
- 관계 종류별 색상 구분
- 관계 강도별 선 굵기 표현

### 4. 저장 및 내보내기
- JSON 형식으로 저장/불러오기
- 프로젝트 정보 관리

## 기술 스택

- **프로젝트**: Next.js 15, React, TypeScript
- **그래프**: vis-network
- **스타일**: Tailwind CSS
- **상태 관리**: React Hooks + localStorage

## 설치 및 실행

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

http://localhost:3000 에서 접속 가능합니다.

### 빌드
```bash
npm run build
npm run start
```

## 사용 방법

### 1. 캐릭터 추가
1. 좌측 "캐릭터" 탭으로 이동
2. 캐릭터 이름, 설명, 색상 입력
3. "추가" 버튼 클릭

### 2. 관계 추가
1. 좌측 "관계" 탭으로 이동
2. 두 캐릭터 선택
3. 관계 종류와 강도 설정
4. "추가" 버튼 클릭

### 3. 그래프 조작
- **드래그**: 마우스로 노드를 드래그하여 위치 조정
- **줌**: 마우스 휠로 확대/축소
- **패닝**: 우클릭 또는 스페이스 + 드래그

### 4. 저장 및 불러오기
1. 좌측 "그래프" 탭으로 이동
2. "JSON 다운로드"로 프로젝트 저장
3. "JSON 불러오기"로 이전 프로젝트 복구

## 데이터 저장

- 브라우저의 localStorage에 자동 저장
- 페이지 새로고침 후에도 데이터 유지
- JSON 파일로 수동 백업 가능

## 프로젝트 구조

```
src/
├── components/        # React 컴포넌트
│   ├── CharacterForm.tsx
│   ├── RelationshipForm.tsx
│   ├── GraphView.tsx
│   ├── CharacterList.tsx
│   ├── RelationshipList.tsx
│   └── ExportImport.tsx
├── hooks/            # 커스텀 훅
│   └── useGraph.ts
└── types/            # TypeScript 타입 정의
    └── index.ts
app/
├── page.tsx          # 메인 페이지
├── layout.tsx        # 레이아웃
└── globals.css       # 글로벌 스타일
```

## 향후 기능

- 타임라인별 관계 변화 시각화
- 캐릭터 세부 정보 에디터
- 실시간 협업
- 템플릿 (장르별 관계도)
- Supabase 연동 (클라우드 저장)
- PNG/SVG 내보내기

---

Made with ❤️ for storytellers
