import { Row, Col } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function StatisticsCharts({
  successRateData: successRateDataProp,
  jobMatchData: jobMatchDataProp,
  skillDistributionData: skillDistributionDataProp,
}) {
  const successRateData =
    successRateDataProp ??
    [
      { name: '신입', successRate: 45, avgRate: 60 },
      { name: '주니어', successRate: 68, avgRate: 70 },
      { name: '시니어', successRate: 82, avgRate: 75 },
      { name: '리드', successRate: 75, avgRate: 65 },
    ];

  const jobMatchData =
    jobMatchDataProp ??
    [
      { name: '프론트엔드', score: 85 },
      { name: '백엔드', score: 78 },
      { name: '풀스택', score: 72 },
      { name: '데브옵스', score: 65 },
      { name: '데이터', score: 58 },
    ];

  const skillDistributionData =
    skillDistributionDataProp ??
    [
      { name: '기술력', value: 35, color: '#1890ff' },
      { name: '경험', value: 28, color: '#52c41a' },
      { name: '커뮤니케이션', value: 20, color: '#fa8c16' },
      { name: '문제해결', value: 17, color: '#f5222d' },
    ];

  const COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#f5222d'];

  return (
    <div>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>
              유사 스펙 대비 취업 성공률
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={successRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="successRate" fill="#1890ff" name="현재 성공률 (%)" />
                <Bar dataKey="avgRate" fill="#d9d9d9" name="평균 성공률 (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col span={24}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>
              직무별 매칭 점수
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={jobMatchData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="score" fill="#52c41a" name="매칭 점수" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col span={24}>
          <div>
            <h4 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>
              역량별 분포 통계
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={skillDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StatisticsCharts;
