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
 const [previousDate,setPreviousDate] = useState(null);
  const [past30DaysStartDate,setPast30DaysStartDate] = useState(null);
  const [past30DaysEndDate,setPast30DaysEndDate] = useState(null);
   const [forecastType, setForecastType] = useState('currentDay'); // Default: Current Day
 const [displayDateLabel, setDisplayDateLabel] = useState('');

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

      if (currentDayData?.payload?.date) {
        const date = new Date(currentDayData.payload.date);
        const options = { month: 'long', day: 'numeric' };
        setPreviousDate(date.toLocaleDateString('en-US', options));
      }

      if (monthData?.payload.start_date) {
        const date = new Date(monthData.payload.start_date);
        const options = { month: 'long', day: 'numeric' };
        setPast30DaysStartDate(date.toLocaleDateString('en-US', options));
      }

      if (monthData?.payload.end_date) {
        const date = new Date(monthData.payload.end_date);
        const options = { month: 'long', day: 'numeric' };
        setPast30DaysEndDate(date.toLocaleDateString('en-US', options));
      }

      // setCurrentDayData(currentDayData.payload);
      // setPast30DaysData(past30DaysResponse.payload);

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
  if (forecastType === 'currentDay') {
    setDisplayDateLabel(formattedDate); // Already something like "July 8"
  } else if (forecastType === 'past30') {
    setDisplayDateLabel(`${past30DaysStartDate} - ${past30DaysEndDate}`); // "June 8 - July 8"
  }
}, [forecastType, formattedDate, past30DaysStartDate, past30DaysEndDate]);



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


  const timeLabels = Array.from({ length: 96 }, (_, i) => {
  const minutes = i * 15;
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return `${hours}:${mins}`;
});

  const MCVData = {
    labels: timeLabels,
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
    labels: timeLabels,
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


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y1: {
        type: 'category',
        position: 'right',
        title: {
          display: true,
          text: 'MCP (INR / MWh)',
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
        type: 'category',
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
        type: 'category',
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
    { title: 'MCP (INR / MWh)', dataIndex: 'mcp', key: 'mcp' },
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

console.log('forecast type',forecastType);
console.log('selected forecsat',selectedForecast);



  return (
    <div style={{ padding: '20px' }}>
          <h1
  style={{
    textAlign: 'center',
    marginBottom: '20px',
    color: '#669800',
    fontWeight: 'bold',
  }}
>
  Statistical Insights{' '}
  <span style={{ fontSize: '20px', fontWeight: 'normal' }}>
    (
    {selectedForecast === 'currentDay'
      ? previousDate
      : `${past30DaysStartDate} - ${past30DaysEndDate}`}
    )
  </span>
</h1>

      {/* Dropdown for Forecast Selection */}
      <label htmlFor="" style={{fontWeight:'600',marginRight:'10px',fontSize:'18px'}}>Select Forecast</label>
      <Select
        defaultValue="currentDay"
        style={{ width: 200, marginBottom: '20px', marginRight: '20px' }}
        onChange={handleForecastChange}
      >
        <Option value="currentDay">Previous day</Option>
        {/* <Option value="next30Day">Last 30 days</Option> */}
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
                            text: 'MCP (INR / MWh)',
                          },
                        },
                     x: {
  type: 'category',
  position: 'bottom',
  ticks: {
    callback: function (val, index, ticks) {
      const isEvery8th = index % 8 === 0;
      const isLastTick = index === ticks.length - 1;
      return isEvery8th || isLastTick ? this.getLabelForValue(val) : '';
    },
  },
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
  type: 'category',
  position: 'bottom',
  ticks: {
    callback: function (val, index, ticks) {
      const isEvery8th = index % 8 === 0;
      const isLastTick = index === ticks.length - 1;
      return isEvery8th || isLastTick ? this.getLabelForValue(val) : '';
    },
  },
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
        </Row>
      )}
      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col style={{marginLeft:'90%'}}>
            <Button onClick={handleDay} icon={<BackwardOutlined/>}>Back</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StatisticalInformation;