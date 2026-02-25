import { Table } from 'antd';
import { defaultSimilarCasesData } from '../data/defaultDashboardData';

function SimilarCasesTable({ data: dataProp }) {
  const columns = [
    {
      title: '취업 직무',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      width: '18%',
    },
    {
      title: '최종 학력',
      dataIndex: 'finalEducation',
      key: 'finalEducation',
      width: '14%',
    },
    {
      title: '핵심 자격/교육',
      dataIndex: 'keyQualification',
      key: 'keyQualification',
      width: '22%',
    },
    {
      title: '평균 연봉',
      dataIndex: 'avgSalary',
      key: 'avgSalary',
      width: '11%',
    },
    {
      title: '취업 성공 경로 요약',
      dataIndex: 'successPath',
      key: 'successPath',
      width: '35%',
    },
  ];

  const rawData = dataProp ?? defaultSimilarCasesData;
  const data = rawData.slice(0, 3);

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      size="middle"
    />
  );
}

export default SimilarCasesTable;
