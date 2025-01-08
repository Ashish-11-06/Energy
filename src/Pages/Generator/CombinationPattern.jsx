import React, { useState, useEffect } from "react";
import { Table, Typography, Row, Col, Spin, Progress, Slider, Button, message } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import RequestForQuotationModal from '../../Components/Modals/RequestForQuotationModal';  
import { useLocation } from 'react-router-dom';
import { fetchOptimizedCombinations } from "../../Redux/Slices/Generator/optimizeCapacitySlice";
import { useDispatch } from "react-redux";

const { Title, Text } = Typography;

const CombinationPattern = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [sliderValue, setSliderValue] = useState(65);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const location = useLocation();
  const selectedDemandId = location.state?.selectedDemandId;

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user')).user;

  useEffect(() => {
    const fetchData = async () => {
      console.log('Selected demand:', selectedDemandId);
      try {
        setIsLoading(true);
        const modalData = {
          requirement_id: selectedDemandId,
          optimize_capacity_user: "generator",
          generator_id: user.id,
        };

        const combi = await dispatch(fetchOptimizedCombinations(modalData)); // Fetch combinations
  console.log(combi);

        const combinations = combi.payload;

        const formattedCombinations = Object.keys(combinations).map((key, index) => {
          const combination = combinations[key];
          return {
            key: index + 1,
            srNo: index + 1,
            combination: key, // You can use the IPP name as the combination
            technology: [
              { name: 'Wind', capacity: `${combination["Optimal Wind Capacity (MW)"]} MW` },
              { name: 'Solar', capacity: `${combination["Optimal Solar Capacity (MW)"]} MW` },
              { name: 'Battery', capacity: `${combination["Optimal Battery Capacity (MW)"]} MW` },
            ],
            totalCapacity: `${(combination["Optimal Wind Capacity (MW)"] + combination["Optimal Solar Capacity (MW)"] + combination["Optimal Battery Capacity (MW)"]).toFixed(2)} MW`,
            perUnitCost: combination["Per Unit Cost"].toFixed(2),
            cod: "N/A", // You can modify this if you get the actual COD data
          };
        });
  
        setDataSource(formattedCombinations);
      } catch (error) {
        message.error("Failed to fetch combinations.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [selectedDemandId]);
  
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
      title: "Per Unit Cost (₹)",
      dataIndex: "perUnitCost",
      key: "perUnitCost",
    },
    {
      title: "COD",
      dataIndex: "cod",
      key: "cod",
    },
  ];  

  return (
    <div style={{ padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      <Row justify="center" align="middle" gutter={[16, 8]} style={{ height: "100%" }}>
        <Col span={24} style={{ textAlign: "center" }}>
          <Title level={4} style={{ color: "#001529" }}>
            This is the consumer's consumption pattern
          </Title>
        </Col>

        {!isOptimizing && !isLoading && (
          <Col span={24}>
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
            {isModalVisible && (
              <RequestForQuotationModal
                visible={isModalVisible}
                onCancel={handleQuotationModalCancel}
                data={selectedRow}
                type="generator"
              />
            )}
          </Col>
        )}

        {isLoading && (
          <div style={{ textAlign: "center", padding: "10px", width: "90%" }}>
            <Spin size="large" />
          </div>
        )}
      </Row>
    </div>
  );
};

export default CombinationPattern;
