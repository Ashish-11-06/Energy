/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { Table, Card, Row, Col, Tooltip, Button, Spin, message, Form, Select, DatePicker, Input, Modal, Checkbox, Radio, Upload } from 'antd';
import 'antd/dist/reset.css';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { fetchTableMonthData } from '../../Redux/slices/consumer/monthAheadSlice';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import 'dayjs/locale/en';

// import Calendar from 'react-calendar';
import { Calendar as AntdCalendar } from 'antd'; // Import Ant Design Calendar

import 'react-calendar/dist/Calendar.css';
import './Planning.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getAllProjectsById } from "../../Redux/slices/generator/portfolioSlice";
import { fetchPlanningDataG } from '../../Redux/slices/generator/planningSlice';
import { addTableMonthData, uploadTableMonthData } from '../../Redux/slices/generator/monthAheadSliceG';
import { fetchHolidayList } from '../../Redux/slices/consumer/holidayListSlice';

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
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const dispatch = useDispatch();
  const user_id = Number(JSON.parse(localStorage.getItem('user')).user.id);
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
  const [isInputModalVisible, setIsInputModalVisible] = useState(false); // Separate state for input modal
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedUnitDetails, setSelectedUnitDetails] = useState(null);
  const [generatorPortfolio, setGeneratorPortfolio] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState(null); // Add state for selected interval
  const [startDate, setStartDate] = useState(null); // Add state for start date
  const [endDate, setEndDate] = useState(null); // Add state for end date
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [disableDates, setDisableDates] = useState([]); // State to store holiday dates
  const [isTechnologySelectionDisabled, setIsTechnologySelectionDisabled] = useState(false);
  const selectedTechnologyRef = useRef(null);
  const [primaryPortfolio, setPrimaryPortfolio] = useState(null);
  const [secondaryPortfolio, setSecondaryPortfolio] = useState(null);
  const [primaryTechnology, setPrimaryTechnology] = useState(null);
  const [secondaryTechnology, setSecondaryTechnology] = useState(null);
  const [activeSelect, setActiveSelect] = useState(''); // either 'primary' or 'secondary'
  const [okLoading, setOkLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const id = user_id; // Ensure `user_id` is defined in scope
      try {
        const res = await dispatch(fetchPlanningDataG(id));
        // console.log(res.payload);
        setTableDemandData(Array.isArray(res.payload) ? res.payload : []);
      } catch (error) {
        // console.error("Error fetching planning data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the function inside useEffect
  }, [user_id, dispatch]); // Add dependencies if needed

  useEffect(() => {
    const fetchHolidayData = async () => {
      try {
        const res = await dispatch(fetchHolidayList());
        // setDisableDates(["2025-04-29"]); // Assuming res.payload contains the list of holidays
        setDisableDates(res.payload); // Assuming res.payload contains the list of holidays
        // console.log("Holiday List:", res);
      } catch (error) {
        // console.error("Error fetching holiday list:", error);
      }
    };
    fetchHolidayData();
  }, [dispatch]);


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
        const filteredPortfolio = flattenedPortfolio.filter(item => item.type !== 'ESS');
