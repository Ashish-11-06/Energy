/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Select, Table, Row, Col, Card, Radio } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useNavigate } from "react-router-dom";
import { fetchDayAheadData, fetchMCPData, fetchMCVData } from '../../Redux/slices/consumer/dayAheadSlice';
import { useDispatch } from 'react-redux';
// import './DayAhead.css';
import { fetchAccuracyData } from '../../Redux/slices/consumer/monthAccuracySlice';

// Register Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

const { Option } = Select;

const StatisticalinformationG = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate(); 
  const [selectedType, setSelectedType] = useState('MCP'); // Default: MCP chart displayed
  const dispatch = useDispatch();
  const [McvData, setMcvData] = useState('');
  const [foreCastedData, setForeCastedData] = useState('');
  const [pastData, setPastData] = useState('');
  const [mcvForeCastedData, setMcvForeCastedData] = useState('');
  const [mcvPastData, setMcvPastData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchAccuracyData());
        console.log(data.payload.data);
        setTableData(Array.isArray(data.payload.data) ? data.payload.data : []);
        // Ensure data is an array
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);

console.log(tableData);


  useEffect(() => {
    const fetchMCP = async () => {
      try {
        const data = await dispatch(fetchMCPData()).unwrap();
        setForeCastedData(data[0]?.data);
        setPastData(data[1]?.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMCP();
  }, [dispatch]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setSelectedType(value);

    if (value === 'MCP') {
      try {
        const data = await dispatch(fetchMCPData()).unwrap();
        setForeCastedData(data[0]?.data);
        setPastData(data[1]?.data);
      } catch (error) {
        console.log(error);
      }
    } else if (value === 'MCV') {
      try {
        const data = await dispatch(fetchMCVData()).unwrap();
        setForeCastedData(data[0]?.data);
        setPastData(data[1]?.data);
      } catch (error) {
        console.log(error);
      }
    } else if (value === 'Both') {
      try {
        const mcpData = await dispatch(fetchMCPData()).unwrap();
        const mcvData = await dispatch(fetchMCVData()).unwrap();
        setForeCastedData(mcpData[0]?.data);
        setPastData(mcpData[1]?.data);
        setMcvForeCastedData(mcvData[0]?.data);
        setMcvPastData(mcvData[1]?.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const MCVData = {
    labels: Array.from({ length: 96 }, (_, i) => i + 1), // Generates labels [1, 2, 3, ..., 96]
    datasets: [
      {
        label: "ForeCasted MCV Data",
        data: foreCastedData,
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Past MCV Data",
        data: pastData,
        borderColor: "red",
        fill: false,
      },
    ],
  };

  const MCPData = {
    labels: Array.from({ length: 96 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'ForeCasted MCP Data',
        data: foreCastedData,
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'Past MCP Data',
        data: pastData,
        borderColor: 'orange',
        fill: false,
      },
    ],
  };

  const BothData = {
    labels: Array.from({ length: 96 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'ForeCasted MCP Data (INR/MWh)',
        data: foreCastedData,
        borderColor: 'green',
        fill: false,
        yAxisID: 'y1',
      },
      {
        label: 'Past MCP Data (INR/MWh)',
        data: pastData,
        borderColor: 'orange',
        fill: false,
        yAxisID: 'y1',
      },
      {
        label: 'ForeCasted MCV Data (MWh)',
        data: mcvForeCastedData,
        borderColor: 'blue',
        fill: false,
        yAxisID: 'y2',
      },
      {
        label: 'Past MCV Data (MWh)',
        data: mcvPastData,
        borderColor: 'red',
        fill: false,
        yAxisID: 'y2',
      },
    ],
  };

  const columns = [
    { title: 'Details', dataIndex: 'metric', key: 'metric' },
    { title: 'MCP', dataIndex: 'mcp', key: 'mcp' },
    { title: 'MCV', dataIndex: 'mcv', key: 'mcv' },
  ];

  const dataSource = [
    {
      key: '1',
      metric: 'Accuracy',
      mcp: tableData.find(item => item.metric === 'MCP')?.accuracy || 'N/A',
      mcv: tableData.find(item => item.metric === 'MCV')?.accuracy || 'N/A',
    },
    {
      key: '2',
      metric: 'Errors',
      mcp: tableData.find(item => item.metric === 'MCP')?.errors || 'N/A',
      mcv: tableData.find(item => item.metric === 'MCV')?.errors || 'N/A',
    },
  ];

  const handleDay = () => navigate('/px/generator/day-ahead');
  const handleMonth = () => navigate('/px/generator/month-ahead');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Model Statistical Information</h1>

      {/* Dropdown for Technology Selection */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '70%', marginBottom: '10px'}}>
        <label htmlFor="" style={{ width: 120, fontWeight: 'bold', marginRight: '0px', fontSize: '20px' }}>Technology: </label>
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
        <Row gutter={[16, 16]} style={{ marginTop: '20px', padding: '10px', marginBottom: '10px' }}>
          {selectedType === 'MCP' && (
            <Col span={24} >
              <Card style={{  backgroundColor: 'white' }}>
                <h3>MCP Data</h3>
                <div>
                  <Line 
                    style={{height:'300px'}} 
                    data={MCPData} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          title: {
                            display: true,
                            text: 'MCP (INR/MWh)',
                          },
                        },
                        x: {
                          type: 'linear',
                          position: 'bottom',
                          min: 0,
                          max: 100,
                          title: {
                            display: true,
                            text: '96 time blocks',
                          },
                        },
                      },
                      plugins: {
                        zoom: {
                          pan: {
                            enabled: true,
                            mode: 'x',
                          },
                          zoom: {
                            wheel: {
                              enabled: true,
                            },
                            pinch: {
                              enabled: true,
                            },
                            mode: 'x',
                          },
                        },
                      },
                    }} 
                  />
                </div>
              </Card>
            </Col>
          )}
          {selectedType === 'MCV' && (
            <Col span={24} >
              <Card style={{  backgroundColor: 'white' }}>
                <h3>MCV Data</h3>
                <div >
                  <Line 
                    style={{height:'300px'}} 
                    data={MCVData} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          title: {
                            display: true,
                            text: 'MCV (MWh)',
                          },
                        },
                        x: {
                          type: 'linear',
                          position: 'bottom',
                          min: 0,
                          max: 100,
                          title: {
                            display: true,
                            text: '96 time blocks',
                          },
                        },
                      },
                      plugins: {
                        zoom: {
                          pan: {
                            enabled: true,
                            mode: 'x',
                          },
                          zoom: {
                            wheel: {
                              enabled: true,
                            },
                            pinch: {
                              enabled: true,
                            },
                            mode: 'x',
                          },
                        },
                      },
                    }} 
                  />
                </div>
              </Card>
            </Col>
          )}
          {selectedType === 'Both' && (
            <Col span={24} >
              <Card style={{  backgroundColor: 'white' }}>
                <h3>MCP and MCV Data</h3>
                <div >
                  <Line 
                    style={{height:'300px'}} 
                    data={BothData} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      scales: {
                        y1: {
                          type: 'linear',
                          position: 'right',
                          title: {
                            display: true,
                            text: 'MCP (INR/MWh)',
                          },
                        },
                        y2: {
                          type: 'linear',
                          position: 'left',
                          title: {
                            display: true,
                            text: 'MCV (MWh)',
                          },
                          grid: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                          },
                        },
                        x: {
                          type: 'linear',
                          position: 'bottom',
                          min: 0,
                          max: 100,
                          title: {
                            display: true,
                            text: '96 time blocks',
                          },
                        },
                      },
                      plugins: {
                        zoom: {
                          pan: {
                            enabled: true,
                            mode: 'x',
                          },
                          zoom: {
                            wheel: {
                              enabled: true,
                            },
                            pinch: {
                              enabled: true,
                            },
                            mode: 'x',
                          },
                        },
                      },
                    }} 
                  />
                </div>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {/* Table Display */}
      <Table columns={columns} dataSource={dataSource} pagination={false} bordered style={{ marginTop: '20px' }} />

      {/* Navigation Buttons */}
      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col style={{marginLeft:'75%'}}>
            <Button onClick={handleMonth}>Month Ahead</Button>
          </Col>
          <Col>
            <Button onClick={handleDay}>Day Ahead</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StatisticalinformationG;