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
  const [combinationData, setCombinationData] = useState([]);
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

// console.log('comn',combinationData);


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

          try {
            const combi = await dispatch(fetchOptimizedCombinations(modalData));
            const combinations = combi.payload;
            console.log('aaaaaaaaaaaaaaaaaa');
            
            console.log('combinationnnnnnnnnn',combinations);
            
            setCombinationData(combi.payload);
            formatAndSetCombinations(combinations);
            console.log('at the end of the try block');
          } catch (error) {
            console.error('Error in dispatch:', error);
            throw error;
          }
        }
      } catch (error) {
        console.error('Error in loadCombinations:', error);
        message.error("Failed to fetch combinations.");
      } finally {
        setFetchingCombinations(false);
        setIsTableLoading(false);
      }
    };

   console.log(combinationData);
   

    const formatAndSetCombinations = (combinations, reReplacementValue) => {
      if (!combinations || typeof combinations !== "object" || !Object.keys(combinations).length) {
        console.log('hiiiiiiii');
        setDataSource([]);
        return;
      }
    
      const formattedCombinations = Object.entries(combinations).map(([key, combination], index) => {
        const windCapacity = combination["Optimal Wind Capacity (MW)"] || 0;
        const solarCapacity = combination["Optimal Solar Capacity (MW)"] || 0;
        const batteryCapacity = combination["Optimal Battery Capacity (MW)"] || 0;
    console.log('format',combination);
    const annual_demand_met=combination["annual_demand_met"];
    console.log(annual_demand_met);
    
    
        return {
          key: index + 1,
          srNo: index + 1,
          combination: key,
          annual_demand_met,
         
          technology: [
            { name: "Wind", capacity: `${windCapacity} MW `},
            { name: "Solar", capacity: `${solarCapacity} MW` },
            { name: "Battery", capacity: `${batteryCapacity} MW` },
          ],
          OACost: combination["OA_cost"] && !isNaN(combination["OA_cost"]) ? combination["OA_cost"].toFixed(2) : "N/A",
          totalCost: combination["Total Cost"] && !isNaN(combination["Total Cost"]) ? combination["Total Cost"].toFixed(2) : "N/A",

          totalCapacity: `${(windCapacity + solarCapacity + batteryCapacity).toFixed(2)} MW`,
          perUnitCost: combination["Per Unit Cost"] && !isNaN(combination["Per Unit Cost"]) ? combination["Per Unit Cost"].toFixed(2) : "N/A",
          finalCost: combination["FinalCost"] && !isNaN(combination["Final Cost"]) ? combination["Final Cost"].toFixed(2) : "N/A",
          cod: combination["greatest_cod"] ? dayjs(combination["greatest_cod"]).format("YYYY-MM-DD") : "N/A",
          reReplacement: reReplacementValue || combination["Annual Demand Offset"]?.toFixed(2) || "NA", // updated to handle null or undefined values
          connectivity: combination.connectivity,
          status: combination.sent_from_you === 1
            ? "Request already sent"
            : <button onClick={() => initiateQuotation(combination)}>Initiate Quotation</button>,
        };
      });
    
      console.log('formatting com');
      setDataSource(formattedCombinations);
    };

    fetchPatterns();
    loadCombinations();
  }, [dispatch, selectedDemandId, reReplacement]);

  // console.log(combinationData, "combinationData");
  // const re_index = combinationData.re_index || "NA";

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

      // const xhr = new XMLHttpRequest();
      // xhr.open("GET", "/path/to/your/api", true); // Update with the actual API endpoint
      // xhr.onprogress = (event) => {
      //   if (event.lengthComputable) {
      //     const percentComplete = (event.loaded / event.total) * 100;
      //     setProgress(percentComplete);
      //   }
      // };
      // xhr.onload = () => {
      //   if (xhr.status === 200) {
      //     setProgress(100);
      //     setIsTableLoading(false);
      //   } else {
      //     message.error("Failed to load data.");
      //     setIsTableLoading(false);
      //   }
      // };
      // xhr.onerror = () => {
      //   message.error("Failed to load data.");
      //   setIsTableLoading(false);
      // };
      // xhr.send();
    }
  }, [isTableLoading]);

  const handleRowClick = (record) => {
    
    setSelectedRow(record); // Record comes from the latest dataSource
    setIsIPPModalVisible(true);
  };
  
  const re_index = combinationData.re_index || "NA";
  console.log(re_index);
  
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
        re_replacement: sliderValue,
      };

      try {
        const combi = await dispatch(fetchOptimizedCombinations(modalData));
        const combinations = combi.payload;

        
        
        // Reformat combinations based on the latest slider value
        formatAndSetCombinations(combinations, sliderValue);
      } catch (error) {
        //console.error('Error in dispatch:', error);
        throw error;
      }
    } catch (error) {
      //console.error('Error in handleOptimizeClick:', error);
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
      title: "IPP Pseudo Name",
      dataIndex: "combination",
      key: "combination",
    },
    {
      title: "Generator's Connectivity",
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
      title: "RE Replacement %",
      dataIndex: "reReplacement",
      key: "reReplacement",
    },
    {
      title: "Total Capacity",
      dataIndex: "totalCapacity",
      key: "totalCapacity",
    },
    {
      title: "Per Unit Cost (INR/KWh)",
      dataIndex: "perUnitCost",
      key: "perUnitCost",
    },
    {
      title: "Total Cost (INR/KWh)",
      dataIndex: "totalCost",
      key: "totalCost",
    },
    {
      title: "OA Cost (INR/KWh)",
      dataIndex: "OACost",
      key: "OACost",
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
            render: (text, record) => (
              text === "Already Sent" ? (
                "Already Sent"
              ) : (
                <button onClick={() => handleRowClick(record)}>
                  Initiate Quotation
                </button>
              )
            ),
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

  const lineChartData = {
    labels: Array.isArray(consumptionPatterns) ? consumptionPatterns.map((pattern) => pattern.month) : [], // Safely check if it's an array
    datasets: [
      {
        label: "Consumption (MWh)",
        data: Array.isArray(consumptionPatterns) ? consumptionPatterns.map((pattern) => pattern.consumption) : [], // Safely check if it's an array
        borderColor: "#4CAF50",
        fill: false,
      },
      {
        label: "Consumption during Peak hours(MWh)",
        data: Array.isArray(consumptionPatterns) ? consumptionPatterns.map((pattern) => pattern.peak_consumption) : [], // Safely check if it's an array
        borderColor: "#FF5733",
        fill: false,
      },
      {
        label: "Consumption during Off-Peak hours(MWh)",
        data: Array.isArray(consumptionPatterns) ? consumptionPatterns.map((pattern) => pattern.off_peak_consumption) : [], // Safely check if it's an array
        borderColor: "#337AFF",
        fill: false,
      },
    ],
  };

  useEffect(() => {
    //console.log(consumptionPatterns, "consumptionPatterns");
  }, [consumptionPatterns]);



  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  console.log(dataSource);

  return (
    <div style={{ padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      <Row justify="center" align="middle" gutter={[16, 8]} style={{ height: "100%" }}>


        {/* Static Data Line Chart */}
        <Col span={24} style={{ textAlign: "center" }}>
          <Title level={4} style={{ color: "#001529" }}>
            Consumption Pattern
          </Title>
        </Col>
        {/* <Tooltip title="Help">
          <Button
            shape="circle"
            icon={<QuestionCircleOutlined />}
            onClick={showInfoModal}
            style={{ position: "absolute",marginLeft:'95%', right: 30 }}
          />
        </Tooltip> */}

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
            <Text>RE Replacement Value</Text>
            <Slider
              min={0}
              max={100}
              onChange={handleSliderChange}
              value={sliderValue}
            />
            <Button type="primary" onClick={handleOptimizeClick} style={{ marginLeft: "10px" }}>
              Optimize
            </Button>
            <p>(You can change your RE Replacement from above bar.If you want to proceed then please select a combination)</p>
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
              // onRow={(record) => ({
              //   onClick: () => handleRowClick(record),
              // })}
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
            // reReplacement={sliderValue} // Pass the latest slider value
            ipp={selectedRow} 
            combination={combinationData}
            // combination={combinationData}         // Ensure selectedRow is updated
            reIndex={re_index} // Pass re_index to the modal
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