setGeneratorPortfolio(filteredPortfolio);

      } catch (error) {
        // console.log("Error fetching portfolio:", error);
      }
    };

    fetchData();
  }, [user_id, dispatch]);
  // console.log(tableDemandData);
  // console.log(selectedPortfolio);
  const getListData = (date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    return tableDemandData.filter(item => item.date === dateStr);
  };

  const tileContent = (value) => {
    const date = value.toDate();
    const listData = getListData(date);
    const isToday = dayjs(date).isSame(dayjs(), 'day');
    const isPastDate = dayjs(date).isBefore(dayjs(), 'day');
    const isDisabledDate = disableDates.some(disabledDate =>
      dayjs(disabledDate).isSame(dayjs(date), 'day')
    );

    return (
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          marginTop: '15px',
          cursor: isPastDate || isDisabledDate ? 'not-allowed' : 'pointer',
          opacity: isPastDate || isDisabledDate ? 0.5 : 1,
          pointerEvents: isPastDate || isDisabledDate ? 'none' : 'auto', // Prevent clicks on disabled dates
        }}
        onClick={() => {
          if (!isPastDate && !isDisabledDate) {
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
{listData
  .filter(item => {
    // Match by portfolio type
    const isTypeMatch =
      (selectedPortfolio?.type === 'Solar' && item.content_type === 'solarportfolio') ||
      (selectedPortfolio?.type === 'Wind' && item.content_type === 'windportfolio');

    // Match by portfolio ID
    const isIdMatch = item.object_id === selectedPortfolio?.id;

    return isTypeMatch && isIdMatch;
  })
  .map(item => (
    <Tooltip
      key={item.id}
      title={
        <pre style={{ margin: 0 }}>
{`Generation: ${item.generation} MWh
Type: ${item.content_type === 'windportfolio' ? 'Wind' 
        : item.content_type === 'solarportfolio' ? 'Solar' 
        : item.content_type}
Price: ${item.price} INR
ID: ${item.id}
Object ID: ${item.object_id}`}
        </pre>
      }
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

  const handleChange = (e) => {
    setSelectedTechnology(e.target.value);
  };
  const handleToggleView = () => {
    setShowTable(!showTable);
  };

  const handleAddDetailsClick = () => {
    setIsInputModalVisible(true); // Show input modal when button is clicked
  };

  // console.log(selectedTechnology);


  const handleStateChange = (value) => {
    const [id, type] = value.split('_');

    const selectedItem = generatorPortfolio.find(
      item => String(item.id) === id && item.type === type
    );

    if (selectedItem) {
      setSelectedPortfolio(selectedItem);
      setSelectedPortfolioId(selectedItem.id);

      const tech = type === 'Solar' ? 'Solar' : 'non_solar';
      console.log('techhhhhhh',tech);
      
      setSelectedTechnology(tech);
      selectedTechnologyRef.current = tech;
      setIsTechnologySelectionDisabled(true);
    }
  };


  const handleSelectChange = (value, key) => {
    console.log('handle select change',value,key);
    
    const [id, type] = value.split('_');
    const selectedItem = generatorPortfolio.find(
      item => String(item.id) === id && item.type === type
    );
    if (!selectedItem) return;
    const tech = type === 'Solar' ? 'Solar' : 'non_solar';
    if (key === 'primary') {
      console.log('selected item primary',selectedItem);
      
      setPrimaryPortfolio(selectedItem);
      setPrimaryTechnology(tech);
    } else if (key === 'secondary') {
      console.log('selected item',selectedItem);
      
      setSecondaryPortfolio(selectedItem);
      setSecondaryTechnology(tech);
    }
    setActiveSelect(key);
  };

  const handleAddData = () => {
    setIsInputModalVisible(false); // Hide input modal
    // console.log(selectedPortfolio);

    if (selectedPortfolio?.type === 'Solar') {
      setSelectedTechnology('Solar'); // Pre-select Solar if portfolio type is Solar
    } else {
      setSelectedTechnology('non_solar'); // Pre-select Non Solar otherwise
    }
    setIsModalVisible(true); // Show technology modal
  };
  // console.log("Selected Portfolio ID:", selectedPortfolioId); // Debugging log

  const handleModalOk = async () => {
    setOkLoading(true);
    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD'); // Ensure selectedDate is a dayjs object
    if (!selectedPortfolioId) {
      message.error("Please select a portfolio from 'Select Portfolio' before submitting.");
      return;
    }

    if (!selectedDate || !demand || !price) {
      message.error("Please fill all required fields before submitting.");
      return;
    }
    // console.log('primary portfolio', primaryPortfolio, primaryTechnology);
    // console.log('secondory portfolio', secondaryPortfolio, secondaryTechnology);
    const selected =
      activeSelect === 'primary'
        ? { portfolio: primaryPortfolio, technology: primaryTechnology }
        : { portfolio: secondaryPortfolio, technology: secondaryTechnology };

    // Prepare payload
    // console.log('selected', selected);

    const data = {
      portfolio_id: selected.portfolio?.id,
      portfolio_type:
        selected.technology === 'non_solar'
          ? 'non_solar'
          : selected.technology?.toLowerCase(),
      date: formattedDate, // or format it as needed
      generation: parseFloat(demand),
      price: parseFloat(price),
    };

    console.log("Submitting data to backend:", data);

    try {
      const res = await dispatch(addTableMonthData(data)).unwrap();
      console.log('Response from addTableMonthData:', res);

      if (res) {
        setIsModalVisible(false);
        message.success("Data added successfully");

        const id = user_id; // make sure user_id is defined

        try {
          const planningRes = await dispatch(fetchPlanningDataG(id)).unwrap();
          setTableDemandData(Array.isArray(planningRes) ? planningRes : []);
        } catch (error) {
          console.error("Error fetching planning data:", error);
          message.error("Failed to fetch planning data");
        }
      }
    } catch (error) {
      // This catches the rejection error from addTableMonthData thunk
      console.error("Error adding table month data:", error);
      message.error(error || "Failed to add data");
    }

    setOkLoading(false)
  };

  // console.log(selectedPortfolioId);


  const handleDemandClick = (record) => {
    const selectedRequirement = generatorPortfolio.find(item => item.state === record.state);
    setSelectedUnitDetails(selectedRequirement);
    setIsDetailModalVisible(true);
  };

  const handleFileUpload = async (file, record) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64File = reader.result.split(",")[1]; // Get Base64 string without prefix

      const data = {
        id: record.portfolio_id, // Use portfolio_id instead of requirement ID
        file: base64File, // Use Base64 encoded file
      };

      try {
        const res = await dispatch(uploadTableMonthData(data)); // Call the API with the updated data
        // console.log('res', res);

        if (res) {
          // message.success("File uploaded successfullyyyyy");
          message.success(res.payload.message);
          const updatedData = await dispatch(fetchPlanningDataG(user_id)); // Fetch updated data
          setTableDemandData(Array.isArray(updatedData.payload) ? updatedData.payload : []);
        }
      } catch (error) {
        message.error("Failed to upload file. Please try again.");
      }
    };

    reader.readAsDataURL(file); // Read the file as a Base64 string
    return false; // Prevent automatic upload
  };


  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      rowSpan: 2,
      render: (text) => dayjs(text).format('DD-MM-YYYY')
    },
    {
      title: 'Generation (MWh)', dataIndex: 'generation', key: 'generation', rowSpan: 2, render: (text, record) => (
        <Tooltip title="Click to view details">
          <span style={{ color: 'rgb(154, 132, 6)', cursor: 'pointer' }} onClick={() => handleDemandClick(record)}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    { title: 'Technology & Price (INR/MWh)', dataIndex: 'technology', key: 'technology' },

    // {title:'Portfolio',dataIndex:'portfolio',key:'portfolio'},
    {
      title: 'Portfolio Details',
      children: [
        {
          title: 'Technology',
          dataIndex: 'techno',
          key: 'techno',
        },
        {
          title: 'Portfolio ID',
          dataIndex: 'portfolio_id',
          key: 'portfolio_id',
        },
        {
          title: 'State',
          dataIndex: 'state',
          key: 'state',
        },
        {
          title: 'Connectivity',
          dataIndex: 'connectivity',
          key: 'connectivity',
        },
        {
          title: 'Available Capacity (MWh)',
          dataIndex: 'available_capacity',
          key: 'available_capacity',
        },


        // {
        //   title: 'Date',
        //   dataIndex: 'mcpDate',
        //   key: 'mcpDate',
        //   render: (text, record) => {
        //     if (record.status === 'Highest Forecasted Value') return mcpHighestDate;
        //     if (record.status === 'Lowest Forecasted Value') return mcpLowestDate;
        //     return '-';
        //   },
        // },
      ],
    },
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
          <Upload
            beforeUpload={(file) => {
              handleFileUpload(file, record);
              return false; // Prevent automatic upload
            }}
            showUploadList={false}
          >
            <Button type="primary">Upload Data</Button>
          </Upload>
        ) : (
          <Button disabled>Upload Data</Button>
        );
      }
    }
  ];
  // console.log(tableDemandData);

  const tableData = Array.isArray(tableDemandData) ? tableDemandData.map(item => {
    const portfolioDetails = generatorPortfolio.find(req => req.id === item.object_id);


    return {
      key: item.object_id,
      date: item.date,
      generation: item.generation,
      technology: `${item.content_type.replace('portfolio', '')}: ${item.price} INR`,
      price: `${item.price} INR (${item.content_type})`,
      state: portfolioDetails?.state || 'N/A', // Add null check
      portfolio_id: portfolioDetails?.id || 'N/A', // Add null check
      connectivity: portfolioDetails?.connectivity || 'N/A', // Add null check
      available_capacity: portfolioDetails?.available_capacity || 'N/A', // Add null check
      techno: portfolioDetails?.type || 'N/A', // Add null check
      portfolio: portfolioDetails
        ? `Technology: ${portfolioDetails.type}, State: ${portfolioDetails?.state}, Connectivity: ${portfolioDetails?.connectivity}, Available capacity: ${portfolioDetails?.available_capacity} MWh, Annual Generation Potential: ${portfolioDetails?.annual_generation_potential}`
        : 'N/A'
    };
  }) : [];

  const handlePrevMonth = () => {
    setCurrentMonth(dayjs(currentMonth).subtract(1, 'month').toDate());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date.format("YYYY-MM-DD")); // Store selected date
    setIsModalVisible(true); // Open modal
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
          <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800', fontWeight: 'bold' }}>
            Energy Planner
          </h1>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '1rem 0',
          }}>
            <Button
              style={{
                backgroundColor: '#669800',
                borderColor: '#669800',
                color: 'white',
                height: '40px',
                minWidth: '140px',
                flex: '1 1 auto',
              }}
              onClick={handleToggleView}
            >
              {showTable ? 'Show Calendar' : 'Show Table'}
            </Button>

            <Button
              onClick={handleAddDetailsClick}
              style={{
                backgroundColor: '#ff5722',
                borderColor: '#ff5722',
                color: 'white',
                height: '40px',
                minWidth: '140px',
                flex: '1 1 auto',
              }}
            >
              Schedule Trade
            </Button>
          </div>

        </Row>
        {loading ? (
          <Spin tip="Loading..." style={{ marginTop: '20px' }} />
        ) : !showTable ? (


          <Col span={24}>
            <p style={{ color: 'GrayText' }}>
              (Note:
              <ol >
                <li>Select portfolio from the drop down.</li>
                <li>Select the date for which you want to schedule the trade.</li>
                <li>Enter the Price and Generation)</li>
              </ol>
            </p>
            <Form.Item label="Select Portfolio" style={{ fontSize: '24px' }}>
              <Select
                value={
                  primaryPortfolio
                    ? `${primaryPortfolio.id}_${primaryPortfolio.type}`
                    : undefined
                }
                          onChange={(value) => {
  handleSelectChange(value, 'primary');
  handleStateChange(value);
}}


                style={{ width: "80%", borderColor: "#669800" }}
                placeholder="Select Portfolio"
              >
                {Array.isArray(generatorPortfolio) &&
                  generatorPortfolio.map((item) => (
                    <Select.Option key={`${item.id}_${item.type}`} value={`${item.id}_${item.type}`}>
                      {`${item.type}, State: ${item.state}, Connectivity: ${item.connectivity}, Available Capacity: ${item.available_capacity} MWh, Annual Generation Potential: ${item.annual_generation_potential}`}
                    </Select.Option>
                  ))}
              </Select>

            </Form.Item>
            <Card className='mainCard' style={{ width: '90%', margin: 'auto', padding: '10px' }}>
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
                className='temp-calender'
                cellRender={(value) => tileContent(value)}
                style={{ '--cell-size': '20px' }} // Add custom CSS variable for cell size
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
        {/* <Button
          type="primary"
          style={{ position: 'fixed', right: '20px', bottom: '20px' }}
          onClick={() => navigate('/consumer/plan-month-trade')}
        >
          Plan for More Days
        </Button> */}
      </div>
      <Modal
        title="Plan for More Dayss"
        visible={isInputModalVisible}
        footer={null} // Remove default footer
        onCancel={() => setIsInputModalVisible(false)}
      >

        <Form.Item label="Secondary Portfolio" style={{ fontSize: '20px' }}>
          <Select
            value={
              secondaryPortfolio
                ? `${secondaryPortfolio.id}_${secondaryPortfolio.type}`
                : undefined
            }
onChange={(value) => {
  handleSelectChange(value, 'secondary');
  setAllFieldsFilled(secondaryPortfolio); // Update button state
handleStateChange(value)
}}
            style={{ width: '100%', borderColor: '#669800' }}
            placeholder="Select Secondary Portfolio"
          >
            {generatorPortfolio.map((item) => (
              <Select.Option
                key={`${item.id}_${item.type}`}
                value={`${item.id}_${item.type}`}
              >
                {`Technology: ${item.type}, State: ${item.state}, Connectivity: ${item.connectivity}, Available Capacity: ${item.available_capacity} MWh`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Select Date" style={{ fontSize: '16px', fontWeight: '600' }}>
          <DatePicker
            style={{ width: "100%", fontSize: '16px', backgroundColor: 'white' }}
            format="DD/MM/YYYY"
            disabledDate={(current) => {
              const isPastDate = current && current <= dayjs().endOf('day');
              const isDisabledDate = disableDates.some(disabledDate =>
                dayjs(disabledDate).isSame(current, 'day')
              );
              return isPastDate || isDisabledDate;
            }}
            onChange={(date) => {
              setSelectedDate(date);
              setAllFieldsFilled(secondaryPortfolio && date); // Update button state
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
        title="Select Technologyy"
        open={isModalVisible}
        onOk={handleModalOk}
        confirmLoading={okLoading}
        onCancel={() => setIsModalVisible(false)}
      >
        {/* Radio Group */}
        <Radio.Group
          onChange={handleChange}
          value={selectedTechnology}
          disabled={isTechnologySelectionDisabled}
        >
          <Radio value="Solar">Solar</Radio>
          <Radio value="non_solar">Non solar</Radio>
        </Radio.Group>
        {/* Input field for price */}
        <div style={{ marginTop: "15px" }}>
          {selectedTechnology && (
            <div>
              <label style={{ fontWeight: "bold" }}>Enter {selectedTechnology === 'non_solar' ? 'Non Solar' : selectedTechnology} Price (INR/MWh):</label>
              <Input
                type="number"
placeholder={`Enter ${selectedTechnology === 'non_solar' ? 'Non Solar' : selectedTechnology} price in INR/MWh`}
                value={price}
                min={0}
                onChange={(e) => setPrice(e.target.value)}
                style={{ marginTop: "5px", width: "100%" }}
              />
            </div>
          )}
        </div>
        {/* <Form.Item label="Enter Generation (MWh)" style={{ fontSize: '16px', fontWeight: '600' }}> */}
        <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '10px' }}>Enter Generation (MWh)</p>
        {/* <br /> */}
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
            // setAllFieldsFilled(e.target.value !== '' && selectedDate !== null);
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
