/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Tooltip, Button, Spin, message, Form, Select, DatePicker, Input, Modal, Checkbox, Radio } from 'antd';
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
import { getAllProjectsById } from "../../Redux/slices/generator/portfolioSlice";
import { fetchPlanningDataG } from '../../Redux/slices/generator/planningSlice';
import { addTableMonthData } from '../../Redux/slices/generator/monthAheadSliceG';

dayjs.locale('en');

const Planning = () => {
  const navigate = useNavigate();
  const [showTable, setShowTable] = useState(true); // Set default to true
  const [selectedState, setSelectedState] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [demand, setDemand] = useState("");
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [tableDemandData, setTableDemandData] = useState([]);
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
  const [generatorPortfolio, setGeneratorPortfolio] = useState([]);
 const [selectedPortfolio, setSelectedPortfolio] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const id = user_id; // Ensure `user_id` is defined in scope
      try {
        const res = await dispatch(fetchPlanningDataG(id));
        console.log(res.payload);
        setTableDemandData(Array.isArray(res.payload) ? res.payload : []);
      } catch (error) {
        console.error("Error fetching planning data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the function inside useEffect
  }, [user_id, dispatch]); // Add dependencies if needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = user_id;
        const res = await dispatch(getAllProjectsById(id)).unwrap();
        const flattenedPortfolio = [
          ...res.Solar.map(item => ({ ...item, type: 'Solar' })),
          ...res.Wind.map(item => ({ ...item, type: 'Wind' })),
          ...res.ESS.map(item => ({ ...item, type: 'ESS' }))
        ];
        setGeneratorPortfolio(flattenedPortfolio);
        console.log(flattenedPortfolio);
      } catch (error) {
        console.log("Error fetching portfolio:", error);
      }
    };

    fetchData();
  }, [user_id, dispatch]);

  const getListData = (date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    return tableDemandData.filter(item => item.date === dateStr);
  };

  const tileContent = ({ date }) => {
    const listData = getListData(date);
    const isToday = dayjs(date).isSame(dayjs(), 'day');

    return (
      <div style={{ position: 'relative', textAlign: 'center', marginTop: '15px' }}>
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
            style={{ marginTop: '3%' }} 
            key={item.id} 
            title={`Generation: ${item.generation} MWh, ${item.content_type} Price: ${item.price} INR`}
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
                marginTop: '10px'
              }}
            />
          </Tooltip>
        ))}
      </div>
    );
  };

  const handleChange = (e) => {
    setSelectedTechnology(e.target.value);
  };
  const handleToggleView = () => {
    setShowTable(!showTable);
  };

  const handleAddDetailsClick = () => {
    setIsInputModalVisible(true); // Show input modal when button is clicked
  };

  const handleStateChange = (value) => {
    const selectedRequirement = generatorPortfolio.find(item => item.id === value);
    setSelectedRequirementId(selectedRequirement ? selectedRequirement.id : null);
    setSelectedPortfolio(selectedRequirement);
    setSelectedState(selectedRequirement ? selectedRequirement.state : "");
  };


  const handleAddData = () => {
    setIsInputModalVisible(false); // Hide input modal
    setIsModalVisible(true); // Show technology modal
  };

  const handleModalOk = async () => {
    console.log('clicked')
    const formattedDate = selectedDate.format('YYYY-MM-DD'); // Format the date correctly
    try {
      console.log(selectedRequirementId);
      const data = {
        portfolio_id: selectedRequirementId,
        portfolio_type: selectedPortfolio.type.toLowerCase(),
        date: selectedDate ? selectedDate.format('YYYY-MM-DD') : '',
        generation: parseFloat(demand),
        price: parseFloat(price)
      }
      console.log(data);
      const res = await dispatch(addTableMonthData(data)).unwrap();
      console.log('Response from addTableMonthData:', res);
      if (res) {
        message.success("Data added successfully");
        const id = user_id; // Ensure `user_id` is defined in scope
        try {
          const res = await dispatch(fetchPlanningDataG(id));
          console.log(res.payload);
          setTableDemandData(Array.isArray(res.payload) ? res.payload : []);
        } catch (error) {
          console.error("Error fetching planning data:", error);
        }
      }
      setIsModalVisible(false);
      navigate('/px/generator/planning');
    } catch (error) {
      console.log(error);
      message.error("Failed to submit data. Please try again.");
    }
  };

  const handleDemandClick = (record) => {
    const selectedRequirement = generatorPortfolio.find(item => item.state === record.state);
    setSelectedUnitDetails(selectedRequirement);
    setIsDetailModalVisible(true);
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', rowSpan: 2 },
    { title: 'Generation', dataIndex: 'generation', key: 'generation', rowSpan: 2, render: (text, record) => (
        <Tooltip title="Click to view details">
          <span style={{ color: 'rgb(154, 132, 6)', cursor: 'pointer' }} onClick={() => handleDemandClick(record)}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    { title: 'Technology & Price (INR)', dataIndex: 'technology', key: 'technology' },
  ];

  const tableData = Array.isArray(tableDemandData) ? tableDemandData.map(item => ({
    key: item.object_id,
    date: item.date,
    generation: item.generation,
    technology: `${item.content_type}: ${item.price} INR`,
    price: `${item.price} INR (${item.content_type})`,
  })) : [];

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
    <div>
      <div style={{ padding: '20px' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
          <h1 style={{ margin: 0 }}>Energy Planner</h1>
          <Button style={{ marginRight: '-50%' }} onClick={handleToggleView}>{showTable ? 'Show Calendar' : 'Show Table'}</Button>
          <Button onClick={handleAddDetailsClick} style={{color:'black'}}>
            Plan for more Days
          </Button>
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
      <Modal
        title="Plan for More Days"
        visible={isInputModalVisible}
        footer={null} // Remove default footer
        onCancel={() => setIsInputModalVisible(false)}
      >
        <Form.Item label="Select Portfolio" style={{ fontSize: '24px' }}>
          <Select
            value={selectedPortfolio ? selectedPortfolio.id : undefined}
            onChange={handleStateChange}
            style={{ width: "100%", borderColor: "#669800" }}
            placeholder="Select Portfolio"
          >
            {generatorPortfolio.map(item => (
              <Select.Option key={item.id} value={item.id}>
                {`${item.id}: ${item.type}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Select Date" style={{ fontSize: '16px', fontWeight: '600' }}>
          <DatePicker
            style={{ width: "100%", fontSize: '16px', backgroundColor: 'white' }}
            format="DD/MM/YYYY"
            disabledDate={(current) => current && current <= new Date()}
            onChange={(date) => setSelectedDate(date)}
          />
        </Form.Item>
        <Form.Item label="Enter Generation (MWh)" style={{ fontSize: '16px', fontWeight: '600' }}>
          <Input
            type="number"
            placeholder="Enter generation"
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
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        {/* Radio Group */}
        <Radio.Group onChange={handleChange} value={selectedTechnology}>
          <Radio value="Solar">Solar</Radio>
          <Radio value="Wind">Wind</Radio>
        </Radio.Group>

        {/* Input field for price */}
        <div style={{ marginTop: "15px" }}>
          {selectedTechnology && (
            <div>
              <label style={{ fontWeight: "bold" }}>Enter {selectedTechnology} Price:</label>
              <Input
                type="number"
                placeholder={`Enter ${selectedTechnology} price in INR`}
                value={price}
                min={0}
                onChange={(e) => setPrice(e.target.value)}
                style={{ marginTop: "5px", width: "100%" }}
              />
            </div>
          )}
        </div>
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
