import React from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Input, 
  Select, 
  Button, 
  Space, 
  Tag,
  Tooltip,
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import type { Account } from '../types/account';

const { Title, Text } = Typography;
const { Option } = Select;

const AccountList: React.FC = () => {
  const navigate = useNavigate();
  const {
    loading,
    data,
    total,
    filters,
    setFilters,
    handleTableChange,
    handleSearch,
    handleClear,
  } = useAccounts();
  const columns = [
    {
      title: 'เลขที่บัญชี',
      dataIndex: 'account_id',
      key: 'account_id',
      width: 150,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'ชื่อบัญชี',
      dataIndex: 'account_name',
      key: 'account_name',
      width: 200,
    },
    {
      title: 'ประเภทบัญชี',
      dataIndex: 'account_type',
      key: 'account_type',
      width: 150,
      render: (type: string) => (
        <Tag color="blue">{type}</Tag>
      ),
    },
    {
      title: 'รหัสสาขา',
      dataIndex: 'branch_code',
      key: 'branch_code',
      width: 100,
    },
    {
      title: 'ยอดเงินคงเหลือ',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right' as const,
      width: 150,
      render: (value: number) => (
        <Text strong>
          {value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        let color = 'green';
        if (status === 'LOCKED') color = 'orange';
        if (status === 'CLOSED') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'จัดการ',
      key: 'action',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: Account) => (
        <Space size="middle">
          <Tooltip title="ฝาก/ถอน">
            <Button 
                type="text" 
                icon={<WalletOutlined />} 
                onClick={() => navigate('/operations', { state: { account_id: record.account_id } })} 
            />
          </Tooltip>
          <Tooltip title="ดูรายละเอียด">
            <Button 
                type="text" 
                icon={<EyeOutlined />} 
                onClick={() => navigate(`/accounts/${record.account_id}`)} 
            />
          </Tooltip>
          <Tooltip title="แก้ไข">
            <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => navigate(`/accounts/edit/${record.account_id}`)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ color: '#1C2862', margin: 0 }}>
            <WalletOutlined style={{ marginRight: 12 }} />
            การจัดการบัญชีเงินฝาก
          </Title>
          <Text type="secondary">ค้นหาและจัดการข้อมูลบัญชีลูกค้า</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => navigate('/accounts/create')}
        >
          เปิดบัญชีใหม่
        </Button>
      </div>

      <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <Space direction="horizontal" size="large" wrap>
          <div>
            <div style={{ marginBottom: 8 }}><Text strong>เลขที่บัญชี</Text></div>
            <Input
              placeholder="กรอกเลขที่บัญชี"
              prefix={<SearchOutlined />}
              value={filters.account_id}
              onChange={(e) => setFilters({ ...filters, account_id: e.target.value })}
              onPressEnter={handleSearch}
              style={{ width: 220 }}
            />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}><Text strong>ประเภทบัญชี</Text></div>
            <Select
              placeholder="ทั้งหมด"
              allowClear
              style={{ width: 180 }}
              value={filters.account_type || undefined}
              onChange={(value) => setFilters({ ...filters, account_type: value })}
            >
              <Option value="SAVINGS">SAVINGS (ออมทรัพย์)</Option>
              <Option value="CURRENT">CURRENT (กระแสรายวัน)</Option>
              <Option value="FIXED_DEPOSIT">FIXED DEPOSIT (ฝากประจำ)</Option>
            </Select>
          </div>
          <div>
            <div style={{ marginBottom: 8 }}><Text strong>รหัสสาขา</Text></div>
            <Input
              placeholder="กรอกรหัสสาขา"
              value={filters.branch_code}
              onChange={(e) => setFilters({ ...filters, branch_code: e.target.value })}
              onPressEnter={handleSearch}
              style={{ width: 150 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: 62 }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              ค้นหา
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleClear}
              style={{ marginLeft: 8 }}
            >
              Clear
            </Button>
          </div>
        </Space>
      </Card>

      <Table
   
        columns={columns}
        dataSource={data}
        rowKey="account_id"
        loading={loading}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100','200'],
          showTotal: (total) => `ทั้งหมด ${total} รายการ`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
        style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
      />
    </div>
  );
};

export default AccountList;
