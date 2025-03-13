/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Select, Table, Row, Col, Card, Radio } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useNavigate } from "react-router-dom";
import { fetchDayAheadData, fetchMCPData, fetchMCVData } from '../../Redux/slices/consumer/dayAheadSlice';
import { useDispatch } from 'react-redux';
import './DayAhead.css';
import { fetchAccuracyData } from '../../Redux/slices/consumer/monthAccuracySlice';

// Register Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

const { Option } = Select;

const StatisticalInfoMonth = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate(); 
  const [selectedType, setSelectedType] = useState('MCP'); // Default: MCP chart displayed
  const dispatch = useDispatch();
  const [McvData, setMcvData] = useState('');
  const [foreCastedData, setForeCastedData] = useState('');
  const [pastData, setPastData] = useState('');
  const [mcvForeCastedData, setMcvForeCastedData] = useState('');
  const [mcvPastData, setMcvPastData] = useState('');

  const dummyAccuracyData = [
    {
      metric: "MCP",
      accuracy: "80%",
      errors: "20%"
    },
    {
      metric: "MCV",
      accuracy: "90%",
      errors: "10%"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchAccuracyData());
        console.log(data.payload.data);
        setTableData(Array.isArray(data.payload.data) ? data.payload.data : dummyAccuracyData);
        // Ensure data is an array
      } catch (error) {
        console.log(error);
        setTableData(dummyAccuracyData);
      }
    };
    fetchData();
  }, [dispatch]);

console.log(tableData);

const dummyMCVData = [
  {
    label: "ForeCasted Values",
    data: [2900, 2800, 2700, 2600, 2500, 2400, 2300, 2200, 2100, 2000, 1900, 1800, 1700, 1600, 1500, 1400, 1300, 1200, 1100, 1000, 900, 800, 700, 2000, 5000, 4000, 2000, 1300, 4500, 3200, 3800, 4100, 2900, 3050, 2700, 3300, 2950, 4100, 4200
    ],
    id: "d5df"
  },
  {
    label: "Past Values",
    data: [5550, 5650, 5750, 5850, 5950, 6050, 6150, 6250, 6350, 6450, 6550, 6650, 6750, 6850, 6950, 7050, 7150, 7250, 7350, 7450, 7550, 7650, 7750, 7850, 7950, 8050, 8150, 8250, 8350, 8450, 8550, 8650, 8750, 8850, 8950, 9050, 9150, 9250, 9350, 9450, 9550, 9650, 9750, 9850, 9950, 10050, 10150, 10250, 10350, 10450, 10550, 10650, 10750, 10850, 10950, 10050, 10000
    ],
    id: "83b6"
  }
];

