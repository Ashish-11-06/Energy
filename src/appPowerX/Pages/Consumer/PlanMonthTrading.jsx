import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Row, Col, InputNumber, Tooltip, DatePicker } from 'antd';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addTableMonthData, fetchMonthAheadData, fetchTableMonthData } from '../../Redux/slices/consumer/monthAheadSlice';
import { updateNotificationData } from '../../Redux/slices/consumer/notificationSlice';

const { Option } = Select;

const PlanMonthTrading = () => {
  const [tableData, setTableData] = useState('');
  const [tableDemandData, setTableDemandData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [demand, setDemand] = useState('');
  const [price, setPrice] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [demandData, setDemandData] = useState([]);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [dataAdded, setDataAdded] = useState(false);
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

  const handleAddData = async () => {
    const data = {
      Date: selectedDate ? selectedDate.format('DD-MM-YYYY') : '',
      demand: demand,
      price: price
    };
  
    try {
      const res = await dispatch(addTableMonthData(data)).unwrap();
      console.log('Response from addTableMonthData:', res);
      setDataAdded(true);
      if (res) {
        console.log('Data added successfully');
  
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

        // Fetch the updated table data
        const updatedData = await dispatch(fetchTableMonthData()).unwrap();
        setTableDemandData(updatedData);

        // Enable the "Continue" button
       
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNextTrade = () => {
    localStorage.setItem("monthTradeData", JSON.stringify(demandData));
    localStorage.setItem("selectedMonth", selectedMonth);
    localStorage.setItem("navigationSource", "PlanMonthTrading");
    navigate('/px/consumer/trading');
  };

  const columnsMonth = [
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: "Demand (MWh)",
      dataIndex: "demand",
      key: "demand",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Plan Your Trade</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px', flexWrap: 'nowrap' }}>
        {/* Date Picker Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1 }}>
          <label htmlFor="" style={{ minWidth: '100px', fontSize: '16px' }}>
            Select Date:
          </label>
          <DatePicker
            style={{ width: "150px", fontSize: '16px' }}
            format="DD/MM/YYYY"
            disabledDate={(current) => current && current <= new Date()}
            onChange={(date) => setSelectedDate(date)}
          />
        </div>

        {/* Demand Input Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <label style={{ minWidth: '100px', fontSize: '16px' }}>Enter Demand <span style={{fontSize:'12px'}}>(MWh)</span>:</label>
          <input
            type="number"
            placeholder="Enter demand"
            min={0}
            style={{
              width: "150px",
              padding: "5px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
            onChange={(e) => {
              setDemand(e.target.value);
              setAllFieldsFilled(e.target.value !== '' && selectedDate !== null && price !== '');
            }}
          />
        </div>

        {/* Price Input Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <label style={{ minWidth: '100px', fontSize: '16px' }}>Enter Price <span style={{fontSize:'12px'}}>(INR)</span>:</label>
          <input
            type="number"
            placeholder="Enter price"
            style={{
              width: "150px",
              padding: "5px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
            onChange={(e) => {
              setPrice(e.target.value);
              setAllFieldsFilled(e.target.value !== '' && selectedDate !== null && demand !== '');
            }}
          />
        </div>
      </div>

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
          <Col style={{ marginLeft: '80%' }}>
            <Tooltip title={!allFieldsFilled ? "All fields are required" : ""} placement="top">
              <Button onClick={handleAddData} disabled={!allFieldsFilled}>
                Add Data
              </Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title={!dataAdded ? "Add data before continuing" : ""} placement="top">
              <Button onClick={handleNextTrade} disabled={!dataAdded}>
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
