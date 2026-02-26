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
