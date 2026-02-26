import { Card } from 'antd';
import StatisticsCharts from '../components/StatisticsCharts';
import SimilarCasesTable from '../components/SimilarCasesTable';
import ExportStatisticsButton from '../components/ExportStatisticsButton';

function StatisticsPage({
  clientName,
  successRateData,
  jobMatchData,
  skillDistributionData,
  similarCasesData,
}) {
  return (
    <Card
      id="export-statistics-section"
      title="분석 및 통계"
      variant="borderless"
      extra={
        <ExportStatisticsButton
          clientName={clientName}
          successRateData={successRateData}
          jobMatchData={jobMatchData}
          skillDistributionData={skillDistributionData}
          similarCasesData={similarCasesData}
        />
      }
    >
      <StatisticsCharts
        successRateData={successRateData}
        jobMatchData={jobMatchData}
        skillDistributionData={skillDistributionData}
      />
      <Card
        title="비슷한 보유 역량의 취업 성공 경로"
        variant="borderless"
        style={{ marginTop: '24px' }}
      >
        <SimilarCasesTable data={similarCasesData} />
      </Card>
    </Card>
  );
}

export default StatisticsPage;
