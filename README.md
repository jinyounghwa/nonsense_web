# NarrativeWeb 🌌

웹소설 창작자를 위한 인물 관계도 시각화 대시보드

![Project Overview](https://img.shields.io/badge/Design-Premium%20Dark-blueviolet)
![Tech](https://img.shields.io/badge/Tech-Next.js%2015%20%7C%20Tailwind%20v4-blue)

## ✨ 개요

NarrativeWeb은 웹소설, 웹툰, 시나리오 작가들이 복잡한 인물 관계를 한눈에 파악하고 직관적으로 관리할 수 있도록 설계된 **프리미엄 창작 도구**입니다. 현대적인 대시보드 인터페이스와 인터랙티브 그래프를 통해 이야기의 설계를 돕습니다.

## 🚀 주요 기능

### 1. 캐릭터 마스터링
- **직관적인 관리**: 이름, 역할, 커스텀 컬러를 통한 캐릭터 정의.
- **일괄 등록**: 여러 캐릭터를 한 번에 추가할 수 있는 벌크 모드 지원.
- **유리 질감 UI**: 캐릭터별 리스트에 적용된 현대적인 Glassmorphism 디자인.

### 2. 다차원 관계 정의
- **관계 매핑**: 친구, 연인, 숙적 등 7가지 이상의 관계 유형 지원.
- **유대 강도**: 선의 굵기를 통해 감정의 깊이와 관계의 비중 시각화.
- **상세 아카이빙**: 각 관계에 대한 상세 서사 기록 가능.

### 3. 인터랙티브 그래프 뷰
- **실시간 엔진**: `vis-network` 기반의 물리 시뮬레이션 적용.
- **커스텀 스타일**: 다크 테마에 최적화된 노드와 부드러운 베지에 곡선.
- **조작 편의성**: 스마트 줌, 드래그 앤 드롭, 노드 포커싱 기능.

### 4. 데이터 워크스페이스
- **로컬 스토리지**: 브라우저에 자동 저장되어 새로고침 후에도 유지.
- **파일 백업**: JSON 형식의 프로젝트 내보내기 및 불러오기.
- **샘플 데이터**: 빠른 적응을 위한 판타지 샘플 데이터 제공.

## 🎨 디자인 시스템

- **Premium Aesthetics**: 깊이 있는 다크 모드와 Vibrant한 포인트 컬러의 조화.
- **Typography**: 가독성을 위한 `Inter`와 심미성을 위한 `Outfit` 폰트 적용.
- **Iconography**: `Lucide-react` 기반의 일관성 있고 세련된 아이콘 시스템.
- **Motion**: `Framer Motion`을 활용한 부드러운 UI 전환 및 반응 효과.

## 🛠 기술 스택

- **Core**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, PostCSS
- **Animation**: Framer Motion
- **Visualization**: Vis-network
- **Icons**: Lucide-React

## 💻 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 프리미엄 창작 환경을 경험하세요.

## 📁 프로젝트 구조

```text
src/
├── components/        # UI 컴포넌트 (CharacterForm, RelationshipList 등)
├── hooks/            # 핵심 비즈니스 로직 (useGraph)
└── types/            # 인터페이스 및 타입 정의
app/
├── page.tsx          # 메인 대시보드 레이아웃
├── layout.tsx        # 폰트 및 메타데이터 설정
└── globals.css       # Tailwind v4 디자인 시스템 정의
```

---

Made with ❤️ for storytellers. *Create your universe.*
