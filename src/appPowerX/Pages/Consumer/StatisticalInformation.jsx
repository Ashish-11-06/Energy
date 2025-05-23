/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Select, Table, Row, Col, Card, Radio, message } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useNavigate } from "react-router-dom";
import { fetchModelStatistics, fetchModelStatisticsMonth } from '../../Redux/slices/consumer/modelStatisticsSlice';
import { useDispatch } from 'react-redux';
import { BackwardFilled, BackwardOutlined } from '@ant-design/icons';
// Register Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

const { Option } = Select;

const StatisticalInformation = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate(); 
  const [selectedType, setSelectedType] = useState('MCP'); // Default: MCP chart displayed
  const dispatch = useDispatch();
  const [foreCastedData, setForeCastedData] = useState([]);
  const [pastData, setPastData] = useState([]);
  const [mcvForeCastedData, setMcvForeCastedData] = useState([]);
  const [mcvPastData, setMcvPastData] = useState([]);
  const [formattedDate, setFormattedDate] = useState("");
  const [selectedForecast, setSelectedForecast] = useState('currentDay'); // Default: Current Day
  const [statisticsData, setStatisticsData] = useState(null); // Store both API data
  const [technology, setTechnology] = useState('Day Ahead'); // Define technology as a state variable

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentDayData, monthData] = await Promise.all([
          dispatch(fetchModelStatistics()),
          dispatch(fetchModelStatisticsMonth()),
        ]);

        // Process current day data
        if (currentDayData?.payload?.date) {
          const dateStr = currentDayData.payload.date;
          const date = new Date(dateStr);
          const options = { month: "long", day: "numeric" };
          const formatted = date.toLocaleDateString("en-US", options);
          setFormattedDate(formatted); // Example: "January 30"
        }

        // Set default MCP data for current day
        setTableData(Array.isArray(currentDayData.payload.clean_data) ? currentDayData.payload.clean_data : []);
        setForeCastedData(currentDayData.payload.next_day_predictions.map(item => item.mcp_prediction) || []);
        setPastData(currentDayData.payload.clean_data.map(item => item.mcp) || []);
        setMcvForeCastedData(currentDayData.payload.next_day_predictions.map(item => item.mcv_prediction) || []);
        setMcvPastData(currentDayData.payload.clean_data.map(item => item.mcv_total) || []);

        // Process month data
        const start_date = monthData.payload.start_date;
        const end_date = monthData.payload.end_date;
        if (start_date && end_date) {
          const startMonth = new Date(start_date).toLocaleString("en-US", { month: "short" });
          const endMonth = new Date(end_date).toLocaleString("en-US", { month: "short" });
          setFormattedDate(`${startMonth}-${endMonth}`); // Example: "Dec-Jan"
        }

        // Store both API data for later use
        setStatisticsData({
          currentDay: currentDayData.payload,
          month: monthData.payload,
        });
      } catch (error) {
        message.error(error.message || "Error fetching data");
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (selectedForecast === 'currentDay') {
      setTechnology('Day Ahead');
    } else {
      setTechnology('Month Ahead');
    }
  }, [selectedForecast]); // Update technology whenever selectedForecast changes

  const handleForecastChange = (value) => {
    setSelectedForecast(value);

    if (statisticsData) {
      if (value === 'currentDay' && statisticsData.currentDay) {
        const currentDay = statisticsData.currentDay;
        setTableData(Array.isArray(currentDay.clean_data) ? currentDay.clean_data : []);
        setForeCastedData(currentDay.next_day_predictions?.map(item => item.mcp_prediction) || []);
        setPastData(currentDay.clean_data?.map(item => item.mcp) || []);
        setMcvForeCastedData(currentDay.next_day_predictions?.map(item => item.mcv_prediction) || []);
        setMcvPastData(currentDay.clean_data?.map(item => item.mcv_total) || []);
      } else if (value === 'next30Day' && statisticsData.month) {
        const month = statisticsData.month;
        setTableData(Array.isArray(month.clean_data) ? month.clean_data : []);
        setForeCastedData(month.next_day_predictions?.map(item => item.mcp_prediction) || []);
        setPastData(month.clean_data?.map(item => item.mcp) || []);
        setMcvForeCastedData(month.next_day_predictions?.map(item => item.mcv_prediction) || []);
        setMcvPastData(month.clean_data?.map(item => item.mcv_total) || []);
      }
    }
  };

