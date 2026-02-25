import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { FileText, BarChart3, Database } from 'lucide-react';
import CounselingPrepPage from './CounselingPrepPage';
import AllDataPage from './AllDataPage';
import StatisticsPage from './StatisticsPage';
import {
  defaultGuidelines,
  defaultJobMatchData,
  defaultSimilarCasesData,
  defaultSkillDistributionData,
  defaultSuccessRateData,
  defaultWorkTrackerData,
} from '../data/defaultDashboardData';

const { Content, Sider } = Layout;
const LEFT_SIDER_WIDTH = 220;

const SIDEBAR_KEYS = { ANALYSIS: 'analysis', ALL_DATA: 'all_data', STATISTICS: 'statistics' };

function AnalysisPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchBirthDate, setSearchBirthDate] = useState('');
  const [searchGender, setSearchGender] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [sidebarSection, setSidebarSection] = useState(SIDEBAR_KEYS.ANALYSIS);
  const [workTrackerData, setWorkTrackerData] = useState(defaultWorkTrackerData);
  const [similarCasesData, setSimilarCasesData] = useState(defaultSimilarCasesData);
  const [guidelines, setGuidelines] = useState(defaultGuidelines);
  const [successRateData, setSuccessRateData] = useState(defaultSuccessRateData);
  const [jobMatchData, setJobMatchData] = useState(defaultJobMatchData);
  const [skillDistributionData, setSkillDistributionData] = useState(defaultSkillDistributionData);
  const clientInfo = {
    name: searchName || '내담자',
    birthDate: searchBirthDate,
    gender: searchGender === 'male' ? '남' : searchGender === 'female' ? '여' : searchGender === 'other' ? '기타' : '',
    phone: searchPhone,
  };

  const handleAnalysisTrigger = () => {
    setHasAnalysis(true);
  };

  return (
    <Layout style={{ background: 'transparent' }}>
      {/* 왼쪽 사이드바 */}
      <Sider
        width={LEFT_SIDER_WIDTH}
        className="analysis-sidebar"
        style={{
          background: '#fafafa',
          boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[sidebarSection]}
          onSelect={({ key }) => setSidebarSection(key)}
          className="analysis-sidebar-menu"
          style={{ height: '100%', borderRight: 0, padding: '16px 12px' }}
          items={[
            {
              key: SIDEBAR_KEYS.ALL_DATA,
              icon: <Database size={18} />,
              label: '내담자 통합 관리',
            },
            {
              key: SIDEBAR_KEYS.ANALYSIS,
              icon: <FileText size={18} />,
              label: '상담 자료 준비',
            },
            {
              key: SIDEBAR_KEYS.STATISTICS,
              icon: <BarChart3 size={18} />,
              label: '분석 및 통계',
              disabled: !hasAnalysis,
            },
          ]}
        />
      </Sider>

      <Content style={{ marginRight: 0, marginLeft: 0, paddingLeft: 24 }}>
        {sidebarSection === SIDEBAR_KEYS.ANALYSIS && (
          <CounselingPrepPage
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
            onAnalysisTrigger={handleAnalysisTrigger}
            hasAnalysis={hasAnalysis}
            clientInfo={clientInfo}
            workTrackerData={workTrackerData}
          />
        )}

        {/* 내담자 통합 관리 */}
        {sidebarSection === SIDEBAR_KEYS.ALL_DATA && (
          <AllDataPage
            workTrackerData={workTrackerData}
            setWorkTrackerData={setWorkTrackerData}
            similarCasesData={similarCasesData}
            setSimilarCasesData={setSimilarCasesData}
            guidelines={guidelines}
            setGuidelines={setGuidelines}
            successRateData={successRateData}
            setSuccessRateData={setSuccessRateData}
            jobMatchData={jobMatchData}
            setJobMatchData={setJobMatchData}
            skillDistributionData={skillDistributionData}
            setSkillDistributionData={setSkillDistributionData}
          />
        )}

        {/* 분석 및 통계 영역 */}
        {hasAnalysis && sidebarSection === SIDEBAR_KEYS.STATISTICS && (
          <StatisticsPage
            clientName={clientInfo.name}
            successRateData={successRateData}
            jobMatchData={jobMatchData}
            skillDistributionData={skillDistributionData}
            similarCasesData={similarCasesData}
          />
        )}
      </Content>
    </Layout>
  );
}

export default AnalysisPage;
