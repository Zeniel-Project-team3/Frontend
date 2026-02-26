import { useState } from 'react';
import { Card, Descriptions, Input, Button, Space, Spin, message, Table, Tag, Typography } from 'antd';
import { Search, User, Users, Lightbulb, Upload } from 'lucide-react';
import { getConsultationScenario } from '../api/dataApi';
import ExportScenarioButton from '../components/ExportScenarioButton';
import FileUploadSection from '../components/FileUploadSection';

const { Text } = Typography;

function genderLabel(g) {
  if (g === 'MALE') return '남';
  if (g === 'FEMALE') return '여';
  return g ?? '-';
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
    { title: '급여', dataIndex: 'salary', key: 'salary', width: 90, render: (v) => (v != null ? `${v}` : '-') },
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
          {scenarioData.queryText && (
            <Card size="small" variant="borderless" style={{ marginBottom: 24, background: '#fafafa' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>조회 문의</Text>
              <Text style={{ whiteSpace: 'pre-wrap' }}>{scenarioData.queryText}</Text>
            </Card>
          )}

          {masked && (
            <Card
              title={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <User size={18} />
                  내담자 마스킹 정보
                </span>
              }
              variant="borderless"
              style={{ marginBottom: 24 }}
            >
              <Descriptions column={{ xs: 1, sm: 2, md: 3 }} size="small" bordered>
                <Descriptions.Item label="이름">{masked.name ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="연령">{masked.age ?? '-'}</Descriptions.Item>
                <Descriptions.Item label="성별">{genderLabel(masked.gender)}</Descriptions.Item>
                <Descriptions.Item label="학력">{masked.education ?? '-'}</Descriptions.Item>
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
              style={{ marginBottom: 24 }}
              extra={searchName ? <ExportScenarioButton clientName={searchName} /> : null}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {(rec.recommendedJobsByProfile?.length > 0 || rec.recommendedJobsByDesiredJob?.length > 0) && (
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>직무 추천</Text>
                    <Space direction="vertical" size={4}>
                      {rec.recommendedJobsByProfile?.length > 0 && (
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>프로필 기반</Text>
                          <div style={{ marginTop: 4 }}>
                            {rec.recommendedJobsByProfile.map((job, i) => (
                              <Tag key={i} color="blue" style={{ marginBottom: 4 }}>{job}</Tag>
                            ))}
                          </div>
                        </div>
                      )}
                      {rec.recommendedJobsByDesiredJob?.length > 0 && (
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>희망 직종 기반</Text>
                          <div style={{ marginTop: 4 }}>
                            {rec.recommendedJobsByDesiredJob.map((job, i) => (
                              <Tag key={i} color="green" style={{ marginBottom: 4 }}>{job}</Tag>
                            ))}
                          </div>
                        </div>
                      )}
                    </Space>
                  </div>
                )}

                {rec.recommendedTrainings?.length > 0 && (
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>추천 훈련</Text>
                    <ListBlock items={rec.recommendedTrainings} />
                  </div>
                )}

                {rec.recommendedCompanies?.length > 0 && (
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>추천 기업</Text>
                    <ListBlock items={rec.recommendedCompanies} />
                  </div>
                )}

                {rec.expectedSalaryRange && (
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>예상 급여 범위</Text>
                    <Text>{rec.expectedSalaryRange}</Text>
                  </div>
                )}

                {rec.suggestedServices?.length > 0 && (
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>제안 서비스</Text>
                    <ListBlock items={rec.suggestedServices} />
                  </div>
                )}

                {rec.coreQuestions?.length > 0 && (
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>핵심 질문</Text>
                    <ListBlock items={rec.coreQuestions} />
                  </div>
                )}

                {rec.reason && (
                  <div style={{ padding: 12, background: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>추천 사유</Text>
                    <Text style={{ whiteSpace: 'pre-wrap' }}>{rec.reason}</Text>
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
