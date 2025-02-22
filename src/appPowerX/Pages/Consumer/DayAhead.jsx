import React, { useState, useEffect } from 'react';
import { Button, Select, Table, Row, Col, Card, Radio } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from "react-router-dom";
import { fetchDayAheadData, fetchMCPData, fetchMCVData } from '../../Redux/slices/consumer/dayAheadSlice';
import { useDispatch } from 'react-redux';
import './DayAhead.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const { Option } = Select;

const DayAhead = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate(); 
  const [selectedType, setSelectedType] = useState(null); // Default: No chart displayed
  const dispatch = useDispatch();
  const [McvData,setMcvData]=useState('');
  const [foreCastedData,setForeCastedData]=useState('');
  const [pastData,setPastData]=useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchDayAheadData());
        console.log(data.payload);
        setTableData(data.payload);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMCPData())
      .unwrap()
      .then((data) => {
        console.log(data);
        
        // console.log(data[0]?.data);  
        setForeCastedData(data[0]?.data) 
        setPastData(data[1]?.data)
        // setMcvData(data);
      })
      .catch((error) => console.log(error));
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchMCVData())
      .unwrap()
      .then((data) => {
        console.log(data);
        
        // console.log(data[0]?.data);  
        setForeCastedData(data[0]?.data) 
        setPastData(data[1]?.data)
        // setMcvData(data);
      })
      .catch((error) => console.log(error));
  }, [dispatch]);
  
// console.log(foreCastedData);
// console.log(pastData);


  const handleChange = (e) => {
    console.log(e.target.value);
    setSelectedType(e.target.value);
  };

  const MCVData = {
    labels: Array.from({ length: 96 }, (_, i) => i + 1), // Generates labels [1, 2, 3, ..., 96]
    datasets: [
      {
        label: "ForeCasted Values",
        data: foreCastedData,
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Past Values",
        data: pastData,
        borderColor: "red",
        fill: false,
      },
    ],
  };
  

  const MCPData = {
    labels: [1, 2, 3, 4, 5, 6, 7, 8],
    datasets: [
      {
        label: 'ForeCasted Values',
        data: [2000, 5000, 4000, 2000, 1300, 2900, 3100, 1000],
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'Past Values',
        data: [3000, 3000, 3000, 2088, 2341, 1020, 2000, 3200],
        borderColor: 'orange',
        fill: false,
      },
    ],
  };

  const columns = [
    { title: 'Details', dataIndex: 'metric', key: 'metric' },
    { title: 'MCP (INR/MWh)', dataIndex: 'mcp', key: 'mcp' },
    { title: 'MCV (MWh)', dataIndex: 'mcy', key: 'mcy' },
  ];

  const handleNextTrade = () => navigate('/px/consumer/plan-trade-page');
  const handleStatistics = () => navigate('/px/consumer/statistical-information');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Day Ahead Forecasted Market</h1>

      {/* Dropdown for Technology Selection */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '70%', marginBottom: '10px'}}>
  <label htmlFor="" style={{ width: 120,fontWeight:'bold',marginRight:'0px',fontSize:'20px' }}>Technology: </label>
  <Select placeholder="Select Technology" style={{ width: 200 }} onChange={handleChange}>
    <Option value="Solar">Solar</Option>
    <Option value="Non-solar">Non-solar</Option>
    <Option value="Hydro">Hydro</Option>
  </Select>
</div>

      {/* Radio Buttons for Chart Selection */}
      <Radio.Group value={selectedType} onChange={handleChange}>
        <Radio value="MCP">MCP</Radio>
        <Radio value="MCV">MCV</Radio>
        <Radio value="Both">Both</Radio>
      </Radio.Group>

      {/* Conditional Rendering of Graphs */}
      {selectedType && (
        <Row gutter={[16, 16]} style={{ marginTop: '20px', padding: '10px', marginBottom: '10px', height: '50vh' }}>
        {selectedType === 'MCP' && (
          <Col span={24} style={{ height: '80vh' }}>
            <Card style={{ height: '100%' }}>
              <h3>MCP Data</h3>
              <div style={{ height: '90%' }}>
                <Line data={MCPData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </Card>
          </Col>
        )}
        {selectedType === 'MCV' && (
          <Col span={24} style={{ height: '80vh' }}>
            <Card style={{ height: '100%' }}>
              <h3>MCV Data</h3>
              <div style={{ height: '90%' }}>
                <Line data={MCVData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </Card>
          </Col>
        )}
        {selectedType === 'Both' && (
          <>
            <Col span={12} style={{ height: '80vh' }}>
              <Card style={{ height: '100%' }}>
                <h3>MCP Data</h3>
                <div style={{ height: '90%' }}>
                  <Line data={MCPData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </Card>
            </Col>
            <Col span={12} style={{ height: '80vh' }}>
              <Card style={{ height: '100%' }}>
                <h3>MCV Data</h3>
                <div style={{ height: '90%' }}>
                  <Line data={MCVData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </Card>
            </Col>
          </>
        )}
      </Row>
      
      )}

      {/* Table Display */}
      <Table columns={columns} dataSource={tableData} pagination={false} bordered style={{ marginTop: '20px' }} />

      {/* Navigation Buttons */}
      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col>
            <Button onClick={handleStatistics}>Model Statistics</Button>
          </Col>
          <Col>
            <Button onClick={handleNextTrade}>Plan Your Next Day Trading</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DayAhead;
