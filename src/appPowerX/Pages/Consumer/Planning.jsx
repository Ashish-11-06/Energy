/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Tooltip, Button, Spin, message } from 'antd';
import 'antd/dist/reset.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { fetchTableMonthData } from '../../Redux/slices/consumer/monthAheadSlice';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Planning.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchPlanningData } from '../../Redux/slices/consumer/planningSlice';

dayjs.locale('en');

const columns = [
  { title: 'Date', dataIndex: 'date', key: 'date', rowSpan: 2 },
  { title: 'Demand (MWh)', dataIndex: 'demand', key: 'demand', rowSpan: 2 },
  { title: 'Technology & Price (INR)', dataIndex: 'technology', key: 'technology' },
];

const Planning = () => {
  const navigate = useNavigate();
  const [showTable, setShowTable] = useState(false);
  const [tableDemandData, setTableDemandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dispatch = useDispatch();
  const user_id = Number(JSON.parse(localStorage.getItem('user')).user.id);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const id = user_id; // Ensure `user_id` is defined in scope
      try {
        const res = await dispatch(fetchPlanningData(id));
        console.log(res.payload);
        setTableDemandData(res.payload);
      } catch (error) {
        console.error("Error fetching planning data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the function inside useEffect
  }, [user_id, dispatch]); // Add dependencies if needed

  const getListData = (date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    return tableDemandData.filter(item => item.date === dateStr);
  };

  const tileContent = ({ date }) => {
    const listData = getListData(date);
    const isToday = dayjs(date).isSame(dayjs(), 'day');

    return (
      <div style={{ position: 'relative', textAlign: 'center' ,marginTop:'15px'}}>
        {isToday && (
          <div
            style={{
              position: 'absolute',
              top: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1890ff',
            }}
          >
            ●
          </div>
        )}
        {listData.map(item => (
          <Tooltip style={{marginTop:'3%'}} key={item.id} title={`Demand: ${item.demand} MWh, Solar Price: ${item.price.Solar} INR, Non-Solar Price: ${item.price["Non-Solar"]} INR`}>
            <div
              style={{
                backgroundColor: '#669800',
                borderRadius: '50%',
                width: '10px',
                height: '10px',
                display: 'inline-block',
                position: 'absolute',
                bottom: '3px',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop:'10px'
              }}
            />
          </Tooltip>
        ))}
      </div>
    );
  };

  const handleToggleView = () => {
    setShowTable(!showTable);
  };

  const tableData = tableDemandData.map(item => ({
    key: item.requirement,
    date: item.date,
    demand: item.demand,
    technology: `Solar: ${item.price.Solar} INR, Non-Solar: ${item.price["Non-Solar"]} INR`,
    price: `${item.price.Solar} INR (Solar), ${item.price["Non-Solar"]} INR (Non-Solar)`,
  }));

  const handlePrevMonth = () => {
    setCurrentMonth(dayjs(currentMonth).subtract(1, 'month').toDate());
  };

  const handleNextMonth = () => {
    const nextMonthLimit = dayjs().add(1, 'month');
    if (dayjs(currentMonth).isBefore(nextMonthLimit, 'month')) {
      setCurrentMonth(dayjs(currentMonth).add(1, 'month').toDate());
    } else {
      message.warning('You can plan for the current month only');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
        <h1 style={{ margin: 0 }}>Planning Calendar</h1>
        <Button onClick={handleToggleView}>{showTable ? 'Show Calendar' : 'Show Table'}</Button>
      </Row>
      {loading ? (
        <Spin tip="Loading..." style={{ marginTop: '20px' }} />
      ) : !showTable ? (
        <Col span={24}>
          <Card style={{ width: '90%', margin: 'auto', padding: '10px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
              <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
              <h2>{dayjs(currentMonth).format('MMMM YYYY')}</h2>
              <Tooltip title="You can plan for the current month only">
                <Button icon={<RightOutlined />} onClick={handleNextMonth} />
              </Tooltip>
            </Row>
            <Calendar
              value={currentMonth}
              onActiveStartDateChange={({ activeStartDate }) => setCurrentMonth(activeStartDate)}
              tileContent={tileContent}
              className="custom-calendar"
            />
          </Card>
        </Col>
      ) : (
        <Col span={24}>
          <Card style={{ width: '90%', margin: 'auto' }}>
            <Table dataSource={tableData} columns={columns} pagination={false} bordered />
          </Card>
        </Col>
      )}
      <Button 
        type="primary" 
        style={{ position: 'fixed', right: '20px', bottom: '20px' }}
        onClick={() => navigate('/consumer/plan-month-trade')} 
      >
        Plan for More Days
      </Button>
    </div>
  );
};

export default Planning;
