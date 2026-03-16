import React from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Row, 
  Col, 
  Divider,
  InputNumber
} from 'antd';
import type { FormInstance } from 'antd';

// const { Title } = Typography;
const { Option } = Select;

interface AccountFormProps {
  form: FormInstance;
  mode: 'view' | 'edit';
  onFinish?: (values: any) => void;
  loading?: boolean;
}

const AccountForm: React.FC<AccountFormProps> = ({ form, mode, onFinish }) => {
  const isView = mode === 'view';

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      size="large"
      disabled={isView}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Divider titlePlacement="left">ข้อมูลหลัก</Divider>
        </Col>
        
        <Col xs={24} md={12}>
          <Form.Item
            label="เลขที่บัญชี"
            name="account_id"
          >
            <Input disabled />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="ชื่อบัญชี"
            name="account_name"
            rules={[{ required: true, message: 'กรุณากรอกชื่อบัญชี' }]}
          >
            <Input placeholder="เช่น นายสมชาย ใจดี" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
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

        <Col xs={24} md={12}>
          <Form.Item
            label="สถานะบัญชี"
            name="status"
            rules={[{ required: true, message: 'กรุณาเลือกสถานะบัญชี' }]}
          >
            <Select placeholder="เลือกสถานะ">
              <Option value="ACTIVE">ACTIVE (ปกติ)</Option>
              <Option value="LOCKED">LOCKED (ระงับชั่วคราว)</Option>
              <Option value="CLOSED">CLOSED (ปิดบัญชี)</Option>
            </Select>
          </Form.Item>
        </Col>

        {isView && (
          <Col xs={24} md={12}>
            <Form.Item
              label="ยอดเงินคงเหลือ"
              name="balance"
            >
              <InputNumber 
                style={{ width: '100%' }} 
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                decimalSeparator="."
                precision={2}
                disabled
              />
            </Form.Item>
          </Col>
        )}

        <Col span={24}>
          <Divider titlePlacement="left">ข้อมูลเพิ่มเติม</Divider>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="สกุลเงิน"
            name="currency_code"
            rules={[{ required: true, message: 'กรุณาเลือกสกุลเงิน' }]}
          >
            <Select>
              <Option value="THB">THB (Thai Baht)</Option>
              <Option value="USD">USD (US Dollar)</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="รหัสสาขา"
            name="branch_code"
          >
            <Input disabled={isView} />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="เวอร์ชันข้อมูล"
            name="version"
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AccountForm;
