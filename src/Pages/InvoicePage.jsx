import React from 'react';
import { Table, Tag, Button } from 'antd';
import './InvoicePage.css';

const invoices = [
  { id: 1, date: '2023-01-01', amount: '100', status: 'Paid' },
  { id: 2, date: '2023-02-01', amount: '150', status: 'Pending' },
  { id: 3, date: '2023-03-01', amount: '200', status: 'Paid' },
  // Add more invoices as needed
];

const columns = [
  {
    title: 'Invoice ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Amount (INR)',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: status => (
      <Tag color={status === 'Paid' ? 'green' : 'volcano'}>
        {status.toUpperCase()}
      </Tag>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <Button type="primary" onClick={() => viewInvoice(record.id)}>
        View
      </Button>
    ),
  },
];

const viewInvoice = (id) => {
  // Implement the logic to view the invoice details
  console.log(`Viewing invoice ${id}`);
};

const InvoicePage = () => {
  return (
    <div className="invoice-page">
      <h1>Invoices</h1>
      <Table dataSource={invoices} columns={columns} rowKey="id" />
    </div>
  );
};

export default InvoicePage;
