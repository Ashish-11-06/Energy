import React, { useState, useEffect } from "react";
import { Table, Typography, Row, Col, Spin, message } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import RequestForQuotationModal from '../../Components/Modals/RequestForQuotationModal';
import { useLocation } from 'react-router-dom';
import { fetchOptimizedCombinations } from "../../Redux/Slices/Generator/optimizeCapacitySlice";
import { fetchConsumptionPattern } from "../../Redux/Slices/Generator/ConsumptionPatternSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const CombinationPattern = () => {
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [fetchingCombinations, setFetchingCombinations] = useState(false);
  const location = useLocation();
  const selectedDemandId = location.state?.selectedDemandId;

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
        console.log(consumptionPatterns, consumptionPatternStatus, 'consumptionPatterns');
        if (!consumptionPatterns.length && consumptionPatternStatus === "idle") {
          console.log("Fetching consumption patterns");
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
        console.log(optimizedCombinationsStatus, optimizedCombinations, 'adfadasfdas');
        // Use combinations from the store if available
        if (optimizedCombinationsStatus === "succeeded" && optimizedCombinations) {
          formatAndSetCombinations(optimizedCombinations);
          console.log("Combinations from store");
        } else {
          // Fetch from API if not in store
          const modalData = {
            requirement_id: selectedDemandId,
            optimize_capacity_user: "generator",
            generator_id: user.id,
          };

          const combi = await dispatch(fetchOptimizedCombinations(modalData));
          const combinations = combi.payload;

          formatAndSetCombinations(combinations);
        }
      } catch (error) {
        message.error("Failed to fetch combinations.");
        console.log(error);
        console.log(combinatio)
      } finally {
        setFetchingCombinations(false);
        setIsTableLoading(false);
      }
    };

    const formatAndSetCombinations = (combinations) => {
      // Use Object.entries to convert the object into an array of [key, value] pairs
      const formattedCombinations = Object.entries(combinations).map(([key, combination], index) => {
        return {
          key: index + 1,
          srNo: index + 1,
          combination: key,  // Use the key as the combination name
          technology: [
            { name: 'Wind', capacity: `${combination["Optimal Wind Capacity (MW)"]} MW` },
            { name: 'Solar', capacity: `${combination["Optimal Solar Capacity (MW)"]} MW` },
            { name: 'Battery', capacity: `${combination["Optimal Battery Capacity (MW)"]} MW` },
          ],
          totalCapacity: `${(
            combination["Optimal Wind Capacity (MW)"] + 
            combination["Optimal Solar Capacity (MW)"] + 
            combination["Optimal Battery Capacity (MW)"]
          ).toFixed(2)} MW`,
          perUnitCost: combination["Per Unit Cost"] && !isNaN(combination["Per Unit Cost"]) ? combination["Per Unit Cost"].toFixed(2) : "N/A",  // Ensure this value is valid
          cod: combination["greatest_cod"] ? dayjs(combination["greatest_cod"]).format('YYYY-MM-DD') : "N/A",  // Format COD date if available
        };
      });
    
      setDataSource(formattedCombinations);
    };
     

    fetchPatterns();
    loadCombinations();
  }, []);

  const handleRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const handleQuotationModalCancel = () => {
    setIsModalVisible(false);
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
      title: "Total Capacity",
      dataIndex: "totalCapacity",
      key: "totalCapacity",
    },
    {
      title: "Per Unit Cost (MW/₹)",
      dataIndex: "perUnitCost",
      key: "perUnitCost",
    },
    {
      title: "COD",
      dataIndex: "cod",
      key: "cod",
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
    },
  ];

  // Chart data for consumption patterns
 // Chart data for consumption patterns
const chartData = {
  labels: Array.isArray(consumptionPatterns) ? consumptionPatterns.map((pattern) => pattern.month) : [], // Safely check if it's an array
  datasets: [
    {
      label: "Consumption (kWh)",
      data: Array.isArray(consumptionPatterns) ? consumptionPatterns.map((pattern) => pattern.consumption) : [], // Safely check if it's an array
      backgroundColor: "#4CAF50",
    },
  ],
};
useEffect(() => {
  console.log(consumptionPatterns, "consumptionPatterns");
}, [consumptionPatterns]);



  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      <Row justify="center" align="middle" gutter={[16, 8]} style={{ height: "100%" }}>
        {/* Consumption Pattern Chart */}
        <Col span={24} style={{ textAlign: "center" }}>
          <Title level={4} style={{ color: "#001529" }}>
            Consumer's Consumption Pattern
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
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Col>

        {/* Combination Table */}
        <Col span={24}>
          <Title level={4} style={{ color: "#001529", marginBottom: "10px" }}>
            Optimized Combinations
          </Title>
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
    Please wait while we are optimizing your best combination...
  </div>
            </>
            
          ) : (
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
          )}
        </Col>

        {/* Modal for Quotation */}
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
