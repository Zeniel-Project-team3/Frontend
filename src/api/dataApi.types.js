/**
 * 백엔드 DataController API 응답 타입 (내담자 통합관리)
 */

/** 훈련수당 지급 상태 */
export const Allowance = Object.freeze({
  PAID: 'PAID',   // 지급완료
  UNPAID: 'UNPAID', // 미지급
  NONE: 'NONE',   // 없음
});

/**
 * @typedef {Object} ClientListResponse
 * @property {number} id
 * @property {string} name
 * @property {string} [residentId]
 * @property {string} [birthDate] YYYY-MM-DD
 * @property {string} [phone]
 * @property {number} [age]
 * @property {string} [gender] MALE | FEMALE
 * @property {string} [businessType]
 * @property {string} [joinType]
 * @property {string} [joinStage]
 * @property {string} [competency]
 * @property {string} [desiredJob]
 * @property {string} [address]
 * @property {string} [university]
 * @property {string} [major]
 * @property {string} [companyName]
 * @property {string} [jobTitle]
 * @property {number} [salary]
 * @property {string} [employDate] YYYY-MM-DD
 * @property {string} [resignDate] YYYY-MM-DD
 */

/**
 * @typedef {Object} TrainingListResponse
 * @property {number} trainingId
 * @property {string} courseName
 * @property {string} [startDate] YYYY-MM-DD
 * @property {string} [endDate] YYYY-MM-DD
 * @property {string} [allowance] PAID | UNPAID | NONE
 * @property {boolean} [completed]
 */

/**
 * @typedef {Object} ConsultationListResponse
 * @property {number} consultationId
 * @property {string} [consultDate] YYYY-MM-DD
 * @property {string} [detail]
 * @property {string} [summary]
 * @property {string} [iapDate] YYYY-MM-DD
 * @property {number} [iapPeriod]
 */

/**
 * Spring Page 응답
 * @typedef {Object} PageResponse
 * @property {Object[]} content
 * @property {number} totalElements
 * @property {number} totalPages
 * @property {number} number
 * @property {number} size
 * @property {boolean} first
 * @property {boolean} last
 */

/** 최종학력 (백엔드 Education enum 이름과 맞춰 사용, 필요 시 값 수정) */
export const Education = Object.freeze({
  MIDDLE_SCHOOL_OR_LESS: 'MIDDLE_SCHOOL_OR_LESS',   // 중졸 이하
  HIGH_SCHOOL: 'HIGH_SCHOOL',                       // 고등학교 졸업
  COLLEGE_2_3: 'COLLEGE_2_3',                       // 2·3년제 대학 졸업
  BACHELOR: 'BACHELOR',                             // 4년제 대학 졸업
  GRADUATE_OR_ABOVE: 'GRADUATE_OR_ABOVE',           // 대학원 이상
});

/**
 * 내담자 등록 요청 (ClientRegisterRequest)
 * @typedef {Object} ClientRegisterRequest
 * @property {string} name
 * @property {string} [residentId]
 * @property {number} [age]
 * @property {string} [gender] MALE | FEMALE
 * @property {string} [competency]
 * @property {string} [desiredJob]
 * @property {string} [address]
 * @property {string} [university]
 * @property {string} [major]
 * @property {string} [education] Education enum
 */

/**
 * 내담자 수정 요청 (ClientRequest) - PUT /api/data/client
 * @typedef {Object} ClientRequest
 * @property {number} id 필수
 * @property {string} [address]
 * @property {string} [education] Education enum
 * @property {string} [university]
 * @property {string} [major]
 * @property {string} [businessType]
 * @property {string} [joinType]
 * @property {string} [joinStage]
 * @property {string} [competency]
 * @property {string} [desiredJob]
 */

/**
 * 상담 시나리오 AI 응답 (AiResponseDto) - GET /api/consultation/ai-scenario-request
 * @typedef {Object} AiResponseDto
 * @property {number} [clientId] 내담자 ID (화면 출력 없음, 참고용)
 * @property {string} [consultationGoal] 금회차 핵심 목표
 * @property {string} [mandatoryNotice] 필수 이행 및 고지 사항
 * @property {string} [suggestedServices] 제안할 서비스
 * @property {string} [keyQuestions] 이번 상담 핵심 질문
 * @property {string} [smilarOccupations] 유사 스펙 직업 (백엔드 필드명 유지)
 * @property {string} [avaerageSalary] 급여 수준 (백엔드 필드명 유지)
 */

/**
 * 상담 자료 업로드 응답 (ConsultationUploadResponse)
 * @typedef {Object} ConsultationUploadResponse
 */
