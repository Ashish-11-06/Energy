import React, { useState } from 'react';
import { Table, Select, Tag, Space } from 'antd';

const { Option } = Select;

const Help = () => {
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

const data = [
  {
    key: '1',
    srNo: 1,
    userType: 'Consumer',
    name: 'Alice Johnson',
    companyName: 'InnoTech',
    status: 'Pending',
    query: 'I am unable to access my subscription details on the portal.',
  },
  {
    key: '2',
    srNo: 2,
    userType: 'Generator',
    name: 'Bob Smith',
    companyName: 'GreenPower',
    status: 'Resolved',
    query: 'How do I upgrade my current subscription plan?',
  },
  {
    key: '3',
    srNo: 3,
    userType: 'Consumer',
    name: 'Carol White',
    companyName: 'EcoLite',
    status: 'In Progress',
    query: 'My payment was deducted but the subscription is not active.',
  },
  {
    key: '4',
    srNo: 4,
    userType: 'Generator',
    name: 'David Green',
    companyName: 'SunGen Ltd.',
    status: 'Pending',
    query: 'I received an incorrect invoice for last month.',
  },
  {
    key: '5',
    srNo: 5,
    userType: 'Consumer',
    name: 'Eva Mendes',
    companyName: 'BrightPower',
    status: 'Resolved',
    query: 'Where can I download the subscription document?',
  },
];

  const filteredData = data.filter((item) => {
    const userMatch = userTypeFilter ? item.userType === userTypeFilter : true;
    const statusMatch = statusFilter ? item.status === statusFilter : true;
    return userMatch && statusMatch;
  });

  const columns = [
    { title: 'Sr. No.', dataIndex: 'srNo', key: 'srNo' },
    { title: 'User Category', dataIndex: 'userType', key: 'userType' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
    {
      title:'Query',
      dataIndex: 'query',
      key: 'query',
      render: (query) => {
        return <div>{query}</div>;
        },
    },
     {
      title: 'Query Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Pending') color = 'volcano';
        else if (status === 'Resolved') color = 'green';
        else if (status === 'In Progress') color = 'blue';

        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <h2>Help Desk Queries</h2>

      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by User Category"
          style={{ width: 200 }}
          allowClear
          value={userTypeFilter || undefined}
          onChange={(value) => setUserTypeFilter(value)}
        >
          <Option value="Consumer">Consumer</Option>
          <Option value="Generator">Generator</Option>
        </Select>

        <Select
          placeholder="Filter by Query Status"
          style={{ width: 200 }}
          allowClear
          value={statusFilter || undefined}
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Resolved">Resolved</Option>
          <Option value="In Progress">In Progress</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={true}
        bordered
        scroll={{ x: 'max-content' }}
        style={{backgroundColor:'white'}}
          rowClassName={() => 'white-row'}

      />
    </div>
  );
};

export default Help;
