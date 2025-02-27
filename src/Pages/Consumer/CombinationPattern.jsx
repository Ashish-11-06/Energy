import React, { useState, useEffect } from "react"; 
import {
  Table,
  Typography,
  Row,
  Col,
  Spin,
  message,
  Progress,
  Slider,
  Button,
  Card,
  Tooltip,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons"; // Import icons

import { Bar, Line, Pie, Bubble, Scatter } from "react-chartjs-2";
import "chart.js/auto";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchOptimizedCombinations } from "../../Redux/Slices/Generator/optimizeCapacitySlice";
import { fetchConsumptionPattern } from "../../Redux/Slices/Generator/ConsumptionPatternSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import IPPModal from "./Modal/IPPModal";
import RequestForQuotationModal from "../../Components/Modals/RequestForQuotationModal";
import { fetchOptimizedCombinationsXHR } from "../../Utils/xhrUtils";
import "./CombinationPattern.css"; // Import the custom CSS file

const { Title, Text } = Typography;

const CombinationPattern = () => {
  //COMBINATION PATTERN SCROLLBAR
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isIPPModalVisible, setIsIPPModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [ value, setValue ] = useState(65);
  const [fetchingCombinations, setFetchingCombinations] = useState(false);
  const [progress, setProgress] = useState(0);
  const [combinationData, setCombinationData] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  const selectedDemandId = localStorage.getItem("selectedRequirementId");
  const reReplacement = state?.reReplacement;
  const [sliderValue, setSliderValue] = useState(65); // Default value set to 65

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user")).user;
  const role = user.role;
  // console.log(user.id);
  const user_id = user.id;

  const formatAndSetCombinations = (combinations, reReplacementValue) => {
    if (
      !combinations ||
      typeof combinations !== "object" ||
      !Object.keys(combinations).length
    ) {
      // console.log("hiiiiiiii");
      setDataSource([]);
      return;
    }

    const formattedCombinations = Object.entries(combinations).map(
      ([key, combination], index) => {
        const windCapacity = combination["Optimal Wind Capacity (MW)"] || 0;
        const solarCapacity = combination["Optimal Solar Capacity (MW)"] || 0;
        const batteryCapacity =
          combination["Optimal Battery Capacity (MW)"] || 0;
        // console.log("format", combination);
        const annual_demand_met = combination["Annual Demand Met"] || 0;
        // console.log(annual_demand_met);
        // console.log("status", combination.terms_sheet_sent);

        return {
          key: index + 1,
          srNo: index + 1,
          combination: key,
          annual_demand_met,

          technology: [
            { name: "Solar", capacity: `${solarCapacity} MW` },
            { name: "Wind", capacity: `${windCapacity} MW ` },
            { name: "ESS", capacity: `${batteryCapacity} MWh` },
          ],
          OACost:
            combination["OA_cost"] && !isNaN(combination["OA_cost"])
              ? combination["OA_cost"].toFixed(2)
              : "N/A",
          totalCost:
            combination["Final Cost"] && !isNaN(combination["Final Cost"])
              ? combination["Final Cost"].toFixed(2)
              : "N/A",
          totalCapacity: `${(
            windCapacity +
            solarCapacity 
          ).toFixed(2)}`,
          perUnitCost:
            combination["Per Unit Cost"] && !isNaN(combination["Per Unit Cost"])
              ? combination["Per Unit Cost"].toFixed(2)
              : "N/A",
          finalCost:
            combination["FinalCost"] && !isNaN(combination["Final Cost"])
              ? combination["Final Cost"].toFixed(2)
              : "N/A",
          cod: combination["greatest_cod"]
            ? dayjs(combination["greatest_cod"]).format("YYYY-MM-DD")
            : "N/A",
          reReplacement:
            reReplacementValue ||
            combination["Annual Demand Offset"]?.toFixed(2) ||
            "NA", // updated to handle null or undefined values
          connectivity: combination.connectivity,
          states: combination.state,

          status: combination?.terms_sheet_sent
            ? combination?.sent_from_you === 1
              ? "Already Sent"
              : "Already received"
            : "Send Quotation",
        };
      }
    );

    // console.log('tech',tech);
    // console.log("formatting com");
    setDataSource(formattedCombinations);
  };

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

  // console.log('comn', combinationData);

  const increaseValue = () => {
    setSliderValue((prev) => Math.min(prev + 1, 100)); // Increase by 5, max 100
  };

  const decreaseValue = () => {
    setSliderValue((prev) => Math.max(prev - 1, 0)); // Decrease by 5, min 0
  };

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [isTableLoading, setIsTableLoading]);


  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        if (
          (!consumptionPatterns.length &&
            consumptionPatternStatus === "idle") ||
          consumptionPatternStatus === "failed"
        ) {
          const response = await dispatch(
            fetchConsumptionPattern(selectedDemandId)
          );
          // console.log(response);
        }
      } catch (error) {
        message.error("Failed to fetch consumption patterns.");
      }
    };

    const loadCombinations = async () => {
      try {
        setIsTableLoading(true);
        setFetchingCombinations(true);
        setProgress(0); // Reset progress when starting a new fetch

        const modalData = {
          requirement_id: +selectedDemandId,
          optimize_capacity_user: user.user_category,
          user_id: user.id,
        };

        fetchOptimizedCombinationsXHR(
          modalData,
          (percentComplete) => setProgress(percentComplete), // Update progress
          (response) => {
            // If no error, process the response
            if (response?.error) {
              message.error(response.error); // Display error message
              setIsTableLoading(false);
              setFetchingCombinations(false);
              throw new Error(response.error);
            }

            // Success actions
            setCombinationData(response);
            formatAndSetCombinations(response);
            setIsTableLoading(false);
            setFetchingCombinations(false);
          },
          (errorMessage) => {
            // Handle network or other fetch errors
            message.error(errorMessage);
            setIsTableLoading(false);
            setFetchingCombinations(false);
            throw new Error(errorMessage);
          }
        );

        // Scroll to the bottom of the page
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      } catch (error) {
        // console.error("Error in loadCombinations:", error);
        message.error("Failed to fetch combinations.");
        setIsTableLoading(false);
        setFetchingCombinations(false);
      }
    };

    // console.log(combinationData);

    fetchPatterns();
    loadCombinations();
  }, [dispatch, selectedDemandId]);

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

   
    }
  }, [isTableLoading]);

  const handleRowClick = (record) => {
    setSelectedRow(record); // Record comes from the latest dataSource
    setIsIPPModalVisible(true);
  };

  const re_index = combinationData.re_index || "NA";
  // console.log(re_index);

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
    setValue(sliderValue);
    try {
      setIsTableLoading(true);
      setFetchingCombinations(true);

      const modalData = {
        user_id: user_id,
        requirement_id: selectedDemandId,
        optimize_capacity_user: user.user_category,
        re_replacement: sliderValue,
      };

      try {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
        const combinations = await dispatch(
          fetchOptimizedCombinations(modalData)
        ).unwrap();

        // console.log(combinations, "combinations");

        // Reformat combinations based on the latest slider value
        formatAndSetCombinations(combinations, sliderValue);
        setFetchingCombinations(false);
        setIsTableLoading(false);
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      } catch (error) {
        //console.error('Error in dispatch:', error);
        throw error;
      }
    } catch (error) {
      console.error("Error in handleOptimizeClick:", error);
      message.error("Failed to fetch combinations.");
    } finally {
      setFetchingCombinations(false);
      setIsTableLoading(false);

      // Scroll to the bottom of the page
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  const sliderStyle = {
    height: "20px", // Increase the thickness of the slider
  };

  const marks = {
    0: "0%",
    100: "100%",
  };

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      key: "srNo",
      width: 10,
    },
    {
      title: "Combination ID",
      dataIndex: "combination",
      key: "combination",
      width: 120,
      render: (text) => {
        // Extract the parts using split()
        const parts = text.split("-");
        if (parts.length === 4) {
          // Extract the desired parts
          const a = parts[0];
          const b = parts[1].charAt(0) + parts[1].charAt(parts[1].length - 1);
          const c = parts[2].charAt(0) + parts[2].charAt(parts[2].length - 1);
          const d = parts[3].charAt(0) + parts[3].charAt(parts[3].length - 1);
          // Construct the new string
          return a + b + c + d;
        }
        if (parts.length === 3) {
          // Extract the desired parts
          const a = parts[0];
          const b = parts[1].charAt(0) + parts[1].charAt(parts[1].length - 1);
          const c = parts[2].charAt(0) + parts[2].charAt(parts[2].length - 1);
          // Construct the new string
          return a + b + c;
        }
        if (parts.length === 2) {
          // Extract the desired parts
          const a = parts[0];
          const b = parts[1].charAt(0) + parts[1].charAt(parts[1].length - 1); // Extract first and last characters
          // Construct the new string
          return a + b;
        } else {
          // Handle cases where the combination doesn't have the expected format
          return text; // Or return an empty string, or handle the error as needed
        }
      },
    },
    {
      title: "Generator's Connectivity",
      dataIndex: "connectivity",
      key: "connectivity",
      // width: 150,
    },
    {
      title: "Technology",
      dataIndex: "technology",
      key: "technology",
      width: 150,
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
      title: "% RE Replacement",
      dataIndex: "reReplacement",
      key: "reReplacement",
      // width: 100,
    },
    {
      title: "Total Capacity (MW)",
      dataIndex: "totalCapacity",
      key: "totalCapacity",
      // width: 150,
    },
    {
      title: "Per Unit Cost (INR/KWh)",
      dataIndex: "perUnitCost",
      key: "perUnitCost",
      // width: 150,
    },
    {
      title: "OA Cost (INR/KWh)",
      dataIndex: "OACost",
      key: "OACost",
      // width: 150,
    },
    {
      title: "Final Cost (INR/KWh)",
      dataIndex: "totalCost",
      key: "totalCost",
      // width: 150,
    },
    {
      title: "COD",
      dataIndex: "cod",
      key: "cod",
      width: 120,
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
  ];

  if (role !== "view") {
    columns.push({
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => 
        text !== "Send Quotation" ? (
          <Tooltip title="refer offer">
          <Link to={`/offers`} style={{ textDecoration: "none", color: "#9A8406" }}>
            {text}
          </Link>
        </Tooltip>
        ) : (
          <button
            style={{ padding: "2px 2px" }} // Minimize button size
            onClick={() => handleRowClick(record)}
          >
            Initiate Quotation
          </button>
        ),
    });
  }

  // Chart data for consumption patterns
  const chartData = {
    labels: Array.isArray(consumptionPatterns)
      ? consumptionPatterns.map((pattern) => pattern.month)
      : [], // Safely check if it's an array
    datasets: [
      {
        label: "Consumption (MWh)",
        data: Array.isArray(consumptionPatterns)
          ? consumptionPatterns.map((pattern) => pattern.consumption)
          : [], // Safely check if it's an array
        backgroundColor: "#4CAF50",
        barThickness: 10, // Set bar thickness
      },
    ],
  };

  const lineChartData = {
    labels: Array.isArray(consumptionPatterns)
      ? consumptionPatterns.map((pattern) => pattern.month)
      : [], // Safely check if it's an array
    datasets: [
      {
        type: "bar",
        label: "Consumption (MWh)",
        data: Array.isArray(consumptionPatterns)
          ? consumptionPatterns.map((pattern) => pattern.consumption)
          : [], // Safely check if it's an array
        backgroundColor: "#669800",
        barThickness: 10, // Set bar thickness
      },
      {
        type: "line",
        label: "Consumption during Peak hours(MWh)",
        data: Array.isArray(consumptionPatterns)
          ? consumptionPatterns.map((pattern) => pattern.peak_consumption)
          : [], // Safely check if it's an array
        borderColor: "#FF5733",
        borderWidth: 5, // Increase line thickness
        fill: false,
      },
      {
        type: "line",
        label: "Consumption during Off-Peak hours(MWh)",
        data: Array.isArray(consumptionPatterns)
          ? consumptionPatterns.map((pattern) => pattern.off_peak_consumption)
          : [], // Safely check if it's an array
        borderColor: "#337AFF",
        borderWidth: 5, // Increase line thickness
        fill: false,
      },
    ],
  };

  useEffect(() => {
    //console.log(consumptionPatterns, "consumptionPatterns");
  }, [consumptionPatterns]);

  // console.log(consumptionPatterns);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0, // Start the scale from 15
      },
    },
    plugins: {
      legend: {
        position: "bottom", // Move the legend to the bottom
      },
    },
  };

  // console.log(dataSource);

  return (
    <div style={{ padding: "20px", fontFamily: "'Inter', sans-serif", paddingBottom:'50px'}}>
      <Row
        justify="center"
        align="middle"
        gutter={[16, 8]}
        style={{ height: "100%" }}
      >
        {/* Static Data Line Chart */}
        <Card style={{ width: "100%" }}>
          <Col span={24} style={{ textAlign: "center" }}>
            <Title level={4} style={{ color: "#001529" }}>
              Monthly Consumption Pattern
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
        </Card>

        {/* Combination Table */}
        <Col span={24}
          style={{
            border: "1px solid #669800",
            background: '#E6E8F1',
            padding: '10px',
          }}
        >
          <div>
            <Title level={4} style={{ color: "#669800", background:'#f8f8f8', marginBottom: "10px", padding: '10px' }}>
            Choose Your RE transition Goal!
            </Title>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <Card>
              <p>(Scroll the below bar for different RE combination )</p>
              {/* <span> <Text>RE Replacement Value: {sliderValue}%</Text><p>(Scroll the below bar for different RE combination  )</p></span> Display slider value */}
              <span>
                <div
                  style={{
                    position: "relative",
                    width: "80%",
                    marginLeft: "5%",
                  }}
                >
                  {/* Left Arrow Button (Positioned on the Slider Line) */}
                  {/* <Button
                    onClick={decreaseValue}
                    icon={<LeftOutlined />}
                    style={{
                      position: "absolute",
                      left: `${(sliderValue / 100) * 84}%`, // Position based on slider value
                      top: "100%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 10,
                 
                    }}
                  /> */}

                  <Slider
                    min={0}
                    max={100}
                    marks={marks} // Add marks to the slider
                    style={{ width: "80%", marginLeft: "5%" }}
                    onChange={handleSliderChange}
                    value={`${sliderValue}`}
                    tooltip={{ open: !isIPPModalVisible && !isModalVisible }} // Correct way to control tooltip visibility
                    trackStyle={{ height: 20 }} // Increase the thickness of the slider line
                    handleStyle={{ height: 20, width: 20 }} // Optionally, increase the size of the handle
                  />
                  {/* Right Arrow Button (Positioned on the Slider Line) */}
                  {/* <Button
                    onClick={increaseValue}
                    icon={<RightOutlined />}
                    style={{
                      position: "absolute",
                      left: `${(sliderValue / 100) * 80}%`, // Position based on slider value
                      top: "100%",
                      transform: "translate(50%, -50%)",
                      zIndex: 10,
                      background: 'none !important',
                      marginLeft: "30px",
                  
                    }}
                  /> */}
                </div>
                <Button
                  type="primary"
                  onClick={handleOptimizeClick}
                  style={{ marginLeft: "80%", transform: "translateY(-46px)" }}
                >
                  Run Optimizer
                </Button>
              </span>
              <br />
            </Card>
          </div>
          <Card
        
          >
            <Title level={4} style={{ color: "#001529", marginBottom: "10px" }}>
              Optimized Combinations for {value}% RE replacement
            </Title>
            {isTableLoading ? (
              <>
                <div
                  style={{
                    textAlign: "center",
                    padding: "10px",
                    width: "100%",
                  }}
                >
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
                  Please wait while we are showing you a best matching IPP...
                </div>
                {/* <Progress percent={progress} /> */}
              </>
            ) : dataSource.length > 0 ? (
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                bordered
                size="small" // Adjust table size
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E6E8F1",
                  overflowX: "auto",
                  // padding: '5px 10px'
                }}
                scroll={{ x: true }}
                rowClassName={() => "custom-row"} // Add a custom row class
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
                No optimized combinations available at the moment. Please try
                again later.
              </div>
            )}
          </Card>
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
