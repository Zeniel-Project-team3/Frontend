export const defaultWorkTrackerData = [
  {
    key: '1',
    taskName: '수급자격 인정 협의',
    status: '완료',
    assignee: '김철수',
    deadline: '2024-01-15',
    priority: '높음',
    stage: '1단계',
    note: '자격 요건 확인 완료',
  },
  {
    key: '2',
    taskName: 'IAP 수립 상담',
    status: '진행중',
    assignee: '이영희',
    deadline: '2024-01-22',
    priority: '높음',
    stage: '2단계',
    note: '취업/상담 목표 설정',
  },
  {
    key: '3',
    taskName: '직업훈련 매칭',
    status: '시작전',
    assignee: '박민수',
    deadline: '2024-02-05',
    priority: '높음',
    stage: '3단계',
    note: '훈련 과정 연계 예정',
  },
  {
    key: '4',
    taskName: '집중 취업 알선',
    status: '시작전',
    assignee: '정수진',
    deadline: '2024-02-20',
    priority: '보통',
    stage: '4단계',
    note: '훈련 수료 후 진행',
  },
];

export const defaultSimilarCasesData = [
  {
    key: '1',
    jobTitle: '백엔드 개발자',
    finalEducation: '4년제 대학 졸업',
    keyQualification: '정보처리기사, SW 개발 실무·부트캠프',
    avgSalary: '3,800만원',
    successPath: '유사 전공·스펙, 3.5개월 훈련 이수 후 백엔드 취업 사례 다수',
  },
  {
    key: '2',
    jobTitle: '프론트엔드 개발자',
    finalEducation: '2·3년제 대학 졸업',
    keyQualification: '웹 개발 기초·부트캠프, 포트폴리오',
    avgSalary: '3,600만원',
    successPath: '유사 스펙, 4개월 웹·SI 훈련 이수 후 프론트엔드 취업 다수',
  },
  {
    key: '3',
    jobTitle: '풀스택 개발자',
    finalEducation: '4년제 대학 졸업',
    keyQualification: '정보처리기사, 풀스택 양성 과정',
    avgSalary: '4,200만원',
    successPath: '전공·자격 유사, 풀스택 양성 이수 후 중소 SW 기업 취업 다수',
  },
  {
    key: '4',
    jobTitle: '데이터 분석·관리',
    finalEducation: '4년제 대학 졸업',
    keyQualification: '정보처리기사, 데이터 분석·SQL 훈련',
    avgSalary: '4,000만원',
    successPath: '정보처리기사 보유, 데이터 훈련 이수 후 취업 알선 연계 다수',
  },
  {
    key: '5',
    jobTitle: 'IT 운영·DevOps',
    finalEducation: '전문대·4년제 졸업',
    keyQualification: '리눅스·AWS, DevOps·클라우드 훈련',
    avgSalary: '4,500만원',
    successPath: '인프라·운영 경험자, DevOps·클라우드 훈련 이수 후 취업 다수',
  },
  {
    key: '6',
    jobTitle: 'QA·테스트 엔지니어',
    finalEducation: '2·3년제 대학 졸업',
    keyQualification: 'ISTQB, SW 테스트·자동화 훈련',
    avgSalary: '3,400만원',
    successPath: '비전공자, QA 양성 과정 이수 후 SI·외주 테스트 취업 다수',
  },
  {
    key: '7',
    jobTitle: '클라우드 엔지니어',
    finalEducation: '4년제 대학 졸업',
    keyQualification: 'AWS·Azure 자격, 클라우드 인프라 훈련',
    avgSalary: '4,800만원',
    successPath: 'IT 관련 전공·자격 보유, 클라우드 훈련 이수 후 취업 다수',
  },
  {
    key: '8',
    jobTitle: '웹 퍼블리셔',
    finalEducation: '고등학교 졸업',
    keyQualification: '웹 디자인·HTML/CSS 훈련, 포트폴리오',
    avgSalary: '3,200만원',
    successPath: '비전공자, 웹 퍼블리싱 과정 이수 후 웹에이전시·SI 취업 다수',
  },
  {
    key: '9',
    jobTitle: '데이터 엔지니어',
    finalEducation: '4년제 대학 졸업',
    keyQualification: '정보처리기사, 빅데이터·파이프라인 훈련',
    avgSalary: '4,600만원',
    successPath: '데이터·전산 전공 유사, 데이터 엔지니어링 훈련 이수 후 취업 다수',
  },
  {
    key: '10',
    jobTitle: '모바일 앱 개발자',
    finalEducation: '4년제 대학 졸업',
    keyQualification: 'Android·iOS 개발 훈련, 앱 포트폴리오',
    avgSalary: '4,000만원',
    successPath: '유사 전공·스펙, 모바일 앱 개발 훈련 이수 후 스타트업·중소 취업 다수',
  },
];

export const defaultGuidelines = [];

export const defaultSuccessRateData = [
  { name: '신입', successRate: 45, avgRate: 60 },
  { name: '주니어', successRate: 68, avgRate: 70 },
  { name: '시니어', successRate: 82, avgRate: 75 },
  { name: '리드', successRate: 75, avgRate: 65 },
];

export const defaultJobMatchData = [
  { name: '프론트엔드', score: 85 },
  { name: '백엔드', score: 78 },
  { name: '풀스택', score: 72 },
  { name: '데브옵스', score: 65 },
  { name: '데이터', score: 58 },
];

export const defaultSkillDistributionData = [
  { name: '기술력', value: 35, color: '#1890ff' },
  { name: '경험', value: 28, color: '#52c41a' },
  { name: '커뮤니케이션', value: 20, color: '#fa8c16' },
  { name: '문제해결', value: 17, color: '#f5222d' },
];

