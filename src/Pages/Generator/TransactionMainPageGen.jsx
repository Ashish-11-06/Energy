import React from 'react';
import { Table, Button, Card, Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const TransactionMainPageGen = () => {
  const navigate = useNavigate();

  const transactions = [
    { key: 1, name: 'Transaction 1' },
    { key: 2, name: 'Transaction 2' },
    { key: 3, name: 'Transaction 3' },
  ];

  const columns = [
    {
      title: 'Sr No',
      dataIndex: 'key',
    },
    {
      title: 'Transaction',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: () => <span>2021-09-30</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => navigate(`/generator/transaction-window/${record.key}`)}>
          View
        </Button>
      ),
    },
  ];





  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="center" style={{ marginBottom: '20px' }}>
        <Col>
          <Title level={2} style={{ textAlign: 'center', color: '#001529' }}>
            Transactions
          </Title>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          <Card
            style={{
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#ffffff',
            }}
          >
            <Table
              dataSource={transactions}
              columns={columns}
              pagination={false}
              bordered
              style={{ marginTop: '20px' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TransactionMainPageGen;
