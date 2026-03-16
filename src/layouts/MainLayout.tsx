import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Space, Typography, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  WalletOutlined,
  TransactionOutlined,
  HistoryOutlined,
  DashboardOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { useIdleTimeout } from '../hooks/useIdleTimeout';
import { Modal } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getUser();
  const { showWarning, handleStayLoggedIn, logout } = useIdleTimeout();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'แดชบอร์ด',
    },
    {
      key: '/accounts-group',
      icon: <WalletOutlined />,
      label: 'การจัดการบัญชี',
      children: [
        {
          key: '/accounts',
          label: 'รายการบัญชีทั้งหมด',
        },
        {
          key: '/accounts/create',
          label: 'เปิดบัญชีใหม่',
        },
      ],
    },
    {
      key: '/operations',
      icon: <TransactionOutlined />,
      label: 'การทำธุรกรรม',
    },
    {
      key: '/reports',
      icon: <HistoryOutlined />,
      label: 'รายงานและประวัติธุรกรรม',
    },
  ];

  const userMenuItems = [
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"

        width={250}
        style={{ 
          boxShadow: '2px 0 8px rgba(28, 40, 98, 0.05)',
          zIndex: 10,
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '0 16px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            background: '#3e71e8', 
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: collapsed ? 0 : 12
          }}>
            <LockOutlined style={{ color: '#fff' }} />
          </div>
          {!collapsed && (
            <Title level={4} style={{ margin: 0, color: '#1C2862', fontSize: 18 }}>Teller</Title>
          )}
        </div>
        <Menu
          mode="inline"

          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          zIndex: 9
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer', padding: '0 8px', borderRadius: 8, transition: 'all 0.3s' }}>
                <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
                  <Text strong style={{ display: 'block', color: '#1C2862' }}>{user?.username}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>ID: {user?.employee_id} | {user?.role}</Text>
                </div>
                <Avatar icon={<UserOutlined />} style={{ background: '#3e71e8' }} />
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#FFFFFF', 
          borderRadius: 12,
          minHeight: 280,
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <Outlet />
        </Content>
      </Layout>

      <Modal
        title="Session Timeout Warning"
        open={showWarning}
        onOk={handleStayLoggedIn}
        onCancel={logout}
        okText="Stay Logged In"
        cancelText="Logout Now"
        closable={false}
        maskClosable={false}
      >
        <p>คุณไม่มีการใช้งานมาระยะหนึ่งแล้ว ระบบจะทำการออกจากระบบโดยอัตโนมัติเพื่อความปลอดภัย</p>
        <p>คุณต้องการใช้งานต่อหรือไม่?</p>
      </Modal>
    </Layout>
  );
};


export default MainLayout;
