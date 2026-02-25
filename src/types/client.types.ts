/**
 * 국민취업지원제도 상담용 Client 데이터 타입 정의
 */

/** 근속 구간 (개월) */
export type RetentionMonth = 1 | 6 | 12 | 18;

/** 기본정보 */
export interface ClientBasicInfo {
  /** 이름 (내담자 식별용) */
  name: string;
  /** 연령 */
  age: number | string;
  /** 성별 */
  gender: string;
  /** 연락처 (즉각적인 소통을 위해 필요) */
  contact: string;
  /** 학교 */
  school: string;
  /** 전공 */
  major: string;
  /** 최종학력 (구직 방향 설정의 기초) */
  finalEducation: string;
  /** 희망직종 (내담자의 목표 직무) */
  desiredJob: string;
  /** 사업유형 (1유형, 2유형 등 제도 구분) */
  businessType: string;
  /** 참여유형 */
  participationType: string;
}

/** 프로세스 정보 (참여 단계: IAP 수립, 직업훈련, 취업알선 등 현재 위치) */
export interface ClientProcess {
  /** 참여 단계 */
  currentStage: string;
  /** 마지막 상담일 (상담 누락 방지를 위한 핵심 지표) */
  lastCounselingDate: string;
  /** 인정통지일 */
  recognitionNoticeDate: string;
  /** 초기상담일 */
  initialCounselingDate: string;
  /** IAP 수립일 */
  iapEstablishmentDate: string;
}

/** 직업훈련: 훈련 과정명, 개강/종료일, 수료 여부 */
export interface ClientVocationalTraining {
  /** 훈련 과정명 */
  trainingName: string;
  /** 개강일 */
  startDate: string;
  /** 종료일 */
  endDate: string;
  /** 수료 여부 */
  trainingCompleted: boolean | string;
}

/** 일경험: 유형, 참여 기업, 수료 여부 */
export interface ClientWorkExperience {
  /** 유형 */
  type: string;
  /** 참여 기업 */
  participatingCompany: string;
  /** 수료 여부 */
  workExpCompleted: boolean | string;
}

/** 취업처/직무/급여: 취업 성공 데이터 */
export interface ClientEmployment {
  /** 취업처 */
  employer: string;
  /** 직무 */
  jobTitle: string;
  /** 급여 */
  salary: string;
  /** 취업일자 */
  employmentDate: string;
  /** 근속 여부: 1/6/12/18개월 근속 기록 (사후관리 수당 지급용) */
  retentionMonths: RetentionMonth | null;
}

/** 통합 Client 인터페이스 */
export interface Client
  extends ClientBasicInfo,
    ClientProcess,
    ClientVocationalTraining,
    ClientWorkExperience,
    ClientEmployment {
  /** 테이블/폼 식별용 키 */
  key: string;
}
