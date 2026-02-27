import { useState, useMemo } from 'react';
import { Card, Descriptions, Input, Button, Space, Spin, message, Table, Typography } from 'antd';
import { Search, User, Users, Lightbulb, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { getConsultationScenario } from '../api/dataApi';
import ExportScenarioButton from '../components/ExportScenarioButton';
import FileUploadSection from '../components/FileUploadSection';

const { Text } = Typography;

function genderLabel(g) {
  if (g === 'MALE') return '남';
  if (g === 'FEMALE') return '여';
  return g ?? '-';
}

/** 숫자 세 자리마다 콤마 삽입 (문자열 내 숫자도 포맷) */
function formatNumberWithCommas(str) {
  if (str == null || typeof str !== 'string') return str ?? '';
  return str.replace(/\d+/g, (num) => Number(num).toLocaleString());
}

/** 백엔드 Education enum → 한글 라벨 (상담자료 준비 내담자 정보용) */
function educationLabel(edu) {
  if (edu === 'MIDDLE_SCHOOL') return '중졸';
  if (edu === 'HIGH_SCHOOL') return '고졸';
  if (edu === 'COLLEGE') return '초대졸';
  if (edu === 'UNIVERSITY') return '대졸';
  return edu ?? '-';
}

function ListBlock({ items, emptyText = '-' }) {
  if (!items?.length) return <Text type="secondary">{emptyText}</Text>;
  return (
    <ul style={{ margin: 0, paddingLeft: 18 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 4 }}>{item}</li>
      ))}
    </ul>
  );
}

const notionBlock = {
  marginBottom: 12,
  padding: '14px 16px',
  background: '#fff',
  borderRadius: 8,
  border: '1px solid rgba(55, 53, 47, 0.09)',
};
const notionLabel = {
  fontSize: 15,
  fontWeight: 700,
  color: 'rgb(55, 53, 47)',
  marginBottom: 8,
  listStyle: 'none',
};
const notionCallout = {
  padding: '16px 20px',
  borderRadius: 6,
  background: '#fff',
  marginTop: 4,
};

const CHART_COLORS = ['#597ef7', '#73d13d', '#faad14', '#f5222d', '#9254de', '#13c2c2'];

