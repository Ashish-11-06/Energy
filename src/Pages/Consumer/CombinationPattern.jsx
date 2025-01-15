import React, { useState, useEffect } from "react";
import { Table, Typography, Row, Col, Spin, message, Progress, Slider, Button } from "antd";
import { Bar, Line, Pie, Bubble, Scatter } from "react-chartjs-2";
import "chart.js/auto";
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchOptimizedCombinations } from "../../Redux/Slices/Generator/optimizeCapacitySlice";
import { fetchConsumptionPattern } from "../../Redux/Slices/Generator/ConsumptionPatternSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import IPPModal from "./Modal/IPPModal";
import RequestForQuotationModal from '../../Components/Modals/RequestForQuotationModal';

const { Title, Text } = Typography;

const CombinationPattern = () => {
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isIPPModalVisible, setIsIPPModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [fetchingCombinations, setFetchingCombinations] = useState(false);
  const [progress, setProgress] = useState(0);
  const { state } = useLocation();
  const navigate = useNavigate();

  const selectedDemandId = state?.requirementId;
  const reReplacement = state?.reReplacement;
  const [sliderValue, setSliderValue] = useState(65); // Default value set to 65

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user')).user;

  // Redux selectors
  const consumptionPatterns = useSelector(
    (state) => state.consumptionPattern?.patterns || []
  );
  const consumptionPatternStatus = useSelector(
    (state) => state.consumptionPattern.status
  );
  const optimizedCombinations = useSelector(
    (state) => state.optimizedCapacity?.combinations || []
  );
  const optimizedCombinationsStatus = useSelector(
    (state) => state.optimizedCapacity.status
  );

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        if (!consumptionPatterns.length && consumptionPatternStatus === "idle" || consumptionPatternStatus === "failed") {
          await dispatch(fetchConsumptionPattern(selectedDemandId));
        }
      } catch (error) {
        message.error("Failed to fetch consumption patterns.");
      }
    };

    const loadCombinations = async () => {
      try {
        setIsTableLoading(true);
        setFetchingCombinations(true);
        if (optimizedCombinationsStatus === "succeeded" && optimizedCombinations) {
          formatAndSetCombinations(optimizedCombinations);
        } else {
          const modalData = {
            requirement_id: selectedDemandId,
            optimize_capacity_user: user.user_category,
          };

          const combi = await dispatch(fetchOptimizedCombinations(modalData));
          const combinations = combi.payload;

          formatAndSetCombinations(combinations);
        }
      } catch (error) {
        message.error("Failed to fetch combinations.");
      } finally {
        setFetchingCombinations(false);
        setIsTableLoading(false);
      }
    };

    const formatAndSetCombinations = (combinations, reReplacementValue) => {
      if (!combinations || typeof combinations !== "object" || !Object.keys(combinations).length) {
        setDataSource([]);
        return;
      }
    
      const formattedCombinations = Object.entries(combinations).map(([key, combination], index) => ({
        key: index + 1,
        srNo: index + 1,
        combination: key,
        technology: [
          { name: "Wind", capacity: `${combination["Optimal Wind Capacity (MW)"]} MW` },
          { name: "Solar", capacity: `${combination["Optimal Solar Capacity (MW)"]} MW` },
          { name: "Battery", capacity: `${combination["Optimal Battery Capacity (MW)"]} MW` },
        ],
        totalCapacity: `${(
          combination["Optimal Wind Capacity (MW)"] +
          combination["Optimal Solar Capacity (MW)"] +
          combination["Optimal Battery Capacity (MW)"]
        ).toFixed(2)} MW`,
        perUnitCost: combination["Per Unit Cost"] && !isNaN(combination["Per Unit Cost"]) ? combination["Per Unit Cost"].toFixed(2) : "N/A",
        cod: combination["greatest_cod"] ? dayjs(combination["greatest_cod"]).format("YYYY-MM-DD") : "N/A",
        reReplacement: reReplacementValue || 65, // Use the updated reReplacement value or default to 65
      }));
    
      setDataSource(formattedCombinations);
    };
    
    fetchPatterns();
    loadCombinations();
  }, [dispatch, selectedDemandId, reReplacement]);

  useEffect(() => {
    if (isTableLoading) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevProgress + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isTableLoading]);

  const handleRowClick = (record) => {
    setSelectedRow(record);
    setIsIPPModalVisible(true);
  };

  const handleIPPCancel = () => {
    setIsIPPModalVisible(false);
  };

  const handleRequestForQuotation = () => {
    setIsIPPModalVisible(false);
    setIsModalVisible(true);
  };

  const handleQuotationModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  const handleOptimizeClick = async () => {
    try {
      setIsTableLoading(true);
      setFetchingCombinations(true);
      const modalData = {
        requirement_id: selectedDemandId,
        optimize_capacity_user: user.user_category,
        reReplacement: sliderValue,
      };
      const combi = await dispatch(fetchOptimizedCombinations(modalData));
      const combinations = combi.payload;
      formatAndSetCombinations(combinations, sliderValue);
    } catch (error) {
      message.error("Failed to fetch combinations.");
    } finally {
      setFetchingCombinations(false);
      setIsTableLoading(false);
    }
  };

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      key: "srNo",
    },
    {
      title: "Combination",
      dataIndex: "combination",
      key: "combination",
    },
    {
      title: "Connectivity",
      dataIndex: "connectivity",
      key: "connectivity",
    },
    {
      title: "Technology",
      dataIndex: "technology",
      key: "technology",
      render: (technologies) => (
        <div>
          {technologies.map((tech, index) => (
            <Text key={index} style={{ display: "block" }}>
              {tech.name}: {tech.capacity}
            </Text>
          ))}
        </div>
      ),
    },
    {
      title: "RE Replacement",
      dataIndex: "reReplacement",
      key: "reReplacement",
    },
    {
      title: "Total Capacity",
      dataIndex: "totalCapacity",
      key: "totalCapacity",
    },
    {
      title: "Per Unit Cost (MW/INR)",
      dataIndex: "perUnitCost",
      key: "perUnitCost",
    },
    {
      title: "COD",
      dataIndex: "cod",
      key: "cod",
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  // Chart data for consumption patterns
const chartData = {
  labels: Array.isArray(consumptionPatterns) ? consumptionPatterns.map((pattern) => pattern.month) : [], // Safely check if it's an array
  datasets: [
    {
      label: "Consumption (MWh)",
      data: Array.isArray(consumptionPatterns) ? consumptionPatterns.map((pattern) => pattern.consumption) : [], // Safely check if it's an array
      backgroundColor: "#4CAF50",
      barThickness: 10, // Set bar thickness
    },
  ],
};
useEffect(() => {
  //console.log(consumptionPatterns, "consumptionPatterns");
}, [consumptionPatterns]);

const staticData = [
  { month: "Jan", consumption: 200, peak: 50, offPeak: 30 },
  { month: "Feb", consumption: 120, peak: 100, offPeak: 40 },
  { month: "Mar", consumption: 130, peak: 240, offPeak: 50 },
  { month: "April", consumption: 140, peak: 80, offPeak: 60 },
  { month: "May", consumption: 150, peak: 200, offPeak: 70 },
  { month: "Jun", consumption: 240, peak: 100, offPeak: 140 },
  { month: "Jul", consumption: 170, peak: 110, offPeak: 90 },
  { month: "Aug", consumption: 180, peak: 120, offPeak: 100 },
  { month: "Sep", consumption: 190, peak: 130, offPeak: 110 },
  { month: "Oct", consumption: 200, peak: 140, offPeak: 120 },
  { month: "Nov", consumption: 210, peak: 150, offPeak: 130 },
  { month: "Dec", consumption: 220, peak: 160, offPeak: 140 },
];

// const staticChartData = {
//   labels: staticData.map((data) => data.month),
//   datasets: [
//     {
//       label: "Consumption (MWh)",
//       data: staticData.map((data) => data.consumption),
//       backgroundColor: "#4CAF50",
//       barThickness: 10, // Set bar thickness
//     },
//     {
//       label: "Peak Consumption (MWh)",
//       data: staticData.map((data) => data.peak),
//       backgroundColor: "#FF5733",
//       barThickness: 10, // Set bar thickness
//     },
//     {
//       label: "Off-Peak Consumption (MWh)",
//       data: staticData.map((data) => data.offPeak),
//       backgroundColor: "#337AFF",
//       barThickness: 10, // Set bar thickness
//     },
//   ],
// };

const lineChartData = {
  labels: staticData.map((data) => data.month),
  datasets: [
    {
      label: "Consumption (MWh)",
      data: staticData.map((data) => data.consumption),
      borderColor: "#4CAF50",
      fill: false,
    },
    {
      label: "Peak Consumption (MWh)",
      data: staticData.map((data) => data.peak),
      borderColor: "#FF5733",
      fill: false,
    },
    {
      label: "Off-Peak Consumption (MWh)",
      data: staticData.map((data) => data.offPeak),
      borderColor: "#337AFF",
      fill: false,
    },
  ],
};

const pieChartData = {
  labels: ["Consumption", "Peak Consumption", "Off-Peak Consumption"],
  datasets: [
    {
      data: [
        staticData.reduce((acc, data) => acc + data.consumption, 0),
        staticData.reduce((acc, data) => acc + data.peak, 0),
        staticData.reduce((acc, data) => acc + data.offPeak, 0),
      ],
      backgroundColor: ["#4CAF50", "#FF5733", "#337AFF"],
    },
  ],
};

const bubbleChartData = {
  datasets: [
    {
      label: "Consumption",
      data: staticData.map((data, index) => ({
        x: index + 1,
        y: data.consumption,
        r: data.consumption / 10,
      })),
      backgroundColor: "#4CAF50",
    },
    {
      label: "Peak Consumption",
      data: staticData.map((data, index) => ({
        x: index + 1,
        y: data.peak,
        r: data.peak / 10,
      })),
      backgroundColor: "#FF5733",
    },
    {
      label: "Off-Peak Consumption",
      data: staticData.map((data, index) => ({
        x: index + 1,
        y: data.offPeak,
        r: data.offPeak / 10,
      })),
      backgroundColor: "#337AFF",
    },
  ],
};

const scatterChartData = {
  datasets: [
    {
      label: "Consumption",
      data: staticData.map((data, index) => ({
        x: index + 1,
        y: data.consumption,
      })),
      backgroundColor: "#4CAF50",
    },
    {
      label: "Peak Consumption",
      data: staticData.map((data, index) => ({
        x: index + 1,
        y: data.peak,
      })),
      backgroundColor: "#FF5733",
    },
    {
      label: "Off-Peak Consumption",
      data: staticData.map((data, index) => ({
        x: index + 1,
        y: data.offPeak,
      })),
      backgroundColor: "#337AFF",
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

  return (
    <div style={{ padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      <Row justify="center" align="middle" gutter={[16, 8]} style={{ height: "100%" }}>
        {/* Consumption Pattern Chart */}
        {/* <Col span={24} style={{ textAlign: "center" }}>
          <Title level={4} style={{ color: "#001529" }}>
            Consumer's Consumption Pattern
          </Title>
        </Col> */}
{/* 
        <Col span={24} style={{ marginBottom: "20px" }}>
          <div
            style={{
              position: "relative",
              width: "80%",
              height: "300px",
              margin: "0 auto",
            }}
          >
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Col> */}

      

        {/* Static Data Line Chart */}
        <Col span={24} style={{ textAlign: "center" }}>
          <Title level={4} style={{ color: "#001529" }}>
            Static Data Line Chart
          </Title>
        </Col>

        <Col span={24} style={{ marginBottom: "20px" }}>
          <div
            style={{
              position: "relative",
              width: "80%",
              height: "300px",
              margin: "0 auto",
            }}
          >
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </Col>


        {/* Combination Table */}
        <Col span={24}>
          <Title level={4} style={{ color: "#001529", marginBottom: "10px" }}>
            Optimized Combinations
          </Title>
          <div style={{ marginBottom: "20px" }}>
            <Slider
              min={0}
              max={100}
              onChange={handleSliderChange}
              value={sliderValue}
              tooltipVisible
            />
            <Button type="primary" onClick={handleOptimizeClick} style={{ marginLeft: "10px" }}>
              Optimize
            </Button>
          </div>
          {isTableLoading ? (
            <>
              <div style={{ textAlign: "center", padding: "10px", width: "100%" }}>
                <Spin size="large" />
              </div>
              <div
                style={{
                  padding: "20px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  color: "#333",
                  textAlign: "center",
                }}
              >
                <Progress percent={progress} strokeColor="#4CAF50" />
                Please wait while we are showing you a best matching IPP...
              </div>
            </>
          ) : dataSource.length > 0 ? (
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              bordered
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E6E8F1",
                overflowX: "auto",
              }}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })}
              scroll={{ x: true }}
            />
          ) : ( 
            <div
              style={{
                padding: "20px",
                fontSize: "18px",
                fontWeight: "bold",
                backgroundColor: "#f8d7da",
                borderRadius: "8px",
                border: "1px solid #f5c6cb",
                color: "#721c24",
                textAlign: "center",
              }}
            >
              No optimized combinations available at the moment. Please try again later.
              
            </div>
          )}
        </Col>

        {/* IPP Modal */}
        {isIPPModalVisible && (
          <IPPModal
            visible={isIPPModalVisible}
            reReplacement={reReplacement}
            ipp={selectedRow}
            onClose={handleIPPCancel}
            onRequestForQuotation={handleRequestForQuotation}
          />
        )}

        {/* Request for Quotation Modal */}
        {isModalVisible && (
          <RequestForQuotationModal
            visible={isModalVisible}
            onCancel={handleQuotationModalCancel}
            data={selectedRow}
            selectedDemandId={selectedDemandId}
            type="generator"
          />
        )}
      </Row>
    </div>
  );
};

export default CombinationPattern;