const dummyAccuracyData = [
  {
    metric: "Accuracy",
    accuracy: "80%",
    errors: "20%"
  },
  {
    metric: "Errors",
    accuracy: "90%",
    errors: "10%"
  }
];

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
  };

  const MCVData = {
    labels: Array.from({ length: 96 }, (_, i) => i + 1), // Generates labels [1, 2, 3, ..., 96]
    datasets: [
      {
        label: "Forecast MCV Data",
        data: mcvForeCastedData.length ? mcvForeCastedData : Array(96).fill(null),
        borderColor: "blue",
        fill: false,
         ticks: {
                  color: 'blue', // Set scale number color for MCP
                },
      },
      {
        label: "Actual MCV Data",
        data: mcvPastData,
        borderColor: "red",
        fill: false,
      },
    ],
  };

  const MCPData = {
    labels: Array.from({ length: 96 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Forecast MCP Data',
        data: foreCastedData.length ? foreCastedData : Array(96).fill(null),
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'Actual MCP Data',
        data: pastData,
        borderColor: 'orange',
        fill: false,
      },
    ],
  };

  // const BothData = {
  //   labels: Array.from({ length: 96 }, (_, i) => i + 1),
  //   datasets: [
  //     {
  //       label: 'Forecast MCP Data (INR/MWh)',
  //       data: foreCastedData.length ? foreCastedData : Array(96).fill(null),
  //       borderColor: 'green',
  //       fill: false,
  //       yAxisID: 'y1',
  //        ticks: {
  //                 color: 'green', // Set scale number color for MCP
  //               },
  //     },
  //     {
  //       label: 'Past MCP Data (INR/MWh)',
  //       data: pastData,
  //       borderColor: 'orange',
  //       fill: false,
  //       yAxisID: 'y1',
  //     },
  //     {
  //       label: 'Forecast MCV Data (MWh)',
  //       data: mcvForeCastedData.length ? mcvForeCastedData : Array(96).fill(null),
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

  const options = {
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
        ticks: {
          color: 'green', // Set scale number color for MCP
          font: {
            weight: 'bold',
            // style: 'italic',
          },
          callback: function(value) {
            return value; // Return the value without modification
          },
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
        ticks: {
          color: 'blue', // Set scale number color for MCP
          font: {
            weight: 'bold',
            // style: 'italic',
          },
          callback: function(value) {
            return value; // Return the value without modification
          },
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
  };

  const columns = [
    { title: 'Details', dataIndex: 'metric', key: 'metric' , width: '30%'},
    { title: 'MCP (INR/MWh)', dataIndex: 'mcp', key: 'mcp' },
    { title: 'MCV (MWh)', dataIndex: 'mcv', key: 'mcv' },
  ];

  const dataSource = [
    {
      key: '1',
      metric: 'Accuracy Level',
      mcp: tableData.find(item => item.metric === 'MCP')?.accuracy || 'N/A',
      mcv: tableData.find(item => item.metric === 'MCV')?.accuracy || 'N/A',
    },
    {
      key: '2',
      metric: 'Error Percentage',
      mcp: tableData.find(item => item.metric === 'MCP')?.errors || 'N/A',
      mcv: tableData.find(item => item.metric === 'MCV')?.errors || 'N/A',
    },
  ];

  const handleDay = () => navigate('/px/consumer/day-ahead');
  const handleMonth = () => navigate('/px/consumer/month-ahead');

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800',fontWeight:'bold' }}>
      Statistical Insights <span style={{fontSize:'20px'}}>({formattedDate})</span>
      </h1>
      {/* Dropdown for Forecast Selection */}
      <label htmlFor="" style={{fontWeight:'600',marginRight:'10px',fontSize:'18px'}}>Select Forecast</label>
      <Select
        defaultValue="currentDay"
        style={{ width: 200, marginBottom: '20px', marginRight: '20px' }}
        onChange={handleForecastChange}
      >
        <Option value="currentDay">Current day</Option>
        <Option value="next30Day">Last 30 days</Option>
      </Select>
      {/* <h1>Model Statistical Information</h1> */}

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
                          max: 100,
                          title: {
                            display: true,
                            text: '96 time blocks',
                          },
                        },
                      },
                      plugins: {
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
                    }} 
                  />
                </div>
              </Card>
            </Col>
          )}
          {selectedType === 'MCV' && (
            <Col span={24} >
              <Card style={{  backgroundColor: 'white' }}>
                <h3> MCV Data</h3>
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
                    options={options} 
                  />
                </div>
              </Card>
            </Col>
          )} */}
        </Row>
      )}

      {/* Table Display */}
      {/* <Table columns={columns} dataSource={dummyAccuracyData} pagination={false} bordered style={{ marginTop: '20px' }} /> */}

      {/* Navigation Buttons */}
      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          {/* <Col style={{marginLeft:'75%'}}>
            <Button onClick={handleMonth}>Month Ahead</Button>
          </Col> */}
          <Col style={{marginLeft:'90%'}}>
            <Button onClick={handleDay} icon={<BackwardOutlined/>}>Back</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StatisticalInformation;