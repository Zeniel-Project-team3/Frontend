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
