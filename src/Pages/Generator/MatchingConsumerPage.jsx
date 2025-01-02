import React, { useState, useEffect } from 'react';
import { Table, Radio, Button, message, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import 'antd/dist/reset.css'; // Ensure Ant Design styles are imported

const { Search } = Input;
const { Option } = Select;

const MatchingConsumerPage = () => {
  const [consumers, setConsumers] = useState([]);
  const [filteredConsumers, setFilteredConsumers] = useState([]);
  const [selectedConsumer, setSelectedConsumer] = useState(null); // Track the selected consumer
  const [searchText, setSearchText] = useState('');
  const [filterState, setFilterState] = useState('');
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    // Simulating an API call to get matched consumers data
    const exampleConsumers = [
      { key: 1, state: 'Karnataka', demand: '500 MW', industry: 'Automobile' },
      { key: 2, state: 'Maharashtra', demand: '300 MW', industry: 'Textile' },
      { key: 3, state: 'Rajasthan', demand: '150 MW', industry: 'Construction'},
    ];
    setConsumers(exampleConsumers); // Set the consumers data
    setFilteredConsumers(exampleConsumers); // Set the filtered consumers data
  }, []);

  // Handle radio button change for selecting a consumer
  const handleRadioChange = (e, key) => {
    setSelectedConsumer(key); // Set the selected consumer key
    message.success(`You have selected consumer with Serial No: ${key}`);
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
    let filtered = consumers;

    if (searchText) {
      filtered = filtered.filter(consumer =>
        consumer.state.toLowerCase().includes(searchText.toLowerCase()) ||
       
        consumer.industry.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterState) {
      filtered = filtered.filter(consumer => consumer.state === filterState);
    }

    setFilteredConsumers(filtered);
  };

  // Define the columns for the table
  const columns = [
    {
      title: 'Consumer',
      dataIndex: 'key',
      key: 'key',
      render: (text) => text,
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Demand',
      dataIndex: 'demand',
      key: 'demand',
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: 'Select',
      key: 'select',
      render: (text, record) => (
        <Radio
          onChange={(e) => handleRadioChange(e, record.key)} // Handle radio button selection
          checked={selectedConsumer === record.key}
        />
      ),
    },
  ];

  const handleNextClick = () => {
    if (selectedConsumer) {
      // Navigate to the next page (e.g., /next-page)
      navigate('/generator/subscription-plan', { state: { selectedConsumer } }); // Pass selected consumer as state
    } else {
      message.error('Please select a consumer before proceeding.');
    }
  };

  return (
    <div style={{ padding: '20px', marginTop: '50px', border: "2px" }}>
      <h2>Potential Consumer</h2>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="Search by state or industry"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by state"
          onChange={handleStateFilterChange}
          allowClear
          style={{ width: 200 }}
        >
          <Option value="Karnataka">Karnataka</Option>
          <Option value="Maharashtra">Maharashtra</Option>
          <Option value="Rajasthan">Rajasthan</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={filteredConsumers}
        pagination={false} // Disable pagination for simplicity
        bordered
      />

      {/* Button to show selected consumer */}
      <Button
        type="primary"
        style={{
          marginTop: '20px',
          backgroundColor: selectedConsumer ? '#4CAF50' : '#8C8C8C', // Green if selected, gray otherwise
          borderColor: selectedConsumer ? '#4CAF50' : '#8C8C8C', // Match button color with background
          color: '#fff',
          float: 'right',
        }}
        onClick={handleNextClick} // Call handleNextClick on button click
        disabled={!selectedConsumer} // Disable if no consumer is selected
      >
        Next
      </Button>
    </div>
  );
};

export default MatchingConsumerPage;
