/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Tooltip, Button, Spin, message, Form, Select, DatePicker, Input, Modal, Checkbox, Radio, Upload } from 'antd';
import 'antd/dist/reset.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { fetchTableMonthData } from '../../Redux/slices/consumer/monthAheadSlice'; // Correct import
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { Calendar as AntdCalendar } from 'antd'; // Import Ant Design Calendar
import './Planning.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchPlanningData } from '../../Redux/slices/consumer/planningSlice';
import { fetchRequirements } from "../../Redux/slices/consumer/consumerRequirementSlice";
import { addMonthData } from '../../Redux/slices/consumer/monthAheadSlice';
import { color } from 'framer-motion';

dayjs.locale('en');

const Planning = () => {
  const navigate = useNavigate();
  const [showTable, setShowTable] = useState(true); // Set default to true
  const [showInputFields, setShowInputFields] = useState(false); // State to manage input fields visibility
  const [selectedState, setSelectedState] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [demand, setDemand] = useState("");
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [consumerRequirement, setConsumerRequirement] = useState([]);
  const [tableDemandData, setTableDemandData] = useState([]); // Ensure it's initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [price, setPrice] = useState({});
  const [selectedTechnology, setSelectedTechnology] = useState([]);
  const dispatch = useDispatch();
  const user_id = Number(JSON.parse(localStorage.getItem('user')).user.id);
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
  const [isInputModalVisible, setIsInputModalVisible] = useState(false); // Separate state for input modal
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedUnitDetails, setSelectedUnitDetails] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState(null); // Add state for selected interval
  const [startDate, setStartDate] = useState(null); // Add state for start date
  const [endDate, setEndDate] = useState(null); // Add state for end date
