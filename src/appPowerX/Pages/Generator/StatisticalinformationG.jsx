/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Select, Table, Row, Col, Card, Radio } from 'antd';
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

const StatisticalInformationG = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedType, setSelectedType] = useState('MCP'); // Default: MCP chart displayed
  const [forecastType, setForecastType] = useState('currentDay'); // Default: Current Day
  const [formattedDate, setFormattedDate] = useState('');
  const [currentDayData, setCurrentDayData] = useState(null);
  const [past30DaysData, setPast30DaysData] = useState(null);
  const [foreCastedData, setForeCastedData] = useState([]);
  const [pastData, setPastData] = useState([]);
  const [mcvForeCastedData, setMcvForeCastedData] = useState([]);
  const [mcvPastData, setMcvPastData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentDayResponse, past30DaysResponse] = await Promise.all([
          dispatch(fetchModelStatistics()),
          dispatch(fetchModelStatisticsMonth()),
        ]);

        if (currentDayResponse?.payload?.date) {
          const dateStr = currentDayResponse.payload.date;
          const date = new Date(dateStr);
          const options = { month: 'long', day: 'numeric' };
          setFormattedDate(date.toLocaleDateString('en-US', options));
        }

        setCurrentDayData(currentDayResponse.payload);
        setPast30DaysData(past30DaysResponse.payload);

        // Set default data for MCP (Current Day)
        setForeCastedData(currentDayResponse.payload.next_day_predictions.map(item => item.mcp_prediction) || []);
        setPastData(currentDayResponse.payload.clean_data.map(item => item.mcp) || []);
        setMcvForeCastedData(currentDayResponse.payload.next_day_predictions.map(item => item.mcv_prediction) || []);
        setMcvPastData(currentDayResponse.payload.clean_data.map(item => item.mcv_total) || []);
        setTableData(Array.isArray(currentDayResponse.payload.clean_data) ? currentDayResponse.payload.clean_data : []);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
  }, [dispatch]);

  const handleForecastChange = (value) => {
    setForecastType(value);

    if (value === 'currentDay' && currentDayData) {
      setForeCastedData(currentDayData.next_day_predictions.map(item => item.mcp_prediction) || []);
      setPastData(currentDayData.clean_data.map(item => item.mcp) || []);
      setMcvForeCastedData(currentDayData.next_day_predictions.map(item => item.mcv_prediction) || []);
      setMcvPastData(currentDayData.clean_data.map(item => item.mcv_total) || []);
      setTableData(Array.isArray(currentDayData.clean_data) ? currentDayData.clean_data : []);
    } else if (value === 'past30Days' && past30DaysData) {
      setForeCastedData(past30DaysData.next_day_predictions.map(item => item.mcp_prediction) || []);
      setPastData(past30DaysData.clean_data.map(item => item.mcp) || []);
      setMcvForeCastedData(past30DaysData.next_day_predictions.map(item => item.mcv_prediction) || []);
      setMcvPastData(past30DaysData.clean_data.map(item => item.mcv_total) || []);
      setTableData(Array.isArray(past30DaysData.clean_data) ? past30DaysData.clean_data : []);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);

    if (value === 'MCP') {
      setForeCastedData(foreCastedData);
      setPastData(pastData);
    } else if (value === 'MCV') {
      setMcvForeCastedData(mcvForeCastedData);
      setMcvPastData(mcvPastData);
    }
  };

  const MCVData = {
    labels: Array.from({ length: 96 }, (_, i) => i + 1), // Generates labels [1, 2, 3, ..., 96]
    datasets: [
      {
        label: "Forecast MCV Data",
        data: mcvForeCastedData.length ? mcvForeCastedData : Array(96).fill(null),
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Past MCV Data",
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
        label: 'Forecast MCP Data (INR/MWh)',
        data: foreCastedData.length ? foreCastedData : Array(96).fill(null),
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
        label: 'Forecast MCV Data (MWh)',
        data: mcvForeCastedData.length ? mcvForeCastedData : Array(96).fill(null),
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
    { title: 'Details', dataIndex: 'metric', key: 'metric' , width: '30%'},
    { title: 'MCP', dataIndex: 'mcp', key: 'mcp' },
    { title: 'MCV', dataIndex: 'mcv', key: 'mcv' },
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

      {/* Dropdown for Forecast Type Selection */}
      <label htmlFor="" style={{fontWeight:'600',marginRight:'10px',fontSize:'18px'}}>Select Forecast type</label>
      <Select
        defaultValue="currentDay"
        style={{ width: 200, marginBottom: '20px',marginRight:'20px' }}
        onChange={handleForecastChange}
      >
        <Option value="currentDay">Current Day</Option>
        <Option value="past30Days">Past 30 Days</Option>
      </Select>

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
                <h3>{selectedType} Data</h3>
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
                          position: 'bottom',
                          align: 'end',
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
                <h3>{selectedType} Data</h3>
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
                          position: 'bottom',
                          align: 'end',
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
                        legend: {
                          position: 'bottom',
                          align: 'end',
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
      <Col>
            <Button style={{marginLeft:'90%'}} onClick={handleDay} icon={<BackwardOutlined />}>Back</Button>
      </Col>
      </div>
    </div>
  );
};

export default StatisticalInformationG;