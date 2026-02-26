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

export default dataApi;
