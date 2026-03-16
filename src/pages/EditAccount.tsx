import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Form, 
  Button, 
  Typography, 
  Space, 
  Divider, 
  Skeleton,
  Breadcrumb,
  Alert
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useAccountDetail } from '../hooks/useAccountDetail';
import { useEditAccount } from '../hooks/useEditAccount';
import AccountForm from '../components/AccountForm';

const { Title, Text } = Typography;

const EditAccount: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const { loading: loadingDetail, account } = useAccountDetail(accountId);
  const { loading: loadingUpdate, updateAccount } = useEditAccount();

  useEffect(() => {
    if (account) {
      form.setFieldsValue(account);
    }
  }, [account, form]);

  const onFinish = async (values: any) => {
    try {
      await updateAccount(values);
    } catch {
      // Error handled in hook
    }
  };

  if (loadingDetail) {
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
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>หน้าหลัก</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate('/accounts')} style={{ cursor: 'pointer' }}>การจัดการบัญชี</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate(`/accounts/${account.account_id}`)} style={{ cursor: 'pointer' }}>รายละเอียดบัญชี</Breadcrumb.Item>
        <Breadcrumb.Item>แก้ไขข้อมูล</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/accounts')}
          style={{ marginRight: 16, borderRadius: 8 }}
        />
        <div>
          <Title level={2} style={{ color: '#1C2862', margin: 0 }}>
            แก้ไขข้อมูลบัญชี
          </Title>
          <Text type="secondary">แก้ไขรายละเอียดสำหรับบัญชี {account.account_id}</Text>
        </div>
      </div>

      <Alert
        message="คำแนะนำ"
        description="การแก้ไขสถานะบัญชีเป็น LOCKED หรือ CLOSED จะมีผลกระทบต่อการทำธุรกรรมในอนาคต กรุณาตรวจสอบให้แน่ใจก่อนทำการบันทึก"
        type="info"
        showIcon
        style={{ marginBottom: 24, borderRadius: 12 }}
      />

      <Card style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: 'none' }}>
        <AccountForm 
          form={form} 
          mode="edit" 
          onFinish={onFinish} 
          loading={loadingUpdate} 
        />
        
        <Divider />

        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={() => navigate('/accounts')}>
              ยกเลิก
            </Button>
            <Button 
              type="primary" 
              onClick={() => form.submit()}
              loading={loadingUpdate}
              icon={<SaveOutlined />}
              style={{ minWidth: 120, borderRadius: 8 }}
            >
              บันทึกการแก้ไข
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default EditAccount;
