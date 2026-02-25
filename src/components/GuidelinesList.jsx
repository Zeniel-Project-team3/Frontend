import { List } from 'antd';
import {
  GraduationCap,
  Award,
  FileEdit,
  MessageCircleQuestion,
} from 'lucide-react';
import { defaultGuidelines } from '../data/defaultDashboardData';

const ICON_BY_KIND = {
  training: <GraduationCap size={20} color="#1890ff" />,
  certificate: <Award size={20} color="#52c41a" />,
  resume: <FileEdit size={20} color="#fa8c16" />,
  interview: <MessageCircleQuestion size={20} color="#722ed1" />,
};

function GuidelinesList({ guidelines: guidelinesProp }) {
  const guidelines = guidelinesProp ?? defaultGuidelines;

  return (
    <List
      itemLayout="vertical"
      dataSource={guidelines}
      renderItem={(item) => (
        <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
          <List.Item.Meta
            avatar={
              <div
                style={{
                  padding: '8px',
                  background: '#f0f7ff',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {ICON_BY_KIND[item.kind] ?? ICON_BY_KIND.training}
              </div>
            }
            title={<strong style={{ fontSize: '15px' }}>{item.title}</strong>}
            description={
              <span style={{ color: '#595959', fontSize: '14px' }}>{item.description}</span>
            }
          />
        </List.Item>
      )}
    />
  );
}

export default GuidelinesList;
