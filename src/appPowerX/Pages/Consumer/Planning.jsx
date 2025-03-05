import { useState, useEffect } from 'react';
import { Table, Calendar, Card, Row, Col, Tooltip, Button, Spin } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
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
  const [showTable, setShowTable] = useState(false);
  const [tableDemandData, setTableDemandData] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading spinner
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchTableMonthData());
        console.log(data.payload); // Logging the fetched data
        setTableDemandData(data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
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
      <h1>Planning Calendar</h1>
      <Row gutter={[0, 20]} justify="center">
        <Button style={{ marginLeft: '79%' }} onClick={handleToggleView}>
          {showTable ? 'Show Calendar' : 'Show Table'}
        </Button>
        {loading ? (
          <Spin tip="Loading..." style={{ marginTop: '20px' }} />
        ) : !showTable ? (
          <Col span={24} style={{ textAlign: 'center', marginLeft: '10%' }}>
            <Card style={{ width: '90%', height: '70vh', alignItems: 'center', padding: '10px' }}>
              <Calendar
                style={{ height: 'full' }}
                fullscreen={false}
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
