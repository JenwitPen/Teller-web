import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { 
  WalletOutlined, 
  TransactionOutlined, 
  HistoryOutlined,
  UserOutlined 
} from '@ant-design/icons';

import { useDashboard } from '../hooks/useDashboard';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { user, stats } = useDashboard();

  // const getIcon = (type: string) => {
  //   switch (type) {
  //     case 'wallet': return <WalletOutlined style={{ color: '#3e71e8' }} />;
  //     case 'transaction': return <TransactionOutlined style={{ color: '#E59A42' }} />;
  //     case 'user': return <UserOutlined style={{ color: '#1C2862' }} />;
  //     case 'history': return <HistoryOutlined style={{ color: '#ff4d4f' }} />;
  //     default: return null;
  //   }
  // };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ color: '#1C2862', margin: 0 }}>ยินดีต้อนรับ, {user?.username}</Title>
        <Text type="secondary">แดชบอร์ดภาพรวมระบบ Teller</Text>
      </div>

      {/* <Row gutter={[24, 24]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={getIcon(stat.type)}
              />
            </Card>
          </Col>
        ))}
      </Row> */}
    </div>
  );
};

export default Dashboard;
