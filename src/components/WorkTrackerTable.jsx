import { Table, Tag, Avatar, Space } from 'antd';
import { CheckCircle, Clock, AlertCircle, User } from 'lucide-react';
import { defaultWorkTrackerData } from '../data/defaultDashboardData';

function WorkTrackerTable({ data: dataProp }) {
  const columns = [
    {
      title: '작업 이름',
      dataIndex: 'taskName',
      key: 'taskName',
      width: '20%',
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      render: (status) => {
        const statusConfig = {
          완료: { color: 'success', icon: <CheckCircle size={14} /> },
          진행중: { color: 'processing', icon: <Clock size={14} /> },
          시작전: { color: 'default', icon: <AlertCircle size={14} /> },
        };
        const config = statusConfig[status] || statusConfig['시작전'];
        return (
          <Tag color={config.color} icon={config.icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '담당자',
      dataIndex: 'assignee',
      key: 'assignee',
      width: '15%',
      render: (assignee) => (
        <Space>
          <Avatar
            size="small"
            style={{
              backgroundColor: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={12} color="#fff" />
          </Avatar>
          <span>{assignee}</span>
        </Space>
      ),
    },
    {
      title: '마감일',
      dataIndex: 'deadline',
      key: 'deadline',
      width: '12%',
    },
    {
      title: '비고',
      dataIndex: 'note',
      key: 'note',
      width: '10%',
    },
  ];

  const data = dataProp ?? defaultWorkTrackerData;

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 10 }}
      size="middle"
      scroll={{ x: 'max-content' }}
    />
  );
}

export default WorkTrackerTable;
