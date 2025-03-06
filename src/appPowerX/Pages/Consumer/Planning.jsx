// import { useState, useEffect } from 'react';
// import { Table, Calendar, Card, Row, Col, Tooltip, Button, Spin } from 'antd';
// import 'antd/dist/reset.css'; // Import Ant Design styles
// import { fetchTableMonthData } from '../../Redux/slices/consumer/monthAheadSlice';
// import { useDispatch } from 'react-redux';
// import './Planning.css'; // Import custom CSS for calendar styling

// const columns = [
//   {
//     title: 'Date',
//     dataIndex: 'Date',
//     key: 'Date',
//   },
//   {
//     title: 'Demand (MW)',
//     dataIndex: 'demand',
//     key: 'demand',
//   },
//   {
//     title: 'Price (INR)',
//     dataIndex: 'price',
//     key: 'price',
//   },
// ];

// const Planning = () => {
//   const [showTable, setShowTable] = useState(false);
//   const [tableDemandData, setTableDemandData] = useState([]);
//   const [loading, setLoading] = useState(true); // State for loading spinner
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await dispatch(fetchTableMonthData());
//         console.log(data.payload); // Logging the fetched data
//         setTableDemandData(data.payload);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false); // Set loading to false after data is fetched
//       }
//     };
//     fetchData();
//   }, [dispatch]);

//   const getListData = (value) => {
//     const dateStr = value.format('DD-MM-YYYY');
//     return tableDemandData.filter(item => item.Date === dateStr);
//   };

//   const dateCellRender = (value) => {
//     const listData = getListData(value);
//     return (
//       <div className="events">
//         {listData.map(item => (
//           <Tooltip key={item.id} title={`Demand: ${item.demand} MW, Price: ${item.price} INR`}>
//             <div className="event-dot" style={{ backgroundColor: '#669800', borderRadius: '50%', width: '8px', height: '8px', display: 'inline-block' }} />
//           </Tooltip>
//         ))}
//       </div>
//     );
//   };

//   const handleToggleView = () => {
//     setShowTable(!showTable);
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Planning Calendar</h1>
//       <Row gutter={[0, 20]} justify="center">
//         <Button style={{ marginLeft: '79%' }} onClick={handleToggleView}>
//           {showTable ? 'Show Calendar' : 'Show Table'}
//         </Button>
//         {loading ? (
//           <Spin tip="Loading..." style={{ marginTop: '20px' }} />
//         ) : !showTable ? (
//           <Col span={24} style={{ textAlign: 'center', marginLeft: '10%' }}>
//             <Card style={{ width: '90%', height: '70vh', alignItems: 'center', padding: '10px' }}>
//               <Calendar
//                 style={{ height: 'full' }}
//                 fullscreen={false}
//                 dateCellRender={dateCellRender}
//                 className="custom-calendar"
//                 bordered
//               />
//             </Card>
//           </Col>
//         ) : (
//           <Col span={24}>
//             <Card style={{ width: '90%', marginLeft: '5%' }}>
//               <Table dataSource={tableDemandData} columns={columns} pagination={false} bordered />
//             </Card>
//           </Col>
//         )}
//       </Row>
//     </div>
//   );
// };

// export default Planning;

// import { useState, useEffect } from 'react';
// import { Table, Calendar, Card, Row, Col, Tooltip, Button, Spin, message } from 'antd';
// import 'antd/dist/reset.css';
// import { LeftOutlined, RightOutlined } from '@ant-design/icons';
// import { fetchTableMonthData } from '../../Redux/slices/consumer/monthAheadSlice';
// import { useDispatch } from 'react-redux';
// import dayjs from 'dayjs';
// import 'dayjs/locale/en'; // Import English locale
// dayjs.locale('en'); // Set it as the default locale
// import enUS from 'antd/es/calendar/locale/en_US';

// import './Planning.css';

// const columns = [
//   { title: 'Date', dataIndex: 'Date', key: 'Date' },
//   { title: 'Day', dataIndex: 'day', key: 'day' },
//   { title: 'Demand (MW)', dataIndex: 'demand', key: 'demand' },
//   { title: 'Price (INR)', dataIndex: 'price', key: 'price' },
// ];

// const Planning = () => {
//   const [showTable, setShowTable] = useState(false);
//   const [tableDemandData, setTableDemandData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentMonth, setCurrentMonth] = useState(dayjs());
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await dispatch(fetchTableMonthData());
//         const updatedData = data.payload.map(item => ({
//           ...item,
//           day: dayjs(item.Date, 'DD-MM-YYYY').format('ddd'), // Extract day name
//         }));
//         setTableDemandData(updatedData);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [dispatch]);

//   const getListData = (value) => {
//     const dateStr = value.format('DD-MM-YYYY');
//     return tableDemandData.filter(item => item.Date === dateStr);
//   };

