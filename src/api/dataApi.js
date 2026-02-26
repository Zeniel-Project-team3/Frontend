import axios from 'axios';

const dataApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * 내담자 목록 조회 (페이지네이션)
 * @param {{ page?: number, size?: number }} [params] page 0-based, size 기본 20
 * @returns {Promise<{ content: import('./dataApi.types').ClientListResponse[], totalElements: number, totalPages: number, number: number, size: number }>}
 */
export async function getAllClients(params = {}) {
  const { data } = await dataApi.get('/api/data', {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 20,
      sort: 'id,desc',
    },
  });
  return data;
}

/**
 * 내담자별 훈련 목록
 * @param {number} clientId
 * @returns {Promise<import('./dataApi.types').TrainingListResponse[]>}
 */
export async function getTrainings(clientId) {
  const { data } = await dataApi.get(`/api/data/training/${clientId}`);
  return data;
}

/**
 * 훈련 등록 (CreateTrainingRequest)
 * @param {number} clientId
 * @param {{ title: string, startDate: string, endDate: string, allowance: string, complete: boolean }} request
 * @returns {Promise<void>}
 */
export async function addTrainings(clientId, request) {
  await dataApi.post(`/api/data/training/${clientId}`, request);
}

/**
 * 내담자별 상담 목록
 * @param {number} clientId
 * @returns {Promise<import('./dataApi.types').ConsultationListResponse[]>}
 */
export async function getConsultations(clientId) {
  const { data } = await dataApi.get(`/api/data/consultation/${clientId}`);
  return data;
}

/**
 * 내담자 등록
 * @param {import('./dataApi.types').ClientRegisterRequest} request
 * @returns {Promise<{ id?: number }>} ClientRegisterResponse
 */
export async function registerClient(request) {
  const { data } = await dataApi.post('/api/client/register', request);
  return data;
}

/**
 * 내담자 수정 (updateClientData)
 * @param {import('./dataApi.types').ClientRequest} request
 * @returns {Promise<Map<string, Object>>}
 */
export async function updateClientData(request) {
  const { data } = await dataApi.put('/api/data/client', request);
  return data;
}

/**
 * 상담 시나리오 조회 (이름 + 휴대폰)
 * @param {string} name
 * @param {string} phone
 * @returns {Promise<import('./dataApi.types').AiResponseDto>}
 */
export async function getConsultationScenario(name, phone) {
  const { data } = await dataApi.get('/api/consultation/ai-scenario-request', {
    params: { name, phone },
  });
  return data;
}

/**
 * 상담 자료 업로드 (파일 1개, clientId 경로)
 * @param {number} clientId
 * @param {File} file
 * @returns {Promise<import('./dataApi.types').ConsultationUploadResponse>}
 */
export async function uploadConsultationFile(clientId, file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await dataApi.post(`/api/consultation/upload/${clientId}`, formData, {
    headers: {
      'Content-Type': undefined,
    },
  });
  return data;
}

export default dataApi;
