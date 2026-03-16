import React from 'react';
import {
  Table,
  Card,
  Typography,
  Select,
  Space,
  Input,
  Tag,
  DatePicker,
  Button,
} from 'antd';
import {
  HistoryOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { TransactionType } from '../types/transaction';
import { useTransactionHistory } from '../hooks/useTransactionHistory';
import SafeHtml from '../components/SafeHtml';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Reports: React.FC = () => {
  const {
    loading,
    data,
    accountId,
    setAccountId,
    type,
    setType,
    dateRange,
    setDateRange,
    pagination,
    fetchHistory,
    handleTableChange,
    handleClear,
    disabledDate,
  } = useTransactionHistory();

  const columns = [

    {
      title: 'เลขที่บัญชี',
      dataIndex: 'account_id',
      key: 'account_id',
      width: 200,
    },
    {
      title: 'ชื่อบัญชี',
      dataIndex: 'account_name',
      key: 'account_name',
      width: 200,
    },
    {
      title: 'ประเภทรายการ',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      width: 100,
      render: (type: TransactionType) => (
        <Tag color={type === 'DEPOSIT' ? 'volcano' : 'green' }>
          {type}
        </Tag>
      ),
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      width: 150,
      render: (amount: number) => (
        <Text strong color={amount > 0 ? 'green' : 'red'}>
          {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: 'ยอดคงเหลือ',
      dataIndex: 'balance_after',
      key: 'balance_after',
      align: 'right' as const,
      width: 150,
      render: (balance: number) => balance.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    },
    {
      title: 'รหัสสาขา',
      dataIndex: 'branch_code',
      key: 'branch_code',
      width: 100,
    },
    {
      title: 'รหัสพนักงาน',
      dataIndex: 'employee_id',
      key: 'employee_id',
      width: 120,
    },
    {
      title: 'ปี-เดือน-วัน เวลา',
      dataIndex: 'transaction_date',
      key: 'transaction_date',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'หมายเหตุ',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (text: string) => text ? (
        <SafeHtml html={text} />
      ) : '-',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ color: '#1C2862', margin: 0 }}>
            <HistoryOutlined style={{ marginRight: 12 }} />
            รายงานและประวัติธุรกรรม
          </Title>
          <Text type="secondary">ดูประวัติการทำรายการย้อนหลัง (สูงสุด 3 เดือน)</Text>
        </div>
      </div>

      <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <Space direction="horizontal" size="large" wrap>
          <div>
            <div style={{ marginBottom: 8 }}><Text strong>เลขที่บัญชี</Text></div>
            <Input
              placeholder="กรอกเลขที่บัญชี"
              prefix={<SearchOutlined />}
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
          <div>
            <div style={{ marginBottom: 8 }}><Text strong>ประเภทรายการ</Text></div>
            <Select
              placeholder="ทั้งหมด"
              allowClear
              style={{ width: 150 }}
              value={type}
              onChange={setType}
            >
              <Option value="DEPOSIT">DEPOSIT (ฝาก)</Option>
              <Option value="WITHDRAW">WITHDRAW (ถอน)</Option>
            </Select>
          </div>
          <div>
            <div style={{ marginBottom: 8 }}><Text strong>ช่วงเวลา (ย้อนหลัง 3 เดือน)</Text></div>
            <RangePicker
              disabledDate={disabledDate}
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: 62 }}>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={() => fetchHistory(1)}
            >
              ค้นหา
            </Button> &nbsp;
            <Button
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100','200'],
          showTotal: (total) => `ทั้งหมด ${total} รายการ`
        }}
        onChange={handleTableChange}
        locale={{ emptyText: 'ไม่พบข้อมูลธุรกรรม' }}
        style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
        virtual={pagination.pageSize > 100}
        scroll={{ y: 480, x: 'max-content' }}
      />
    </div>
  );
};

export default Reports;
