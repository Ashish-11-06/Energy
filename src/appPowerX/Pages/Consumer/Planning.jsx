import React, { useState, useEffect } from 'react';
import { Table, Calendar, Card, Row, Col, Tooltip, Button } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import moment from 'moment';
import { fetchTableMonthData } from '../../Redux/slices/consumer/monthAheadSlice';
import { useDispatch } from 'react-redux';
import './Planning.css'; // Import custom CSS for calendar styling

const columns = [
  {
    title: 'Date',
    dataIndex: 'Date',
    key: 'Date',
  },
  {
    title: 'Demand (MW)',
    dataIndex: 'demand',
    key: 'demand',
  },
  {
    title: 'Price (INR)',
    dataIndex: 'price',
    key: 'price',
  },
];

const Planning = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [tableDemandData, setTableDemandData] = useState([]);
  const dispatch = useDispatch();

  const onSelect = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchTableMonthData());
        console.log(data.payload); // Logging the fetched data
        setTableDemandData(data.payload);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);

  const getListData = (value) => {
    const dateStr = value.format('DD-MM-YYYY');
    return tableDemandData.filter(item => item.Date === dateStr);
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <div className="events">
        {listData.map(item => (
          <Tooltip key={item.id} title={`Demand: ${item.demand} MW, Price: ${item.price} INR`}>
            <div className="event-dot" style={{ backgroundColor: '#669800', borderRadius: '50%', width: '8px', height: '8px', display: 'inline-block' }} />
          </Tooltip>
        ))}
      </div>
    );
  };

  const handleToggleView = () => {
    setShowTable(!showTable);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Planning Calender</h1>
      <Row gutter={[0, 20]} justify="center">
        <Button style={{ marginLeft: '79%' }} onClick={handleToggleView}>
          {showTable ? 'Show Calendar' : 'Show Table'}
        </Button>
        {!showTable ? (
          <Col span={24} style={{ textAlign: 'center', marginLeft: '10%' }}>
            <Card style={{ width: '90%', height: '70vh', alignItems: 'center', padding: '10px' }}>
              <Calendar
                style={{ height: 'full' }}
                fullscreen={false}
                onSelect={onSelect}
                dateCellRender={dateCellRender}
                className="custom-calendar"
                bordered
              />
            </Card>
          </Col>
        ) : (
          <Col span={24}>
            <Card style={{ width: '90%', marginLeft: '5%' }}>
              <Table dataSource={tableDemandData} columns={columns} pagination={false} bordered />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Planning;
