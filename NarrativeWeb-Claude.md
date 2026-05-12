# NarrativeWeb

웹소설 창작자를 위한 인물 관계도 생성기

## 목표

웹소설 작가가 캐릭터와 그들의 관계를 시각적으로 정의하고 관리할 수 있는 인터랙티브 도구 제공

## 사용자

- 웹소설/소설 창작자
- 웹툰/만화 스토리보더
- 게임 스토리 개발자
- 타로/12간지/별자리 콘텐츠 창작자

## 핵심 기능

### 1. 캐릭터 관리
- 캐릭터 추가 (이름, 기본 설정)
- 캐릭터 삭제/수정
- 아바타 업로드 (선택)

### 2. 관계 정의
- A ↔ B 간 관계 설정
- 관계 종류 선택 (친구, 적, 사랑, 가족, 경쟁, 비밀, 기타 등)
- 관계 강도 설정 (약함/중간/강함)
- 타임라인별 관계 변화 추적

### 3. 시각화
- 노드(캐릭터) + 엣지(관계선) 그래프
- 관계 종류별 색상/스타일 구분
- 관계 강도별 선 굵기 표현
- 인터랙티브 웹뷰 (드래그, 줌, 필터)

### 4. 내보내기
- PNG/SVG 다운로드
- JSON 형식 저장/불러오기

## 기술 스택

- **프론트엔드**: Next.js 15 + React + TypeScript
- **그래프 라이브러리**: vis.js (또는 D3.js)
- **스타일**: Tailwind CSS
- **데이터 저장**: 로컬스토리지 (초기), Supabase (추후)

## 데이터 구조

### Character
```
{
  id: string
  name: string
  description: string
  avatar?: string
  color?: string
}
```

### Relationship
```
{
  id: string
  sourceId: string
  targetId: string
  type: 'friend' | 'enemy' | 'love' | 'family' | 'rival' | 'secret' | 'other'
  strength: 'weak' | 'medium' | 'strong'
  description?: string
  timeline?: {
    start?: string
    end?: string
    change?: string
  }
}
```

### Graph
```
{
  characters: Character[]
  relationships: Relationship[]
}
```

## MVP 스코프

1. 캐릭터 추가/삭제
2. 관계 정의 (타입, 강도)
3. 그래프 시각화
4. 인터랙티브 조작 (드래그, 줌)
5. JSON 저장/불러오기
6. PNG 다운로드

## 향후 기능 (Phase 2)

- 타임라인별 관계 변화 시각화
- 캐릭터 세부 정보 에디터
- 실시간 협업
- 템플릿 (장르별 관계도)
- ComfyUI 이미지 연동