//   const dateCellRender = (value) => {
//     const listData = getListData(value);
//     const isToday = value.isSame(dayjs(), 'day'); // Check if the date is today
  
//     return (
//       <div
//         className="events"
//         style={{
//           position: 'relative',
//           padding: '5px',
//           textAlign: 'center',
//           borderRadius: '50%', // Circular shape for today's date
//           border: isToday ? '2px solid #1890ff' : 'none', // Highlight today with a blue border
//           width: '30px',
//           height: '30px',
//           lineHeight: '30px',
//           margin: 'auto',
//         }}
//       >
//         {listData.map(item => (
//           <Tooltip key={item.id} title={`Demand: ${item.demand} MW, Price: ${item.price} INR`}>
//             <div
//               className="event-dot"
//               style={{
//                 backgroundColor: '#669800',
//                 borderRadius: '50%',
//                 width: '8px',
//                 height: '8px',
//                 display: 'inline-block',
//                 position: 'absolute',
//                 bottom: '3px',
//                 left: '50%',
//                 transform: 'translateX(-50%)',
//               }}
//             />
//           </Tooltip>
//         ))}
//       </div>
//     );
//   };
  
//   const handleToggleView = () => {
//     setShowTable(!showTable);
//   };

//   const handlePrevMonth = () => {
//     setCurrentMonth(currentMonth.subtract(1, 'month'));
//   };

//   const handleNextMonth = () => {
//     const nextMonthLimit = dayjs().add(1, 'month');
//     if (currentMonth.isBefore(nextMonthLimit, 'month')) {
//       setCurrentMonth(currentMonth.add(1, 'month'));
//     } else {
//       message.warning('You can plan for the current month only');
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <Row justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
//         <h1 style={{ margin: 0 }}>Planning Calendar</h1>
//         <Button onClick={handleToggleView}>{showTable ? 'Show Calendar' : 'Show Table'}</Button>
//       </Row>
//       {loading ? (
//         <Spin tip="Loading..." style={{ marginTop: '20px' }} />
//       ) : !showTable ? (
//         <Col span={24}>
//           <Card style={{ width: '90%', margin: 'auto', padding: '10px', position: 'relative' }}>
//             <Row justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
//               <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
//               <h2>{currentMonth.format('MMMM YYYY')}</h2>
//               <Tooltip title="You can plan for the current month only">
//                 <Button icon={<RightOutlined />} onClick={handleNextMonth} />
//               </Tooltip>
//             </Row>
//             <Calendar
//                 value={currentMonth}
//                 fullscreen={false}
//                 dateCellRender={dateCellRender}
//                 className="custom-calendar"
//                 headerRender={() => null}
//                 locale={enUS} // Ensure this is correctly applied
//             />
//           </Card>
//         </Col>
//       ) : (
//         <Col span={24}>
//           <Card style={{ width: '90%', margin: 'auto' }}>
//             <Table dataSource={tableDemandData} columns={columns} pagination={false} bordered />
//           </Card>
//         </Col>
//       )}
//       <Button type="primary" style={{ position: 'fixed', right: '20px', bottom: '20px' }}>
//         Plan for More Days
//       </Button>
//     </div>
//   );
// };

// export default Planning;


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

dayjs.locale('en');

const columns = [
  { title: 'Date', dataIndex: 'Date', key: 'Date' },
  { title: 'Day', dataIndex: 'day', key: 'day' },
  { title: 'Demand (MW)', dataIndex: 'demand', key: 'demand' },
  { title: 'Price (INR)', dataIndex: 'price', key: 'price' },
];

const Planning = () => {
  const navigate = useNavigate();
  const [showTable, setShowTable] = useState(false);
  const [tableDemandData, setTableDemandData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchTableMonthData());
        const updatedData = data.payload.map(item => ({
          ...item,
          day: dayjs(item.Date, 'DD-MM-YYYY').format('ddd'),
        }));
        setTableDemandData(updatedData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const getListData = (date) => {
    const dateStr = dayjs(date).format('DD-MM-YYYY');
    return tableDemandData.filter(item => item.Date === dateStr);
  };

  const tileContent = ({ date }) => {
    const listData = getListData(date);
    const isToday = dayjs(date).isSame(dayjs(), 'day');

    return (
      <div style={{ position: 'relative', textAlign: 'center' }}>
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
          <Tooltip key={item.id} title={`Demand: ${item.demand} MW, Price: ${item.price} INR`}>
            <div
              style={{
                backgroundColor: '#669800',
                borderRadius: '50%',
                width: '8px',
                height: '8px',
                display: 'inline-block',
                position: 'absolute',
                bottom: '3px',
                left: '50%',
                transform: 'translateX(-50%)',
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
            <Table dataSource={tableDemandData} columns={columns} pagination={false} bordered />
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
