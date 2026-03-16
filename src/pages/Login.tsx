import React from 'react';
import { Form, Input, Button, Card, Typography, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from '../hooks/useLogin';

const { Title, Text } = Typography;
const { Content } = Layout;

const Login: React.FC = () => {
  const { loading, login } = useLogin();

  const onFinish = async (values: any) => {
    try {
      await login(values);
    } catch {
      // Error handled in hook
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card 
          style={{ width: '100%', maxWidth: 400, boxShadow: '0 8px 24px rgba(28, 40, 98, 0.12)', borderRadius: 12, border: 'none' }}
          bodyStyle={{ padding: '40px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ 
              width: 64, 
              height: 64, 
              background: '#3e71e8', 
              borderRadius: 16, 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: 16,
              boxShadow: '0 4px 12px rgba(62, 113, 232, 0.3)'
            }}>
              <LockOutlined style={{ fontSize: 32, color: '#fff' }} />
            </div>
            <Title level={2} style={{ margin: 0, color: '#1C2862' }}>Teller Login</Title>
            <Text type="secondary">Enter your credentials to access the system</Text>
          </div>

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input prefix={<UserOutlined style={{ color: '#3e71e8' }} />} placeholder="Enter username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password prefix={<LockOutlined style={{ color: '#3e71e8' }} />} placeholder="Enter password" />
            </Form.Item>

            <Form.Item style={{ marginTop: 24 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block 
                style={{ height: 48, fontWeight: 600, fontSize: 16 }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Teller System v1.0.0
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
