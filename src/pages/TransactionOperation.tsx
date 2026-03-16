import React from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Radio,
  InputNumber,
  Descriptions,
  Divider,
  Typography,
  Space,
  Alert,
  Modal,
  Tag
} from 'antd';
import {
  SearchOutlined,
  TransactionOutlined,
  DollarOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useTransactionOperation } from '../hooks/useTransactionOperation';
import SafeHtml from '../components/SafeHtml';

const { Title, Text } = Typography;
const { TextArea } = Input;

const TransactionOperation: React.FC = () => {
  const [form] = Form.useForm();
  const {
    loading,
    searching,
    selectedAccount,
    lookupAccount,
    performTransaction,
    reset
  } = useTransactionOperation();

  const onLookup = () => {
    const accountId = form.getFieldValue('account_id');
    if (accountId) {
      lookupAccount(accountId);
    }
  };

  const onFinish = (values: any) => {
    const user = JSON.parse(localStorage.getItem('user_info') || '{}');
    Modal.confirm({
      title: 'ยืนยันการทำรายการ',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>คุณต้องการทำรายการ <b>{values.transaction_type === 'DEPOSIT' ? 'ฝากเงิน' : 'ถอนเงิน'}</b></p>
          <p>จำนวนเงิน: <Text type="danger" strong>{values.amount.toLocaleString()}</Text> บาท</p>
          <p>เข้า/ออกจากบัญชี: {selectedAccount?.account_name}</p>
          {values.description && (
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">หมายเหตุ:</Text>
              <SafeHtml html={values.description} style={{ marginLeft: 8, display: 'inline-block' }} />
            </div>
          )}
        </div>
      ),
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        const success = await performTransaction({
          account_id: values.account_id,
          amount: values.amount,
          transaction_type: values.transaction_type,
          description: values.description,
          branch_code: user.branch_code,
          employee_id: user.employee_id
        });
        if (success) {
          form.setFieldsValue({ amount: undefined, description: undefined });
        }
      },
    });
  };

  const handleReset = () => {
    form.resetFields();
    reset();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>การทำธุรกรรม (Banking Operations)</Title>
          <Text type="secondary">จัดการรายการฝากและถอนเงินสำหรับลูกค้า</Text>
        </div>

        <Card
          bordered={false}
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ transaction_type: 'DEPOSIT' }}
          >
            <Title level={4}><SearchOutlined /> ตรวจสอบบัญชี</Title>
            <Form.Item
              label="เลขที่บัญชี"
              name="account_id"
              rules={[{ required: true, message: 'กรุณากรอกเลขที่บัญชี' }]}
            >
              <Input
                placeholder="กรอกเลขที่บัญชี 10 หลัก"
                size="large"
                suffix={
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={onLookup}
                    loading={searching}
                  >
                    ตรวจสอบ
                  </Button>
                }
                onPressEnter={(e) => {
                  e.preventDefault();
                  onLookup();
                }}
              />
            </Form.Item>

            {selectedAccount && (
              <div style={{ marginTop: 16 }}>
                <Alert
                  message="พบข้อมูลบัญชี"
                  type="success"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="ชื่อบัญชี">{selectedAccount.account_name}</Descriptions.Item>
                  <Descriptions.Item label="ประเภทบัญชี">
                    <Tag color="blue">{selectedAccount.account_type}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="ยอดเงินคงเหลือ">
                    <Text strong style={{ fontSize: 18, color: '#3e71e8' }}>
                      {selectedAccount.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                    <Text style={{ marginLeft: 8, fontSize: 12 }}>{selectedAccount.currency_code}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="สถานะ">
                    <Tag color={selectedAccount.status === 'ACTIVE' ? 'success' : 'error'}>
                      {selectedAccount.status}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={4}><DollarOutlined /> รายละเอียดรายการ</Title>

                <Form.Item
                  label="ประเภทรายการ"
                  name="transaction_type"
                  rules={[{ required: true }]}
                >
                  <Radio.Group buttonStyle="solid" size="large">
                    <Radio.Button value="DEPOSIT" style={{ width: 150, textAlign: 'center' }}>ฝากเงิน</Radio.Button>
                    <Radio.Button value="WITHDRAW" style={{ width: 150, textAlign: 'center' }}>ถอนเงิน</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label="จำนวนเงิน"
                  name="amount"
                  rules={[
                    { required: true, message: 'กรุณากรอกจำนวนเงิน' },
                    { type: 'number', min: 0.01, message: 'จำนวนเงินต้องมากกว่า 0' }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    size="large"
                    placeholder="0.00"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    prefix={<DollarOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  label="คำอธิบาย (ถ้ามี)"
                  name="description"
                >
                  <TextArea rows={3} placeholder="ระบุเหตุผลหรือบันทึกเพิ่มเติม..." />
                </Form.Item>

                <div style={{ textAlign: 'right', marginTop: 24 }}>
                  <Space>
                    <Button size="large" onClick={handleReset}>ล้างข้อมูล</Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      icon={<TransactionOutlined />}
                      loading={loading}
                    >
                      ทำรายการพื้นฐาน
                    </Button>
                  </Space>
                </div>
              </div>
            )}
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default TransactionOperation;
