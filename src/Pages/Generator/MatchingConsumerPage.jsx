/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Table, Radio, Button, message, Input, Select, Modal,Row,Col,Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons'; // Import the Eye icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector hooks
import { fetchMatchingConsumersById } from '../../Redux/Slices/Generator/matchingConsumerSlice'; // Import the action to fetch data
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported
import { Typography } from 'antd';


const { Search } = Input;
const { Option } = Select;

const MatchingConsumerPage = () => {
  const dispatch = useDispatch(); // Initialize dispatch hook
  const navigate = useNavigate(); // Initialize navigate hook
  
  const user = (JSON.parse(localStorage.getItem('user'))).user;
  const subscriptionPlan = JSON.parse(localStorage.getItem('subscriptionPlanValidity'));

  const [selectedConsumer, setSelectedConsumer] = useState(null); // Track the selected consumer
  const [searchText, setSearchText] = useState(''); // For search functionality
  const [filterState, setFilterState] = useState(''); // For filtering by state
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [modalConsumerDetails, setModalConsumerDetails] = useState(null); // Consumer details for the modal
  
  // Access matching consumers data and status from the Redux store
  const { Matchingconsumers, status, error } = useSelector((state) => state.matchingConsumer);

    const dataSource = [
      {key:'1',label:<strong>Credit Rating</strong>, value:modalConsumerDetails?.REindex || 'A2'},
      { key: '2', label: <strong>Consumer</strong>, value: modalConsumerDetails?.user__username},
      { key: '3', label: <strong>State</strong>, value: modalConsumerDetails?.state },
      { key: '4', label: <strong>Demand</strong>, value: modalConsumerDetails?.total_contracted_demand },
      { key: '5', label: <strong>Industry</strong>, value: modalConsumerDetails?.industry },
    
    ];
  
  if (status === 'idle') {
    const userId = user.id; // Replace with actual user ID (you can get it from localStorage or another source)
    dispatch(fetchMatchingConsumersById(userId)); // Fetch matching consumers
  }
  
  const [filteredConsumers, setFilteredConsumers] = useState(Matchingconsumers); // Set initial filtered consumers to matching consumers

  useEffect(() => {
    setFilteredConsumers(Matchingconsumers); // Update filtered consumers whenever Matchingconsumers changes
  }, [Matchingconsumers]);

  // Handle radio button change for selecting a consumer
  const handleRadioChange = (e, key) => {
    // console.log(key);
    localStorage.setItem('matchingConsumerId',key);
    const data={
          user_id:user.id,
          selected_requirement_id:key
        }
    setSelectedConsumer(key); // Set the selected consumer key
    // message.success(`You have selected consumer with Serial No: ${key}`);
  };

  // Handle search input change
  const handleSearch = (value) => {
    setSearchText(value);
    filterConsumers(value, filterState);
  };

  // Handle state filter change
  const handleStateFilterChange = (value) => {
    setFilterState(value);
    filterConsumers(searchText, value);
  };

  // Filter consumers based on search text and state filter
  const filterConsumers = (searchText, filterState) => {
    let filtered = Matchingconsumers;

    if (searchText) {
      filtered = filtered.filter(consumer =>
        consumer.state.toLowerCase().includes(searchText.toLowerCase()) ||
        consumer.industry.toLowerCase().includes(searchText.toLowerCase())
      );
    }
// consumer.state.toLowerCase().includes(searchText.toLowerCase()) ||
    if (filterState) {
      filtered = filtered.filter(consumer => consumer.state === filterState);
    }

    setFilteredConsumers(filtered);
  };

  // Define the columns for the table
  const columns = [
    {
      title: 'Select',
      key: 'select',
      render: (text, record) => (
        <Radio
        onChange={(e) => handleRadioChange(e, record.id)} // Use a unique identifier (e.g., record.id)
        checked={selectedConsumer === record.id} // Ensure the selection logic matches
      />
     
      ),
    },
    {
      title: 'Consumer ID',
      dataIndex: 'user__username',
      key: 'user__username', // Use a unique key for each row
      render: (text) => text,
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Demand (MW)',
      dataIndex: 'total_contracted_demand',
      key: 'demand',
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => showModal(record)} // Show modal on button click
          icon={<EyeOutlined />} // Replace with icon
          style={{ textAlign: 'center', justifyContent: 'center' }}
        >
          {/* Icon will automatically appear with the button */}
        </Button>
      ),
    },
   
  ];

  const showModal = (consumer) => {
    setModalConsumerDetails(consumer); // Set the consumer details to show in the modal
    setIsModalVisible(true); // Display the modal
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // Close the modal
    setModalConsumerDetails(null); // Clear the modal content
  };

  const handleNextClick = () => {
    if (selectedConsumer) {
      // Navigate to the next page (e.g., /next-page)
      // console.log(selectedConsumer);
      if(subscriptionPlan.status === 'active') {
        navigate('/generator/update-profile-details', { state: { selectedConsumer } }); // Pass selected consumer as state
      } else {
        navigate('/subscription-plan');
      }
      } else {
      message.error('Please select a consumer before proceeding.');
    }
  };

  return (
    <div style={{ padding: '20px', marginTop: '50px', border: "2px" }}>
      <h2>Potential Consumer</h2>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="Search"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200,height:'35px' }}
        />
        {/* <Select
          placeholder="Filter by state"
          onChange={handleStateFilterChange}
          allowClear
          style={{ width: 200,height:35 }}
        >
          <Option value="Karnataka">Karnataka</Option>
          <Option value="Maharashtra">Maharashtra</Option>
          <Option value="Rajasthan">Rajasthan</Option>
        </Select> */}
      </div>
      <Table
  columns={columns}
  dataSource={filteredConsumers}
  pagination={false}
  loading={status === 'loading'}
  bordered
  rowKey="id" // Use a unique field (e.g., consumer.id) for the row key
/>



      {/* Button to show selected consumer */}
      <Tooltip title={!selectedConsumer ? 'Please select a matching consumer' : ''}>
      <Button
        type="primary"
        style={{
          marginTop: '20px',
          backgroundColor: selectedConsumer ? '' : '#8C8C8C', // Green if selected, gray otherwise
          borderColor: selectedConsumer ? '' : '#8C8C8C', // Match button color with background
          color: '#fff',
          float: 'right',
        }}
        onClick={handleNextClick} // Call handleNextClick on button click
        disabled={!selectedConsumer} // Disable if no consumer is selected
      >
        Next
      </Button>
      </Tooltip>

      {/* Modal to show consumer details */}
      <Modal
        title="Consumer Details"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null} 
        width={600}
        centered
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#f9f9f9',
          }}
        >
          {/* <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
            <strong>RE Index:</strong>
          </p>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            <strong>Consumer:</strong> {modalConsumerDetails?.user__username}
          </p>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            <strong>State:</strong> {modalConsumerDetails?.state}
          </p>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            <strong>Demand:</strong> {modalConsumerDetails?.total_contracted_demand} MW
          </p>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            <strong>Industry:</strong> {modalConsumerDetails?.industry}
          </p> */}

          <Row justify="center" gutter={[16, 16]}>
                {dataSource.map(item => (
                  <React.Fragment key={item.key}>
                    <Col span={12}>
                      <p >{item.label}</p>
                    </Col>
                    <Col span={12}>
                      <p>: {item.value}</p>
                    </Col>
                  </React.Fragment>
                ))}
              </Row>
        </div>
      </Modal>
    </div>
  );
};

export default MatchingConsumerPage;