const [requirementId, setRequirementId] = useState([]);
  const handleDateIntervalChange = (value) => {
    setSelectedInterval(value);
    if (value === 'today') {
      setSelectedDate(dayjs());
    } else if (value === 'tomorrow') {
      setSelectedDate(dayjs().add(1, 'day'));
    } else if (value === 'next15days' || value === 'next30days') {
      setStartDate(null); // Reset start date
      setEndDate(null); // Reset end date
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const id = user_id; // Ensure `user_id` is defined in scope
      try {
        const res = await dispatch(fetchPlanningData(id));
        // console.log(res.payload);
        setTableDemandData(res.payload);
        setRequirementId(res.payload.map(item => item.requirement));
      } catch (error) {
        // console.error("Error fetching planning data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the function inside useEffect
  }, [user_id, dispatch]); // Add dependencies if needed
// console.log(requirementId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = user_id;
        const res = await dispatch(fetchRequirements(id)); // Wait for API response
        setConsumerRequirement(res.payload);
        // console.log(res.payload);  
      } catch (error) {
        // console.log("Error fetching consumer requirements:", error);
      }
    };
    fetchData();
  }, [user_id, dispatch]);

  const getListData = (date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    if (!Array.isArray(tableDemandData)) return []; // Ensure tableDemandData is an array
    return tableDemandData.filter(item => item.date === dateStr);
  };

  const tileContent = (value) => {
    // console.log('date clicked');
    
    const date = value.toDate();
    const listData = getListData(date);
    const isToday = dayjs(date).isSame(dayjs(), 'day');
    const isPastDate = dayjs(date).isBefore(dayjs(), 'day');
  
    return (
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          marginTop: '15px',
          cursor: isPastDate ? 'not-allowed' : 'pointer',
          opacity: isPastDate ? 0.5 : 1,
        }}
        onClick={() => {
          if (!isPastDate) {
            setSelectedDate(dayjs(date)); // Set the selected date
            setIsModalVisible(true); // Open the "Select Technology" modal
          }
        }}
      >
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
          <Tooltip
            key={item.id}
            title={`Demand: ${item.demand} MWh, Solar Price: ${item.price.Solar} INR/MWh, Non-Solar Price: ${item.price["Non-Solar"]} INR/MWh`}
          >
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
                marginTop: '10px',
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

  const handleAddDetailsClick = () => {
    setIsInputModalVisible(true); // Show input modal when button is clicked
  };

  const handleStateChange = (value) => {
    const selectedRequirement = consumerRequirement.find(item => item.state === value);
    // console.log(selectedRequirement);
    
    setSelectedRequirementId(selectedRequirement ? selectedRequirement.id : null);

    setSelectedState(value);
  };

  const handleAddData = () => {
    setIsInputModalVisible(false); // Hide input modal
    setIsModalVisible(true); // Show technology modal
  };

  const handleModalOk = async () => {
    if (!selectedRequirementId) {
      message.error("Please select a valid consumption unit.");
      return;
    }

    const formattedDate = selectedDate.format('YYYY-MM-DD'); // Format the date correctly
    try {
      const newData = {
        requirement: selectedRequirementId,
        date: formattedDate,
        demand: Number(demand),
        price: (Array.isArray(selectedTechnology) ? selectedTechnology : [selectedTechnology]).reduce((acc, tech) => { 
          acc[tech] = parseFloat(price[tech]); // Convert price to number
          return acc;
        }, {})
      };

      // console.log(newData);

      const res = await dispatch(addMonthData(newData)).unwrap();
      if (res) {
        message.success("Data added successfully");
        const id = user_id; // Ensure `user_id` is defined in scope
        try {
          const res = await dispatch(fetchTableMonthData(id));
          // console.log(res.payload);
          setTableDemandData(res.payload);
        } catch (error) {
          // console.error("Error fetching planning data:", error);
        }

      }
      // console.log('res', res);
      setIsModalVisible(false);
      navigate('/px/consumer/planning');
    } catch (error) {
      // console.log(error);
      message.error("Failed to submit data. Please try again.");
    }
  };

  const handleDemandClick = (record) => {
    const selectedRequirement = consumerRequirement.find(item => item.state === record.state);
    setSelectedUnitDetails(selectedRequirement);

    
    setIsDetailModalVisible(true);
  };

  // console.log(selectedUnitDetails);

  const handleDateClick = (date) => {
    setSelectedDate(date.format("YYYY-MM-DD")); // Store selected date
    setIsModalVisible(true); // Open modal
  };
  
  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', rowSpan: 2 },
    { 
      title: 'Demand (MWh)', 
      dataIndex: 'demand', 
      key: 'demand', 
      rowSpan: 2, 
      render: (text, record) => (
        <Tooltip title="">
          <span style={{ cursor: 'pointer' }} onClick={() => handleDemandClick(record)}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    { title: 'Technology & Price (INR/MWh)', dataIndex: 'technology', key: 'technology' },
    { title: 'Requirement Details', dataIndex: 'requirements', key: 'requirements' },
    {
      title: 'Action', 
      dataIndex: 'action', 
      key: 'action',
      render: (text, record) => {
        const currentDate = new Date();
        const currentDateStr = currentDate.toISOString().split('T')[0]; // Get YYYY-MM-DD
        const currentTimeStr = currentDate.toTimeString().split(' ')[0]; // Get HH:MM:SS
    
        // Convert both dates to Date objects
        const recordDate = new Date(record.date); // Ensure record.date is in YYYY-MM-DD format
        const currentDateOnly = new Date(currentDateStr); // Convert current date to Date object
        
        // Compare full DateTime when needed
        const isBeforeDeadline = (
          recordDate > currentDateOnly || 
          (recordDate.getTime() === currentDateOnly.getTime() && currentTimeStr < '10:30:00')
        );
    
        // console.log("Comparing:", record.date, currentDateStr, currentTimeStr, isBeforeDeadline);
    
        return isBeforeDeadline ? (
          <Upload>
          <Button type="primary" onClick={() => {
            // console.log("Upload Data clicked for:", record);
          }}>
            Upload Data
          </Button>
          </Upload>
        ) : (
          <Button disabled>Upload Data</Button>
        );
      }
    }
    
  ];
  

  const tableData = Array.isArray(tableDemandData) ? tableDemandData.map(item => {
    const requirementDetails = consumerRequirement.find(req => req.id === item.requirement);
    return {
      key: item.requirement,
      date: item.date,
      demand: item.demand,
      technology: `${item.price?.Solar ? `Solar: ${item.price.Solar}` : ''}${item.price?.Solar && item.price?.["Non-Solar"] ? ', ' : ''}${item.price?.["Non-Solar"] ? `Non-Solar: ${item.price["Non-Solar"]}` : ''}`,
      price: `${item.price?.Solar ? `${item.price.Solar} INR (Solar)` : ''}${item.price?.Solar && item.price?.["Non-Solar"] ? ', ' : ''}${item.price?.["Non-Solar"] ? `${item.price["Non-Solar"]} INR (Non-Solar)` : ''}`,
      requirements: requirementDetails ? `State: ${requirementDetails.state}, Industry: ${requirementDetails.industry}, Contracted Demand: ${requirementDetails.contracted_demand} MWh, Consumption Unit: ${requirementDetails.consumption_unit}` : 'N/A'
    };
  }) : [];


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
    <div style={{ padding: '3%', backgroundColor: '#f0f2f5', minHeight: '100vh', position: 'relative' }}> {/* Changed background color and set minHeight */}
      <div style={{ padding: '20px' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800',fontWeight:'bold' }}>
        Energy Planner
      </h1>
          {/* <h1 style={{ margin: 0 }}>Energy Planner</h1> */}
          <Button style={{ marginRight: '-50%', backgroundColor: '#669800', borderColor: '#669800',height:'40px' }} onClick={handleToggleView}>{showTable ? 'Show Calendar' : 'Show Table'}</Button>
          <Button onClick={handleAddDetailsClick} style={{color:'black',marginLeft:'10px', backgroundColor: '#ff5722',height:'40px', borderColor: '#ff5722' }}>
          Schedule Trade
          </Button>
        </Row>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Spin tip="Loading..." />
          </div>
        ) : !showTable ? (
          
          <Col span={24}>
             <Form.Item label="Select Consumption Unit" style={{ fontSize: '24px' }}>
          <Select
            value={selectedState || undefined}
            onChange={handleStateChange}
            style={{ width: "80%", borderColor: "#669800" }}
            placeholder="Select Consumption Unit"
          >
            {consumerRequirement.map(item => (
              <Select.Option key={item.id} value={item.state}>
                {`State: ${item.state}, Industry: ${item.industry}, Contracted Demand: ${item.contracted_demand} MWh, Consumption Unit: ${item.consumption_unit}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
            <Card style={{ width: '90%', margin: 'auto', padding: '10px', backgroundColor: '#fff' }}> {/* Updated card background color */}
              <Row justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
                <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
                <h2>{dayjs(currentMonth).format('MMMM YYYY')}</h2>
                <Tooltip title="You can plan for the current month only">
                  <Button icon={<RightOutlined />} onClick={handleNextMonth} />
                </Tooltip>
              </Row>
             
              <AntdCalendar
                value={dayjs(currentMonth)}
                onPanelChange={(date) => setCurrentMonth(date.toDate())}
                onSelect={handleDateClick}
                
                cellRender={(value) => tileContent(value)}
                style={{ '--cell-size': '20px'}} // Add custom CSS variable for cell size
              />
            </Card>
          </Col>
        ) : (
          <Col span={24}>
            <Card style={{ width: '90%', margin: 'auto', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff' }}> {/* Updated shadow and card background color */}
              <Table dataSource={tableData} columns={columns} pagination={false} bordered />
            </Card>
          </Col>
        )}
        {/* <Button
          type="primary"
          style={{ position: 'fixed', right: '20px', bottom: '20px' }}
          onClick={() => navigate('/consumer/plan-month-trade')}
        >
          Plan for More Days
        </Button> */}
      </div>
      <Modal
        title="Plan for More Days"
        visible={isInputModalVisible}
        footer={null} // Remove default footer
        onCancel={() => setIsInputModalVisible(false)}
      >
        <Form.Item label="Select Consumption Unit" style={{ fontSize: '24px' }}>
          <Select
            value={selectedState || undefined}
            onChange={handleStateChange}
            style={{ width: "100%", borderColor: "#669800" }}
            placeholder="Select Consumption Unit"
          >
            {consumerRequirement.map(item => (
              <Select.Option key={item.id} value={item.state}>
                {`State: ${item.state}, Industry: ${item.industry}, Contracted Demand: ${item.contracted_demand} MWh, Consumption Unit: ${item.consumption_unit}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {
          !selectedInterval && (
<Form.Item label="Select Date" style={{ fontSize: '16px', fontWeight: '600' }}>
          <DatePicker
            style={{ width: "100%", fontSize: '16px', backgroundColor: 'white' }}
            format="DD/MM/YYYY"
            disabledDate={(current) => current && current <= new Date()}
            onChange={(date) => setSelectedDate(date)}
          />
        </Form.Item>
          )
        }
        
        {/* <Form.Item label="Select Date Interval" style={{ fontSize: '24px' }}>
          <Select
            value={selectedInterval || undefined}
            onChange={handleDateIntervalChange}
            style={{ width: "100%", borderColor: "#669800" }}
            placeholder="Select Date Interval"
          >
            <Select.Option key="next15days" value="next15days">Next 15 Days</Select.Option>
            <Select.Option key="next30days" value="next30days">Next 30 Days</Select.Option>
          </Select>
        </Form.Item> */}
        {(selectedInterval === 'next15days' || selectedInterval === 'next30days') && (
          <>
            <Form.Item label="Select Start Date" style={{ fontSize: '16px', fontWeight: '600' }}>
              <DatePicker
                style={{ width: "100%", fontSize: '16px', backgroundColor: 'white' }}
                format="DD/MM/YYYY"
                disabledDate={(current) => current && current <= new Date()}
                onChange={(date) => setStartDate(date)}
              />
            </Form.Item>
            <Form.Item label="Select End Date" style={{ fontSize: '16px', fontWeight: '600' }}>
              <DatePicker
                style={{ width: "100%", fontSize: '16px', backgroundColor: 'white' }}
                format="DD/MM/YYYY"
                disabledDate={(current) => current && current <= new Date()}
                onChange={(date) => setEndDate(date)}
              />
            </Form.Item>
          </>
        )}
        <Form.Item label="Enter Demand (MWh)" style={{ fontSize: '16px', fontWeight: '600' }}>
          <Input
            type="number"
            placeholder="Enter demand"
            min={0}
            style={{
              width: "100%",
              padding: "5px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
            onChange={(e) => {
              setDemand(e.target.value);
              setAllFieldsFilled(e.target.value !== '' && selectedDate !== null);
            }}
          />
        </Form.Item>
        <Tooltip title={!allFieldsFilled ? "All fields are required" : ""} placement="top">
          <Button onClick={handleAddData} disabled={!allFieldsFilled}>
            Add Data
          </Button>
        </Tooltip>
        <Button onClick={() => setIsInputModalVisible(false)} style={{ marginLeft: '10px' }}>
          Cancel
        </Button>
      </Modal>
      <Modal
        title="Select Technology"
        visible={isModalVisible}
        onOk={handleModalOk} // Call handleModalOk on OK button click
        onCancel={() => setIsModalVisible(false)}
      >
        {/* Checkbox Group */}
        {/* <Checkbox.Group onChange={(checkedValues) => setSelectedTechnology(checkedValues)} value={selectedTechnology}>
          <Checkbox value="Solar">"Solar"</Checkbox>
          <Checkbox value="Non-Solar">"Non-Solar"</Checkbox>
        </Checkbox.Group> */}
        <Radio.Group onChange={(e) => setSelectedTechnology(e.target.value)} value={selectedTechnology}>
          <Radio value="Solar">Solar</Radio>
          <Radio value="Non-Solar">Non-Solar</Radio>
        </Radio.Group>

        {/* Input fields for price */}
        <div style={{ marginTop: "15px" }}>
                 {selectedTechnology === "Solar" && (
                   <div>
                     <label style={{ fontWeight: "bold" }}>Enter Solar Price:</label>
                     <Input
                       type="number"
                       placeholder="Enter solar price in INR/MWh"
                       value={price["Solar"] || ""}
                       min={0}
                       onChange={(e) => setPrice({ ...price, "Solar": e.target.value })}
                       style={{ marginTop: "5px", width: "100%",marginBottom:'20px' }}
                     />
                   </div>
                 )}
                 
                 {selectedTechnology === "Non-Solar" && (
                   <div>
                     <label style={{ fontWeight: "bold" }}>Enter Non-Solar Price:</label>
                     <Input
                       type="number"
                       placeholder="Enter non-solar price in INR/MWh"
                       value={price["Non-Solar"] || ""}
                       min={0}
                       onChange={(e) => setPrice({ ...price, "Non-Solar": e.target.value })}
                       style={{ marginTop: "5px", width: "100%",marginBottom:'20px' }}
                     />
                   </div>
                 )}
               </div>
               {/* <Form.Item label="Enter Demand (MWh)" style={{ fontSize: '16px', fontWeight: '600',marginTop:'10px' }}>
                <br /> */}
                <label style={{ fontSize: '14px', fontWeight: '700',marginTop:'3s0px' }}>Enter Demand (MWh):</label>
          <Input
            type="number"
            placeholder="Enter demand"
            min={0}
            style={{
              width: "100%",
              padding: "5px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
            onChange={(e) => {
              setDemand(e.target.value);
              setAllFieldsFilled(e.target.value !== '' && selectedDate !== null);
            }}
          />
        {/* </Form.Item> */}
      </Modal>
      <Modal
        title="Consumption Unit Details"
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
      >
        {selectedUnitDetails && (
          <div>
            <p><strong>State:</strong> {selectedUnitDetails.state}</p>
            <p><strong>Industry:</strong> {selectedUnitDetails.industry}</p>
            <p><strong>Contracted Demand:</strong> {selectedUnitDetails.contracted_demand} MWh</p>
            <p><strong>Consumption Unit:</strong> {selectedUnitDetails.consumption_unit}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Planning;