const dummyMCPData = [
  {
    label: "ForeCasted Values",
    data: [5.21, 5.07, 5.4, 5.58, 4.92, 6.34, 6.91, 5.3, 5.68, 5.21, 4.22, 5.58, 5.58, 4.26, 2.57, 5.11, 3.79, 2.19, 5.11, 4.41, 4.55, 6.06, 2.85, 6.81, 6.53, 4.17, 2.28, 3.32, 6.62, 5.3, 3.23, 2.94, 6.39, 6.29, 6.72, 5.11, 3.6, 2, 5.77, 6.43, 6.15, 4.08, 4.36, 4.08, 4.74, 6.62, 6.06, 4.12, 3.42, 4.03, 3.04, 5.4, 3.7, 6.06, 4.17, 6.81, 4.97, 4.64
    ],
    id: "cca7"
  },
  {
    label: "Past Values",
    data: [
      2.93, 3.33, 4.61, 2.76, 4.67, 5.31, 4.67, 6.97, 4.23, 3.77, 3.93, 5.8, 3.37, 4.97, 4.03, 4.04, 3.59, 3.14, 3.59, 4.53, 3.02, 6.89, 2.89, 5.22, 4.22, 6.23, 6.05, 6.6, 6.35, 4.16, 6.96, 6.37, 4.43, 4.84, 4.53, 2.52, 3.95, 2.8, 5.33, 5.24, 6.87, 5.74, 4.58, 2.65, 3.24, 4.42, 4.9, 4.03, 4, 6.33, 2.58, 5.24, 5.23, 6.7, 6.21, 2.09, 2.36, 3.71, 6.2
    ],
    id: "4e97"
  }
];
  useEffect(() => {
    const fetchMCP = async () => {
      try {
        const data = await dispatch(fetchMCPData()).unwrap();
        setForeCastedData(data[0]?.data || dummyMCPData[0].data);
        setPastData(data[1]?.data || dummyMCPData[1].data);
      } catch (error) {
        console.log(error);
        setForeCastedData(dummyMCPData[0].data);
        setPastData(dummyMCPData[1].data);
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
        setForeCastedData(data[0]?.data || dummyMCPData[0].data);
        setPastData(data[1]?.data || dummyMCPData[1].data);
      } catch (error) {
        console.log(error);
        setForeCastedData(dummyMCPData[0].data);
        setPastData(dummyMCPData[1].data);
      }
    } else if (value === 'MCV') {
      try {
        const data = await dispatch(fetchMCVData()).unwrap();
        setForeCastedData(data[0]?.data || dummyMCVData[0].data);
        setPastData(data[1]?.data || dummyMCVData[1].data);
      } catch (error) {
        console.log(error);
        setForeCastedData(dummyMCVData[0].data);
        setPastData(dummyMCVData[1].data);
      }
    } else if (value === 'Both') {
      try {
        const mcpData = await dispatch(fetchMCPData()).unwrap();
        const mcvData = await dispatch(fetchMCVData()).unwrap();
        setForeCastedData(mcpData[0]?.data || dummyMCPData[0].data);
        setPastData(mcpData[1]?.data || dummyMCPData[1].data);
        setMcvForeCastedData(mcvData[0]?.data || dummyMCVData[0].data);
        setMcvPastData(mcvData[1]?.data || dummyMCVData[1].data);
      } catch (error) {
        console.log(error);
        setForeCastedData(dummyMCPData[0].data);
        setPastData(dummyMCPData[1].data);
        setMcvForeCastedData(dummyMCVData[0].data);
        setMcvPastData(dummyMCVData[1].data);
      }
    }
  };

  const MCVData = {
    labels: Array.from({ length: 31 }, (_, i) => i + 1), // Generates labels [1, 2, 3, ..., 31]
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
    labels: Array.from({ length: 31 }, (_, i) => i + 1),
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

  // const BothData = {
  //   labels: Array.from({ length: 31 }, (_, i) => i + 1),
  //   datasets: [
  //     {
  //       label: 'ForeCasted MCP Data (INR/MWh)',
  //       data: foreCastedData,
  //       borderColor: 'green',
  //       fill: false,
  //       yAxisID: 'y1',
  //     },
  //     {
  //       label: 'Past MCP Data (INR/MWh)',
  //       data: pastData,
  //       borderColor: 'orange',
  //       fill: false,
  //       yAxisID: 'y1',
  //     },
  //     {
  //       label: 'ForeCasted MCV Data (MWh)',
  //       data: mcvForeCastedData,
  //       borderColor: 'blue',
  //       fill: false,
  //       yAxisID: 'y2',
  //     },
  //     {
  //       label: 'Past MCV Data (MWh)',
  //       data: mcvPastData,
  //       borderColor: 'red',
  //       fill: false,
  //       yAxisID: 'y2',
  //     },
  //   ],
  // };

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

  const handleDay = () => navigate('/px/consumer/day-ahead');
  const handleMonth = () => navigate('/px/consumer/month-ahead');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Model Statistical Information</h1>

      {/* Dropdown for Technology Selection */}
      {/* <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '70%', marginBottom: '10px'}}>
        <label htmlFor="" style={{ width: 120, fontWeight: 'bold', marginRight: '0px', fontSize: '20px' }}>Technology: </label>
        <Select placeholder="Select Technology" style={{ width: 200 }} onChange={handleChange}>
          <Option value="Solar">Solar</Option>
          <Option value="Non-solar">Non-solar</Option>
          <Option value="Hydro">Hydro</Option>
        </Select>
      </div> */}

      {/* Radio Buttons for Chart Selection */}
      <Radio.Group value={selectedType} onChange={handleChange}>
        <Radio value="MCP">MCP</Radio>
        <Radio value="MCV">MCV</Radio>
        {/* <Radio value="Both">Both</Radio> */}
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
                          max: 31,
                          title: {
                            display: true,
                            text: '31 time blocks',
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
                          legend: {
                            display: true,
                            position: 'bottom', // Position legends at the bottom
                            align: 'end', // Align legends to the right
                            labels: {
                              // usePointStyle: true, // Use point style for legend items
                              padding: 20, // Add padding around legend items
                            },
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
                          max: 31,
                          title: {
                            display: true,
                            text: '31 time blocks',
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
                          legend: {
                            display: true,
                            position: 'bottom', // Position legends at the bottom
                            align: 'end', // Align legends to the right
                            labels: {
                              // usePointStyle: true, // Use point style for legend items
                              padding: 20, // Add padding around legend items
                            },
                          },
                        },
                      },
                    }} 
                  />
                </div>
              </Card>
            </Col>
          )}
          {/* {selectedType === 'Both' && (
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
                          max: 31,
                          title: {
                            display: true,
                            text: '31 time blocks',
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
                          legend: {
                            display: true,
                            position: 'bottom', // Position legends at the bottom
                            align: 'end', // Align legends to the right
                            labels: {
                              // usePointStyle: true, // Use point style for legend items
                              padding: 20, // Add padding around legend items
                            },
                          },
                        },
                      },
                    }} 
                  />
                </div>
              </Card>
            </Col>
          )} */}
        </Row>
      )}

      {/* Table Display */}
      <Table columns={columns} dataSource={dataSource} pagination={false} bordered style={{ marginTop: '20px' }} />

      {/* Navigation Buttons */}
      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col style={{marginLeft:'83%'}}>
            <Button onClick={handleMonth}>Month Ahead</Button>
          </Col>
          {/* <Col>
            <Button onClick={handleDay}>Day Ahead</Button>
          </Col> */}
        </Row>
      </div>
    </div>
  );
};

export default StatisticalInfoMonth;