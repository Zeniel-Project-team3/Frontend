import { useState } from 'react';
import { Card, Descriptions, Input, Button, Space, Spin, message } from 'antd';
import { Search, Target, FileWarning, Gift, MessageCircle, Briefcase, Banknote } from 'lucide-react';
import { getConsultationScenario } from '../api/dataApi';
import ExportScenarioButton from '../components/ExportScenarioButton';
import FileUploadSection from '../components/FileUploadSection';

const SCENARIO_LABELS = [
  { key: 'consultationGoal', label: '금회차 핵심 목표', desc: '상담의 방향성', icon: Target },
  { key: 'mandatoryNotice', label: '필수 이행 및 고지 사항', desc: '미이행 시 수당 부지급 등 법적 리스크 방지', icon: FileWarning },
  { key: 'suggestedServices', label: '제안할 서비스', desc: '예: 직업심리검사, 일경험 등', icon: Gift },
  { key: 'keyQuestions', label: '이번 상담 핵심 질문', desc: '내담자의 의지를 파악할 질문', icon: MessageCircle },
  { key: 'smilarOccupations', label: '유사 스펙 직업', desc: '내담자와 유사한 스펙을 가진 사람의 직업', icon: Briefcase },
  { key: 'avaerageSalary', label: '급여 수준', desc: '급여 수준', icon: Banknote },
];

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
      const msg = err?.response?.data?.message ?? err?.message ?? '조회에 실패했습니다.';
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card title="상담 자료 준비" style={{ marginBottom: '24px' }} variant="borderless">
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
          <Button
            type="primary"
            icon={<Search size={16} />}
            onClick={handleSearch}
            loading={loading}
          >
            조회
          </Button>
        </Space>
      </Card>

      {loading && (
        <Card variant="borderless" style={{ marginBottom: '24px', textAlign: 'center', padding: 48 }}>
          <Spin size="large" tip="상담 시나리오 조회 중..." />
        </Card>
      )}

      {error && !loading && (
        <Card variant="borderless" style={{ marginBottom: '24px', background: '#fff2f0', border: '1px solid #ffccc7' }}>
          <span style={{ color: '#cf1322' }}>{error}</span>
        </Card>
      )}

      {scenarioData && !loading && (
        <>
          <Card
            id="export-guidelines-section"
            title="상담 시나리오"
            variant="borderless"
            style={{ marginBottom: '24px' }}
            extra={searchName ? <ExportScenarioButton clientName={searchName} /> : null}
          >
            <Descriptions column={1} size="small" bordered>
              {SCENARIO_LABELS.map(({ key, label, desc, icon: Icon }) => (
                <Descriptions.Item key={key} label={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon size={16} />{label}</span>}>
                  <div>
                    <div style={{ color: '#8c8c8c', fontSize: 12, marginBottom: 4 }}>{desc}</div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{scenarioData[key] ?? '-'}</div>
                  </div>
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>

          <Card title="상담 자료 업로드" variant="borderless" style={{ marginBottom: '24px' }}>
            <FileUploadSection
              uploadedFiles={uploadedFiles ?? []}
              setUploadedFiles={setUploadedFiles ?? (() => {})}
              searchName={searchName ?? ''}
              setSearchName={setSearchName ?? (() => {})}
              searchBirthDate=""
              setSearchBirthDate={() => {}}
              onAnalysisTrigger={onScenarioLoaded}
            />
          </Card>
        </>
      )}
    </>
  );
}

export default CounselingPrepPage;
