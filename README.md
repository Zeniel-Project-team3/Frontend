## 개발 서버 실행

```bash
npm run dev
```

실행 후 브라우저에서 http://localhost:5173 접속

## 빌드

프로덕션 빌드를 생성하려면:

```bash
npm run build
```

## 사용된 주요 라이브러리

### 핵심 프레임워크
- **React** (^19.2.0) - 사용자 인터페이스 구축을 위한 라이브러리
- **Vite** (^7.3.1) - 빠른 개발 서버와 빌드 도구

### UI 컴포넌트
- **Ant Design (antd)** (^6.3.0) - 엔터프라이즈급 UI 컴포넌트 라이브러리
- **lucide-react** (^0.575.0) - 아이콘 라이브러리

### 라우팅
- **react-router-dom** (^7.13.1) - 클라이언트 사이드 라우팅

### 데이터 처리
- **axios** (^1.13.5) - HTTP 클라이언트 라이브러리
- **xlsx** (^0.18.5) - Excel 파일 읽기/쓰기
- **recharts** (^3.7.0) - React 차트 라이브러리

### 문서 생성
- **html2canvas** (^1.4.1) - HTML 요소를 Canvas로 변환
- **jspdf** (^2.5.2) - PDF 문서 생성

### 개발 도구
- **ESLint** - 코드 품질 및 스타일 검사
- **@vitejs/plugin-react** - Vite용 React 플러그인