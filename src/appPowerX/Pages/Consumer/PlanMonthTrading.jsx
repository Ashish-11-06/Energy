import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Row, Col, Card, InputNumber, Tooltip, DatePicker } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addTableMonthData, fetchMonthAheadData, fetchTableMonthData } from '../../Redux/slices/consumer/monthAheadSlice';
import { updateNotificationData } from '../../Redux/slices/consumer/notificationSlice';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, ChartTooltip, Legend);

const { Option } = Select;

const PlanMonthTrading = () => {
  const [tableData, setTableData] = useState('');
  const [tableDemandData, setTableDemandData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [demand, setDemand] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [demandData, setDemandData] = useState([]);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [demandRequire, setDemandRequire] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (value) => {
    setSelectedMonth(value);
    generateDemandData(value);
  };

  const generateDemandData = (month) => {
    const daysInMonth = new Date(2023, new Date(Date.parse(month + " 1, 2023")).getMonth() + 1, 0).getDate();
    const data = Array.from({ length: daysInMonth }, (_, index) => ({
      key: index + 1,
      date: `${index + 1}`,
      demand: null,
    }));
    setDemandData(data);
  };

  useEffect(() => {
    generateDemandData(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchMonthAheadData());
        console.log(data.payload); // Logging the fetched data
        setTableData(data.payload);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);

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
console.log(tableDemandData);


  const handleInputChange = (value, key) => {
    const newData = [...demandData];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index].demand = value;
      setDemandData(newData);
    }
  };

  useEffect(() => {
    const allFilled = demandData.every((item) => item.demand !== null);
    setAllFieldsFilled(allFilled);
  }, [demandData]);

  const handleNextTrade = async () => {
    const data = {
      Date: selectedDate ? selectedDate.format('DD-MM-YYYY') : '',
      demand: demand,
      price: '1200'
    };
  
    try {
      const res = await dispatch(addTableMonthData(data)).unwrap();
      console.log('Response from addTableMonthData:', res);
  
      if (res) {
        console.log('hii');
  
        const message = `New demand added: ${demand}, Price: ${data.price} on date: ${data.Date}`;
  
        // Fetch the existing notification data from Redux state
        const notifications = store.getState().notificationData.notificationData || [];
        
        // Find the last ID and increment it
        const lastId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) : 0;
        const newId = lastId + 1;
  
        const notificationData = {
          id: newId, // Auto-incremented ID
          message: message,
        };
  
        // Dispatch updateNotificationData with new notification
        const notificationRes = await dispatch(updateNotificationData(notificationData)).unwrap();
        console.log('Notification Updated:', notificationRes);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    localStorage.setItem("monthTradeData", JSON.stringify(demandData));
    localStorage.setItem("selectedMonth", selectedMonth);
    localStorage.setItem("navigationSource", "PlanMonthTrading");
    navigate('/px/consumer/trading');
  };
  

  const data = {
    labels: [1, 2, 3, 4, 5, 6, 7, 8], // Updated X-axis labels
    datasets: [
      {
        label: 'MCP (INR/MWh)', // Label for MCP dataset
        data: [2000, 5000, 4000, 2000, 1300, 2900, 3100, 1000], // Updated data for MCP
      },
      {
        label: 'MCV (MWh)', // Label for MCY dataset
        data: [3000, 3000, 3000, 2088, 2341, 1020, 2000, 3200], // Updated data for MCY
      },
    ],
  };

  const columns = [
    {
      title: 'Details',
      dataIndex: 'metric',
      key: 'metric',
    },
    {
      title: 'MCP (INR/MWh)',
      dataIndex: 'mcp',
      key: 'mcp',
    },
    {
      title: 'MCV (MWh)',
      dataIndex: 'mcy',
      key: 'mcy',
    },
  ];


  const columnsMonth = [
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: "Demand",
      dataIndex: "demand",
      key: "demand",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

//   const tableMonthData = [
//     {
//       key: "1",
//       Date: "13-02-2025",
//       demand: 1500,
//       price:200
//     },
//     {
//       key: "2",
//       Date: "13-02-2025",
//       demand: 1400,
//       price:100
//     },
//     {
//       key: "3",
//       Date: "13-02-2025",
//       demand: 1300,
//       price:200
//     },
//     {
//       key: "4",
//       Date: "13-02-2025",
//       demand: 1200,
//       price:300
//     },
//     {
//       key: "5",
//       Date: "13-02-2025",
//       demand: 1100,
//       price:200
//     },
//     {
//       key: "6",
//       Date: "13-02-2025",
//       demand: 1050,
//       price:350
//     },
//   ];


  const demandColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Demand (MW)',
      dataIndex: 'demand',
      key: 'demand',
      render: (_, record) => (
        <InputNumber
          value={record.demand}
          onChange={(value) => handleInputChange(value, record.key)}
          style={{ width: '100%' }}
          min={0}
        />
      ),
    },
  ];

  const splitData = (data) => {
    const third = Math.ceil(data.length / 3);
    return [
      data.slice(0, third),
      data.slice(third, third * 2),
      data.slice(third * 2),
    ];
  };

  const [part1, part2, part3] = splitData(demandData);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Plan Your Trade</h1>
      {/* <div style={{display:'flex', direction:'row'}}>
      <h1 style={{marginRight:'3%', fontSize:'18px'}}>Select Month: </h1>
      <Select defaultValue="January" placeholder="Select Month" style={{ width: 200, marginBottom: '30px' }} onChange={handleChange}>
        <Option value="January">January</Option>
        <Option value="February">February</Option>
        <Option value="March">March</Option>
        <Option value="April">April</Option>
        <Option value="May">May</Option>
        <Option value="June">June</Option>
        <Option value="July">July</Option>
        <Option value="August">August</Option>
        <Option value="September">September</Option>
        <Option value="October">October</Option>
        <Option value="November">November</Option>
        <Option value="December">December</Option>
      </Select>
      </div> */}
<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
  <label htmlFor="" style={{ width: 120,  marginRight: '0px', fontSize: '18px' }}>
    Select Date:
  </label>

  <DatePicker
    style={{ width: "10%" }}
    format="DD/MM/YYYY"
    disabledDate={(current) => {
      return current && current <= new Date(); // Disable today and all past dates
    }}
    onChange={(date) => setSelectedDate(date)}
  />

  <span style={{fontSize:'18px', marginLeft:'5%'}}>Enter Demand</span>

  <input
    type="number"
    placeholder="Enter demand"
    style={{
      width: "25%",
      padding: "5px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    }}
    onChange={(e) => {
      setDemand(e.target.value);
      setDemandRequire(e.target.value !== '');
    }}
  />
</div>

      {/* <p style={{fontSize:'18px'}}>Fill the details for month : <span style={{fontWeight:'bold',fontSize:'18px'}}>{selectedMonth}</span></p> */}

      {/* <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={8}>
          <Table dataSource={part1} columns={demandColumns} pagination={false} bordered size="small" />
        </Col>
        <Col span={8}>
          <Table dataSource={part2} columns={demandColumns} pagination={false} bordered size="small" />
        </Col>
        <Col span={8}>
          <Table dataSource={part3} columns={demandColumns} pagination={false} bordered size="small" />
        </Col>
      </Row> */}

<Col span={12}>
          <Table
            columns={columnsMonth}
            dataSource={tableDemandData}
            pagination={false}
            bordered
            style={{
              width: '100%', // Set width to 100% so it fills the column
              marginLeft:'40%',
              marginTop:'30px',
              overflowY: 'auto', // Makes the table scrollable
            }}
          />
        </Col>

      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col style={{ marginLeft: '90%' }}>
            {/* <Tooltip title={!allFieldsFilled ? "All fields are required" : ""} placement="top">
              <Button onClick={handleNextTrade} disabled={!allFieldsFilled}>
                Continue
              </Button>
            </Tooltip> */}
             <Tooltip title={!demandRequire ? "Please enter the demand" : ""} placement="top">
              <Button onClick={handleNextTrade} disabled={!demandRequire}>
                Continue
              </Button>
            </Tooltip>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PlanMonthTrading;
