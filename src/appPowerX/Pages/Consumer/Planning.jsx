import React, { useState } from 'react';
import { Table, Calendar, Card, Row, Col } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles

const dataSource = [
  {
    key: '1',
    date: '18-09-23',
    demand: 200,
    price: 200,
  },
  {
    key: '2',
    date: '20-09-23',
    demand: 100,
    price: 200,
  },
  {
    key: '3',
    date: '25-09-23',
    demand: 150,
    price: 200,
  },
  {
    key: '4',
    date: '27-09-23',
    demand: 100,
    price: 200,
  },
  {
    key: '5',
    date: '30-09-23',
    demand: 100,
    price: 200,
  },
];

const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Demand',
    dataIndex: 'demand',
    key: 'demand',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
];

const Planning = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const onSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[0, 20]} justify="center">
        <Col span={24} style={{ textAlign: 'center' }}>
          <Card style={{ width: '60%' }}>
            <Calendar fullscreen={false} onSelect={onSelect} />
          </Card>
        </Col>
        <Col span={24}>
          <Card style={{ width: '100%' }}>
            <Table dataSource={dataSource} columns={columns} pagination={false}/>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Planning;
