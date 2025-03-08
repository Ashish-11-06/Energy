/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Row, Col, InputNumber,Checkbox, Tooltip, DatePicker, Form, Modal, Input, message } from 'antd';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addMonthData, addTableMonthData, fetchMonthAheadData, fetchTableMonthData } from '../../Redux/slices/consumer/monthAheadSlice';
import { updateNotificationData } from '../../Redux/slices/consumer/notificationSlice';
import { fetchRequirements } from "../../Redux/slices/consumer/consumerRequirementSlice";
import { addDayAheadData } from '../../Redux/slices/consumer/dayAheadSlice';

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
    const [consumerRequirement, setConsumerRequirement] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedRequirementId, setSelectedRequirementId] = useState(null);
      const [isModalVisible, setIsModalVisible] = useState(false);
      const [selectedTechnology, setSelectedTechnology] = useState([]);
    
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user')).user;
  const user_id = user.id;
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
        const id = user_id;
        const res = await dispatch(fetchRequirements(id)); // Wait for API response
        const states = res.payload.map(item => item.state);
        setConsumerRequirement(res.payload);
        console.log(res.payload);
      } catch (error) {
        console.log("Error fetching consumer requirements:", error);
      }
    };
    fetchData();
  }, [user_id, dispatch]);

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
         setTableDemandData(data.payload || []); // Ensure data is an array
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

  const handleModalOk = async () => {
    console.log("Selected State:", selectedState);
    console.log("Selected Requirement ID:", selectedRequirementId);
    const formattedDate = selectedDate.format('YYYY-MM-DD'); // Format the date correctly
    try {
      const newData = {
        requirement: selectedRequirementId,
        date: formattedDate,
        demand: Number(demand),
        price: selectedTechnology.reduce((acc, tech) => {
          acc[tech] = parseFloat(price[tech]); // Convert price to number
          return acc;
        }, {})
      };

      console.log(newData);

      const res = await dispatch(addMonthData(newData)).unwrap();
      console.log('res', res);
      setIsModalVisible(false);
      navigate('/px/consumer/trading');
    } catch (error) {
      console.log(error);
      message.error("Failed to submit data. Please try again.");
    }
  };

  useEffect(() => {
    const allFilled = demandData.every((item) => item.demand !== null);
    setAllFieldsFilled(allFilled);
  }, [demandData]);

  const handleAddData = async () => {
    setIsModalVisible(true);
    // const data = {
    //   Date: selectedDate ? selectedDate.format('DD-MM-YYYY') : '',
    //   demand: demand,
    //   price: price
    // };
  
    // try {
    //   const res = await dispatch(addTableMonthData(data)).unwrap();
    //   console.log('Response from addTableMonthData:', res);
    //   setDataAdded(true);
    //   if(res) {
    //     const fetchData = async () => {
    //       try {
    //         const data = await dispatch(fetchTableMonthData());
    //         console.log(data.payload); // Logging the fetched data
    //          setTableDemandData(data.payload || []); // Ensure data is an array
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     };
    //     fetchData();
    //   }
    //   // if (res) {
    //   //   console.log('Data added successfully');
  
    //   //   const message = `New demand added: ${demand}, Price: ${data.price} on date: ${data.Date}`;
  
    //   //   // Fetch the existing notification data from Redux state
    //   //   const notifications = store.getState().notificationData.notificationData || [];
        
    //   //   // Find the last ID and increment it
    //   //   const lastId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) : 0;
    //   //   const newId = lastId + 1;
  
    //   //   const notificationData = {
    //   //     id: newId, // Auto-incremented ID
    //   //     message: message,
    //   //   };
  
    //   //   // Dispatch updateNotificationData with new notification
    //   //   const notificationRes = await dispatch(updateNotificationData(notificationData)).unwrap();
    //   //   console.log('Notification Updated:', notificationRes);

    //   //   // Fetch the updated table data
    //   //   const updatedData = await dispatch(fetchTableMonthData()).unwrap();
    //   //   setTableDemandData(updatedData);

    //   //   // Enable the "Continue" button
       
    //   // }
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  };

  const handleStateChange = (value) => {
    setSelectedState(value);

    // Find the requirement ID of the selected state
    const selectedRequirement = consumerRequirement.find(item => item.state === value);
    setSelectedRequirementId(selectedRequirement ? selectedRequirement.id : null);
  };

  const handleNextTrade = () => {
    localStorage.setItem("monthTradeData", JSON.stringify(demandData));
    localStorage.setItem("selectedMonth", selectedMonth);
    localStorage.setItem("navigationSource", "PlanMonthTrading");
    navigate('/px/consumer/planning');
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
      <Col span={24}>
      <Form.Item label="Select Consumption Unit">
  <Select
    value={selectedState || undefined} // Ensures placeholder is visible when nothing is selected
    onChange={handleStateChange}
    style={{ width: "70%", borderColor: "#669800" }}
    placeholder="Select Consumption Unit" // Placeholder text
  >
    {consumerRequirement.map(item => (
      <Select.Option key={item.id} value={item.state}>
        {`State: ${item.state}, Industry: ${item.industry}, Contracted Demand: ${item.contracted_demand} MWh, Consumption Unit: ${item.consumption_unit}`}
      </Select.Option>
    ))}
  </Select>
</Form.Item>

      </Col>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 , marginLeft:'-400px'}}>
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
              setAllFieldsFilled(e.target.value !== '' && selectedDate !== null );
            }}
          />
        </div>

        {/* Price Input Section */}
        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
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
        </div> */}
      </div>

      <Col span={12}>
        <Table
          columns={columnsMonth}
          dataSource={Array.isArray(tableDemandData) ? tableDemandData : []}
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
      <Modal
        title="Select Technology"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        {/* Checkbox Group */}
        <Checkbox.Group onChange={(checkedValues) => setSelectedTechnology(checkedValues)} value={selectedTechnology}>
          <Checkbox value="Solar">"Solar"</Checkbox>
          <Checkbox value="Non-Solar">"Non-Solar"</Checkbox>
        </Checkbox.Group>

        {/* Input fields for price */}
        <div style={{ marginTop: "15px" }}>
          {selectedTechnology.includes("Solar") && (
            <div>
              <label style={{ fontWeight: "bold" }}>Enter Solar Price:</label>
              <Input
                type="number"
                placeholder="Enter solar price in INR"
                value={price["Solar"] || ""}
                min={0}
                onChange={(e) => setPrice({ ...price, "Solar": e.target.value })}
                style={{ marginTop: "5px", width: "100%" }}
              />
            </div>
          )}
          {selectedTechnology.includes("Non-Solar") && (
            <div>
              <label style={{ fontWeight: "bold" }}>Enter Non-Solar Price:</label>
              <Input
                type="number"
                placeholder="Enter non-solar price in INR"
                value={price["Non-Solar"] || ""}
                min={0}
                onChange={(e) => setPrice({ ...price, "Non-Solar": e.target.value })}
                style={{ marginTop: "5px", width: "100%" }}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PlanMonthTrading;
