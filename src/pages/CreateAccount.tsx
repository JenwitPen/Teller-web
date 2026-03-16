import React from 'react';
import { 
  Card, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Button, 
  Typography, 
  Space,
  Row,
  Col,
  Divider,
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCreateAccount } from '../hooks/useCreateAccount';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { loading, createAccount } = useCreateAccount();

  const onFinish = async (values: any) => {
    try {
      await createAccount(values);
    } catch {
      // Error handled in hook
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/accounts')}
          style={{ marginRight: 16 }}
        />
        <div>
          <Title level={2} style={{ color: '#1C2862', margin: 0 }}>
            เปิดบัญชีใหม่
          </Title>
          <Text type="secondary">กรอกข้อมูลเพื่อเริ่มต้นเปิดบัญชีธนาคารใหม่</Text>
        </div>
      </div>

      <Card style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: 'none' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            currency_code: 'THB',
            balance: 0,
          }}
          size="large"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Divider titlePlacement="left">ข้อมูลเจ้าของบัญชี</Divider>
              <Form.Item
                label="ชื่อบัญชี (Account Name)"
                name="account_name"
                rules={[{ required: true, message: 'กรุณากรอกชื่อบัญชี' }]}
              >
                <Input placeholder="เช่น นายสมชาย ใจดี" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Divider titlePlacement="left">ข้อมูลเลขที่บัญชี</Divider>
              <Form.Item
                label="เลขที่บัญชี (Account ID)"
                name="account_id"
                rules={[
                  { required: true, message: 'กรุณากรอกเลขที่บัญชี' },
                  { pattern: /^\d{10}$/, message: 'เลขที่บัญชีต้องมี 10 หลัก' }
                ]}
              >
                <Input placeholder="1234567890" maxLength={10} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label="ประเภทบัญชี"
                name="account_type"
                rules={[{ required: true, message: 'กรุณาเลือกประเภทบัญชี' }]}
              >
                <Select placeholder="เลือกประเภทบัญชี">
                  <Option value="SAVINGS">SAVINGS (ออมทรัพย์)</Option>
                  <Option value="CURRENT">CURRENT (กระแสรายวัน)</Option>
                  <Option value="FIXED_DEPOSIT">FIXED DEPOSIT (ฝากประจำ)</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="รหัสสาขา (Branch Code)"
                name="branch_code"
                rules={[{ required: true, message: 'กรุณากรอกรหัสสาขา' },
                       { pattern: /^\d{4}$/, message: 'รหัสสาขาต้องมี 4 หลัก' }
                ]}
              >
                <Input placeholder="เช่น 0001" maxLength={4} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="สกุลเงิน"
                name="currency_code"
                rules={[{ required: true, message: 'กรุณาเลือกสกุลเงิน' }]}
              >
                <Select disabled>
                  <Option value="THB">THB (Thai Baht)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="ยอดเงินเริ่มต้น"
                name="balance"
                rules={[{ required: true, message: 'กรุณากรอกยอดเงินเริ่มต้น' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') as any}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                  min={0}
                  step={100}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => navigate('/accounts')}>
                ยกเลิก
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
                style={{ minWidth: 120 }}
              >
                เปิดบัญชี
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
      <div style={{ marginTop: 24, padding: 20, background: '#f8f5f1ff', borderRadius: 12, border: '1px solid #E59A4' }}>
        <Space align="start">
          <UserAddOutlined style={{ fontSize: 24, color: '#E59A42', marginTop: 4 }} />
          <div>
            <Text strong style={{ color: '#E59A42', fontSize: 16 }}>ข้อแนะนำในการเปิดบัญชี</Text>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: '#262626' }}>
              <li>กรุณาตรวจสอบชื่อ-นามสกุลให้ถูกต้องตามบัตรประชาชน</li>
              <li>เลขที่บัญชีต้องเป็นตัวเลข 10 หลักที่ไม่ซ้ำกับในระบบ</li>
              <li>ยอดเงินเริ่มต้นต้องไม่ต่ำกว่าเงื่อนไขที่ธนาคารกำหนดสำหรับแต่ละประเภทบัญชี</li>
            </ul>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default CreateAccount;