/** 유사 사례 통계 영역: 전체 유사 사례 기준 차트 */
function SimilarCasesStatsContent({ allCases }) {
  const stats = useMemo(() => {
    const cases = Array.isArray(allCases) ? allCases : [];
    const salaries = cases.map((c, i) => ({ name: `사례 ${i + 1}`, salary: c.salary ?? 0, clientId: c.clientId }));
    const ageCounts = {};
    const genderCounts = { MALE: 0, FEMALE: 0 };
    const educationCounts = {};
    const competencyCounts = {};
    cases.forEach((c) => {
      if (c.age != null) ageCounts[c.age] = (ageCounts[c.age] || 0) + 1;
      if (c.gender === 'MALE' || c.gender === 'FEMALE') genderCounts[c.gender]++;
      if (c.education) educationCounts[c.education] = (educationCounts[c.education] || 0) + 1;
      if (c.competency) competencyCounts[c.competency] = (competencyCounts[c.competency] || 0) + 1;
    });
    const ageData = Object.entries(ageCounts)
      .map(([age, count]) => ({ age: `${age}세`, count, sortKey: Number(age) }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ age, count }) => ({ age, count }));
    const genderData = [
      { name: '남', value: genderCounts.MALE, color: CHART_COLORS[0] },
      { name: '여', value: genderCounts.FEMALE, color: CHART_COLORS[1] },
    ].filter((d) => d.value > 0);
    const educationData = Object.entries(educationCounts).map(([edu, count]) => ({ name: educationLabel(edu), count }));
    const competencyData = Object.entries(competencyCounts).map(([comp, count]) => ({ name: comp, count }));
    const salarySummary = cases.length
      ? {
          min: Math.min(...cases.map((c) => c.salary).filter((s) => s != null)),
          max: Math.max(...cases.map((c) => c.salary).filter((s) => s != null)),
          avg: Math.round(cases.reduce((a, c) => a + (c.salary ?? 0), 0) / cases.length),
        }
      : null;
    return { salaries, ageData, genderData, educationData, competencyData, salarySummary };
  }, [allCases]);

  return (
    <div style={{ padding: '16px 24px', background: '#fafafa', borderRadius: 8, marginTop: 12 }}>
      {stats.salarySummary && (
          <div style={{ marginBottom: 16, padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #eee' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>급여 요약 (전체 유사 사례)</Text>
            <div style={{ marginTop: 4 }}>
              최소 {formatNumberWithCommas(String(stats.salarySummary.min))}원 · 평균 {formatNumberWithCommas(String(stats.salarySummary.avg))}원 · 최대 {formatNumberWithCommas(String(stats.salarySummary.max))}원
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {stats.salaries.length > 0 && (
            <div style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #eee', minHeight: 220 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>사례별 급여</Text>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={stats.salaries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
                  <Tooltip formatter={(v) => [formatNumberWithCommas(String(v)) + '원', '급여']} />
                  <Bar dataKey="salary" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {stats.genderData.length > 0 && (
            <div style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #eee', minHeight: 220 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>성별 분포</Text>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={stats.genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, value }) => `${name} ${value}명`}>
                    {stats.genderData.map((_, i) => (
                      <Cell key={i} fill={stats.genderData[i].color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          {stats.ageData.length > 0 && (
            <div style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #eee', minHeight: 220 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>연령 분포</Text>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={stats.ageData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="age" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} name="명" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {stats.educationData.length > 0 && (
            <div style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #eee', minHeight: 220 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>학력 분포</Text>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={stats.educationData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} name="명" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {stats.competencyData.length > 0 && (
            <div style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #eee', minHeight: 220 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>역량 분포</Text>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={stats.competencyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={CHART_COLORS[4]} radius={[4, 4, 0, 0]} name="명" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
    </div>
  );
}

function CounselingPrepPage({
  searchName,
  setSearchName,
  searchPhone,
  setSearchPhone,
  uploadedFiles,
  setUploadedFiles,
  onScenarioLoaded,
}) {
  const [scenarioData, setScenarioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSimilarStats, setShowSimilarStats] = useState(false);

  const handleSearch = async () => {
    const name = (searchName ?? '').trim();
    const phone = (searchPhone ?? '').trim();
    if (!name || !phone) {
      message.warning('이름과 휴대폰 번호를 입력하세요.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await getConsultationScenario(name, phone);
      setScenarioData(data ?? null);
      onScenarioLoaded?.();
    } catch (err) {
      setScenarioData(null);
      const resData = err?.response?.data;
      let msg;

      if (typeof resData === 'string') {
        msg = resData;
      } else if (resData && typeof resData.message === 'string') {
        msg = resData.message;
      } else {
        msg = err?.message ?? '조회에 실패했습니다.';
      }

      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const masked = scenarioData?.maskedInput;
  const clientId = scenarioData?.clientId ?? scenarioData?.maskedInput?.clientId ?? null;
  const similarCases = scenarioData?.similarCases ?? [];
  const rec = scenarioData?.recommendation;

  const similarColumns = [
    { title: '유사도', dataIndex: 'score', key: 'score', width: 80, render: (v) => (v != null ? `${Math.round(Number(v) * 100)}%` : '-') },
    { title: '연령', dataIndex: 'age', key: 'age', width: 70, render: (v) => v ?? '-' },
    { title: '성별', dataIndex: 'gender', key: 'gender', width: 70, render: genderLabel },
    { title: '희망직종', dataIndex: 'desiredJob', key: 'desiredJob', ellipsis: true, render: (v) => v ?? '-' },
    { title: '역량', dataIndex: 'competency', key: 'competency', width: 70, render: (v) => v ?? '-' },
    { title: '취업 직무', dataIndex: 'jobTitle', key: 'jobTitle', ellipsis: true, render: (v) => v ?? '-' },
    { title: '취업처', dataIndex: 'companyName', key: 'companyName', ellipsis: true, render: (v) => v ?? '-' },
    { title: '급여', dataIndex: 'salary', key: 'salary', width: 90, render: (v) => (v != null ? formatNumberWithCommas(String(v)) : '-') },
    { title: '훈련', dataIndex: 'trainings', key: 'trainings', ellipsis: true, render: (arr) => Array.isArray(arr) ? arr.join(', ') : '-' },
    { title: '상담 요약', dataIndex: 'consultationSummary', key: 'consultationSummary', ellipsis: true, render: (v) => v ?? '-' },
  ];

  return (
    <>
      <Card title="상담 자료 준비" style={{ marginBottom: 24 }} variant="borderless">
        <Space size="middle" wrap align="center">
          <Input
            placeholder="이름"
            value={searchName ?? ''}
            onChange={(e) => setSearchName(e.target.value)}
            allowClear
            style={{ width: 160 }}
            disabled={loading}
          />
          <Input
            placeholder="휴대폰 번호"
            value={searchPhone ?? ''}
            onChange={(e) => setSearchPhone(e.target.value)}
            allowClear
            style={{ width: 180 }}
            disabled={loading}
          />
          <Button type="primary" icon={<Search size={16} />} onClick={handleSearch} loading={loading}>
            조회
          </Button>
        </Space>
      </Card>

      {loading && (
        <Card variant="borderless" style={{ marginBottom: 24, textAlign: 'center', padding: 48 }}>
          <Spin size="large" tip="상담 시나리오 조회 중..." />
        </Card>
      )}

      {error && !loading && (
        <Card variant="borderless" style={{ marginBottom: 24, background: '#fff2f0', border: '1px solid #ffccc7' }}>
          <Text type="danger">{error}</Text>
        </Card>
      )}

      {scenarioData && !loading && (
        <>

          {masked && (
            <Card
              title={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <User size={18} />
                  내담자 정보
                </span>
              }
              variant="borderless"
              style={{ marginBottom: 24 }}
            >
              <Descriptions column={{ xs: 1, sm: 2, md: 3 }} size="small" bordered>
                <Descriptions.Item label="이름">{((searchName ?? '').trim() || masked.name) ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="연령">{masked.age ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="성별">{genderLabel(masked.gender)}</Descriptions.Item>
                <Descriptions.Item label="학력">{educationLabel(masked.education)}</Descriptions.Item>
                <Descriptions.Item label="희망 직종">{masked.desiredJob ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="역량">{masked.competency ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="주소" span={3}>{masked.address ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="학교">{masked.university ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="전공">{masked.major ?? '-'}</Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {similarCases.length > 0 && (
            <Card
              title={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Users size={18} />
                  유사 사례
                </span>
              }
              variant="borderless"
              style={{ marginBottom: 24 }}
            >
              <Table
                size="small"
                dataSource={similarCases.map((row, i) => ({ ...row, key: row.clientId ?? i }))}
                columns={similarColumns}
                pagination={false}
                scroll={{ x: 800 }}
              />
              <button
                type="button"
                onClick={() => setShowSimilarStats((v) => !v)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 12,
                  padding: '8px 0',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#1677ff',
                }}
              >
                유사사례 {similarCases.length}인 통계 보기
                {showSimilarStats ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {showSimilarStats && <SimilarCasesStatsContent allCases={similarCases} />}
            </Card>
          )}

          {rec && (
            <Card
              id="export-guidelines-section"
              title={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Lightbulb size={18} />
                  AI 추천
                </span>
              }
              variant="borderless"
              style={{ marginBottom: 24, background: '#f7f6f3', border: '1px solid rgba(55, 53, 47, 0.09)', borderRadius: 8 }}
              extra={searchName ? <ExportScenarioButton clientName={searchName} /> : null}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {(rec.recommendedJobsByProfile?.length > 0 || rec.recommendedJobsByDesiredJob?.length > 0) && (
                  <div style={notionBlock}>
                    <div style={notionLabel}>직무 추천</div>
                    <Space direction="vertical" size={10} style={{ width: '100%' }}>
                      {rec.recommendedJobsByProfile?.length > 0 && (
                        <div>
                          <div style={{ fontSize: 12, color: 'rgba(55, 53, 47, 0.5)', marginBottom: 6 }}>프로필 기반</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {rec.recommendedJobsByProfile.map((job, i) => (
                              <span
                                key={i}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: 4,
                                  background: 'rgba(55, 53, 47, 0.08)',
                                  fontSize: 13,
                                  color: 'rgb(55, 53, 47)',
                                }}
                              >
                                {job}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {rec.recommendedJobsByDesiredJob?.length > 0 && (
                        <div>
                          <div style={{ fontSize: 12, color: 'rgba(55, 53, 47, 0.5)', marginBottom: 6 }}>희망 직종 기반</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {rec.recommendedJobsByDesiredJob.map((job, i) => (
                              <span
                                key={i}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: 4,
                                  background: 'rgba(55, 53, 47, 0.06)',
                                  border: '1px solid rgba(55, 53, 47, 0.12)',
                                  fontSize: 13,
                                  color: 'rgb(55, 53, 47)',
                                }}
                              >
                                {job}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Space>
                  </div>
                )}

                {rec.recommendedTrainings?.length > 0 && (
                  <div style={notionBlock}>
                    <div style={notionLabel}>추천 훈련</div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', lineHeight: 1.6 }}>
                      {rec.recommendedTrainings.map((item, i) => (
                        <li key={i} style={{ marginBottom: 4, color: 'rgb(55, 53, 47)' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.recommendedCompanies?.length > 0 && (
                  <div style={notionBlock}>
                    <div style={notionLabel}>추천 기업</div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', lineHeight: 1.6 }}>
                      {rec.recommendedCompanies.map((item, i) => (
                        <li key={i} style={{ marginBottom: 4, color: 'rgb(55, 53, 47)' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.expectedSalaryRange && (
                  <div style={notionBlock}>
                    <div style={notionLabel}>예상 급여 범위</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'rgb(55, 53, 47)' }}>{formatNumberWithCommas(rec.expectedSalaryRange)}</div>
                  </div>
                )}

                {rec.suggestedServices?.length > 0 && (
                  <div style={notionBlock}>
                    <div style={notionLabel}>제안 서비스</div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', lineHeight: 1.6 }}>
                      {rec.suggestedServices.map((item, i) => (
                        <li key={i} style={{ marginBottom: 4, color: 'rgb(55, 53, 47)' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.coreQuestions?.length > 0 && (
                  <div style={notionBlock}>
                    <div style={notionLabel}>핵심 질문</div>
                    <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                      {rec.coreQuestions.map((item, i) => (
                        <li key={i} style={{ marginBottom: 8, color: 'rgb(55, 53, 47)' }}>{item}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {rec.reason && (
                  <div style={{ ...notionBlock, ...notionCallout }}>
                    <div style={notionLabel}>추천 사유</div>
                    <Text style={{ whiteSpace: 'pre-wrap', color: 'rgb(55, 53, 47)', lineHeight: 1.6 }}>{rec.reason}</Text>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card
            title={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Upload size={18} />
                상담 자료 업로드
              </span>
            }
            variant="borderless"
            style={{ marginBottom: 24 }}
          >
            <FileUploadSection
              uploadedFiles={uploadedFiles ?? []}
              setUploadedFiles={setUploadedFiles ?? (() => {})}
              searchName={searchName ?? ''}
              setSearchName={setSearchName ?? (() => {})}
              searchBirthDate=""
              setSearchBirthDate={() => {}}
              onAnalysisTrigger={onScenarioLoaded}
              clientId={clientId}
            />
          </Card>
        </>
      )}
    </>
  );
}

export default CounselingPrepPage;
