import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Skeleton,
  Breadcrumb,
  Form
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  WalletOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useAccountDetail } from '../hooks/useAccountDetail';
import AccountForm from '../components/AccountForm';

const { Title, Text } = Typography;

const AccountDetail: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const { loading, account } = useAccountDetail(accountId);
  const [form] = Form.useForm();

  useEffect(() => {
    if (account) {
      form.setFieldsValue(account);
    }
  }, [account, form]);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!account) {
    return (
      <Card style={{ textAlign: 'center', padding: '40px 0', borderRadius: 12 }}>
        <Space direction="vertical" size="large">
          <InfoCircleOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
          <Title level={3}>ไม่พบข้อมูลบัญชี</Title>
          <Text type="secondary">ไม่พบข้อมูลสำหรับเลขที่บัญชี {accountId}</Text>
          <Button type="primary" onClick={() => navigate('/accounts')}>
            กลับไปยังรายการบัญชี
          </Button>
        </Space>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>หน้าหลัก</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate('/accounts')} style={{ cursor: 'pointer' }}>การจัดการบัญชี</Breadcrumb.Item>
        <Breadcrumb.Item>รายละเอียดบัญชี</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Space size="middle">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/accounts')}
            style={{ borderRadius: 8 }}
          />
          <div>
            <Title level={2} style={{ color: '#1C2862', margin: 0 }}>
              รายละเอียดบัญชี
            </Title>
            <Text type="secondary">{account.account_name} | {account.account_id}</Text>
          </div>
        </Space>
        <Space>
          <Button 
            icon={<HistoryOutlined />}
            onClick={() => navigate(`/operations?account_id=${account.account_id}`)}
          >
            ประวัติธุรกรรม
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/accounts/edit/${account.account_id}`)}
            style={{ minWidth: 100 }}
          >
            แก้ไขข้อมูล
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card 
            title={<Space><WalletOutlined /> <Text strong>ข้อมูลบัญชี</Text></Space>}
            style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: 'none' }}
          >
            <AccountForm form={form} mode="view" />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card 
            title={<Space><CalendarOutlined /> <Text strong>ข้อมูลระบบ</Text></Space>}
            style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: 'none' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>วันที่เปิดบัญชี</Text>
                <Text strong>{new Date(account.created_at).toLocaleString()}</Text>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>แก้ไขล่าสุด</Text>
                <Text strong>{new Date(account.updated_at).toLocaleString()}</Text>
              </div>
              {account.closed_at && (
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>วันที่ปิดบัญชี</Text>
                  <Text strong style={{ color: '#cf1322' }}>{new Date(account.closed_at).toLocaleString()}</Text>
                </div>
              )}
              <div style={{ background: '#fafafa', padding: 12, borderRadius: 8 }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>ID อ้างอิงระบบ / เวอร์ชัน</Text>
                  <Text code style={{ fontSize: 12 }}>{account.id} (v{account.version})</Text>
                </Space>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AccountDetail;
