import { Card, Descriptions, Typography } from 'antd';
import { User } from 'lucide-react';
import FileUploadSection from '../components/FileUploadSection';
import WorkTrackerTable from '../components/WorkTrackerTable';
import ExportScenarioButton from '../components/ExportScenarioButton';

function CounselingPrepPage({
  uploadedFiles,
  setUploadedFiles,
  searchName,
  setSearchName,
  searchBirthDate,
  setSearchBirthDate,
  searchGender,
  setSearchGender,
  searchPhone,
  setSearchPhone,
  onAnalysisTrigger,
  hasAnalysis,
  clientInfo,
  workTrackerData,
}) {
  return (
    <>
      <Card title="내담자 이력서 및 진단서 분석" style={{ marginBottom: '24px' }} variant="borderless">
        <FileUploadSection
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          searchName={searchName}
          setSearchName={setSearchName}
          searchBirthDate={searchBirthDate}
          setSearchBirthDate={setSearchBirthDate}
          searchGender={searchGender}
          setSearchGender={setSearchGender}
          searchPhone={searchPhone}
          setSearchPhone={setSearchPhone}
          onAnalysisTrigger={onAnalysisTrigger}
        />
      </Card>

      {hasAnalysis && (
        <>
          <Card size="small" style={{ marginBottom: '16px', background: '#fafafa' }} variant="borderless">
            <Descriptions
              title={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={18} />
                  내담자 정보
                </span>
              }
              column={{ xs: 1, sm: 2, md: 4 }}
              size="small"
              items={[
                { label: '이름', children: clientInfo.name },
                { label: '생년월일', children: clientInfo.birthDate || '-' },
                { label: '성별', children: clientInfo.gender || '-' },
                { label: '연락처', children: clientInfo.phone || '-' },
              ]}
            />
          </Card>

          <Card
            title="내담자 단계별 상담 현황"
            variant="borderless"
            style={{ marginBottom: '24px' }}
          >
            <WorkTrackerTable data={workTrackerData} />
          </Card>

          <Card
            id="export-guidelines-section"
            title="상담 시나리오"
            variant="borderless"
            extra={<ExportScenarioButton clientName={clientInfo.name} />}
          >
            <Typography.Text type="secondary">AI 연동 예정</Typography.Text>
          </Card>
        </>
      )}
    </>
  );
}

export default CounselingPrepPage;
