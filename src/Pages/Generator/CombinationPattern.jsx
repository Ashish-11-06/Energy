/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
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
  Modal,
} from "antd";
import { Bar, Line, Pie, Bubble, Scatter } from "react-chartjs-2";
import "chart.js/auto";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchOptimizedCombinations } from "../../Redux/Slices/Generator/optimizeCapacitySlice";
import { fetchConsumptionPattern } from "../../Redux/Slices/Generator/ConsumptionPatternSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import IPPModal from "../Consumer/Modal/IPPModal";
import RequestForQuotationModal from "../../Components/Modals/RequestForQuotationModal";
import { fetchOptimizedCombinationsXHR } from "../../Utils/xhrUtils";
import "./CombinationPattern.css"; // Import the custom CSS file
import { fetchSensitivity } from "../../Redux/Slices/Generator/sensitivitySlice";
import { Tooltip as ChartTooltip } from "chart.js";

const { Title, Text } = Typography;

const CombinationPattern = () => {
  //COMBINATION PATTERN SCROLLBAR
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isIPPModalVisible, setIsIPPModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [value, setValue] = useState(65);
  const [selectedRow, setSelectedRow] = useState(null);
  const [fetchingCombinations, setFetchingCombinations] = useState(false);
  const [progress, setProgress] = useState(0);
  const [combinationData, setCombinationData] = useState([]);
  const [tryREreplacement, setTryREreplacement] = useState(false);
  const [consumerDetails, setConsumerDetails] = useState("");
  const [sensitivityData, setSensitivityData] = useState();
  const [showGraph, setShowGraph] = useState(false); // State to control graph visibility
  const { state } = useLocation();
  const navigate = useNavigate();

  const location = useLocation();
  // const selectedDemandId = location.state?.selectedDemandId;
  const selectedDemandId = localStorage.getItem('matchingConsumerId')
  const reReplacement = state?.reReplacement;
  const [sliderValue, setSliderValue] = useState(65); // Default value set to 65

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user")).user;
  const role = user.role;
  const user_id = user.id;

const [isGraphModalVisible, setIsGraphModalVisible] = useState(false); // State to control modal visibility
const [isGraphLoading, setIsGraphLoading] = useState(false); // State to control loader in the button

const handleSensitivity = async () => {
  console.log("clicked");
  setIsGraphLoading(true); // Show loader in the button

  const combinationIds = dataSource.map((item) => item.combination);
  console.log("Extracted combination IDs:", combinationIds); // Log to verify

  const data = {
    requirement_id: selectedDemandId,
    optimize_capacity_user: user.user_category,
    user_id: user.id,
    combinations: combinationIds, // Send combination IDs
  };

  console.log("Payload for sensitivity API:", data); // Log the payload
  
  try {
    const res = await dispatch(fetchSensitivity(data)).unwrap();
    console.log("API response:", res);
    setSensitivityData(res);
    if (res.error) {
      message.error(res.error); // Display error message if any
      setIsGraphLoading(false); // Hide loader in the button
      return;
    }
  } catch (error) {
    console.error("Error fetching sensitivity data:", error);
    message.error("Failed to fetch sensitivity data.");
  } finally {
    setIsGraphLoading(false); // Hide loader in the button
  }
};

const prepareGraphData = () => {
  if (!sensitivityData) return null;

  const labels = [];
  const tariffData = [];
  const finalCostData = [];
  const technologyCombinationData = []; // Store for tooltips

  Object.entries(sensitivityData).forEach(([combination, reReplacements]) => {
    Object.entries(reReplacements).forEach(([reReplacement, data]) => {
      if (typeof data !== "string") {
        labels.push(reReplacement); // X-axis labels

        // Y-axis datasets
        tariffData.push(data["Per Unit Cost"]);
        finalCostData.push(data["Final Cost"]);

        // Store technology combination for tooltips
        technologyCombinationData.push(
          `Solar: ${data["Optimal Solar Capacity (MW)"]} MW, Wind: ${data["Optimal Wind Capacity (MW)"]} MW, Battery: ${data["Optimal Battery Capacity (MW)"]} MW`
        );
      }
    });
  });
  const combinationIds = dataSource.map((item) => item.combination);
  console.log(combinationIds, "combinationIds");
  return {
    labels, // X-axis values (reReplacements)
    datasets: [
      {
        label: "Tariff (INR/kWh)",
        data: tariffData,
        borderColor: "#FF5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Final Cost (INR)",
        data: finalCostData,
        borderColor: "#337AFF",
        backgroundColor: "rgba(51, 122, 255, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
    technologyCombinationData, // Pass separately for tooltips
  };
};

console.log(sensitivityData, "sensitivityData");

const graphOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const index = context.dataIndex;
          const techData = prepareGraphData().technologyCombinationData[index];

          if (context.raw === null) {
            return `${context.label}: Demand cannot be met`;
          }

          return [
            `${context.dataset.label}: ${context.raw}`,
            techData, // Show technology combination in tooltip
          ];
        },
      },
    },
    legend: {
      position: "bottom",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "RE Replacement (%)",
      },
    },
    y: {
      title: {
        display: true,
        text: "Values",
      },
      beginAtZero: true,
    },
  },
};

const handleGraphModalClose = () => {
  setIsGraphModalVisible(false); // Close the modal
};

  const formatAndSetCombinations = (combinations, reReplacementValue) => {
    if (
      !combinations ||
      typeof combinations !== "object" ||
      !Object.keys(combinations).length
    ) {
      setDataSource([]);
      return;
    }
console.log('sensitivity data', sensitivityData);


    // useEffect(() => {
    //   if(!isTableLoading){
    //     window.scrollTo({
    //       top: document.body.scrollHeight,
    //       behavior: "smooth",
    //     });
    //     // console.log('scrolled');
    //   }
    // }, [isTableLoading, setIsTableLoading]);


    const formattedCombinations = Object.entries(combinations).map(
      ([key, combination], index) => {
        const windCapacity = combination["Optimal Wind Capacity (MW)"] || 0;
        const solarCapacity = combination["Optimal Solar Capacity (MW)"] || 0;
        const batteryCapacity =
          combination["Optimal Battery Capacity (MW)"] || 0;
        const annual_demand_met = combination["Annual Demand Met"] || 0;

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
              : 0,
          totalCost:
            combination["Final Cost"] && !isNaN(combination["Final Cost"])
              ? combination["Final Cost"].toFixed(2)
              : 0,
          totalCapacity: `${(
            windCapacity +
            solarCapacity +
            batteryCapacity
          ).toFixed(2)}`,
          perUnitCost:
            combination["Per Unit Cost"] && !isNaN(combination["Per Unit Cost"])
              ? combination["Per Unit Cost"].toFixed(2)
              : 0,
          finalCost:
            combination["FinalCost"] && !isNaN(combination["Final Cost"])
              ? combination["Final Cost"].toFixed(2)
              : 0,
          cod: combination["greatest_cod"]
            ? dayjs(combination["greatest_cod"]).format("YYYY-MM-DD")
            : 0,
          reReplacement:
            reReplacementValue ||
            combination["Annual Demand Offset"]?.toFixed(2) ||
            0, // updated to handle null or undefined values
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

    setDataSource(formattedCombinations);
  };
useEffect(()=> {
if(dataSource?.length<=0) {
      setTryREreplacement(true);
    }
  }, [dataSource]);

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


  // useEffect(() => {
  //   const fetchPatterns = async () => {
  //     try {
  //       if (
  //         (!consumptionPatterns.length &&
  //           consumptionPatternStatus === "idle") ||
  //         consumptionPatternStatus === "failed"
  //       ) {
  //         await dispatch(fetchConsumptionPattern(selectedDemandId));
  //       }
  //     } catch (error) {
  //       message.error("Failed to fetch consumption patterns.");
  //     }
  //   };
  
  useEffect(() => {
    const fetchPatterns = async () => {
      console.log('fetch pattern');
      
      try {
        if (
          (!consumptionPatterns.length &&
            consumptionPatternStatus === "idle") ||
          consumptionPatternStatus === "failed"
        ) {
          const response = await dispatch(
            fetchConsumptionPattern({ id: selectedDemandId, user_id })
          );
          console.log(response);
          setConsumerDetails(response.payload?.consumer_details);
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
               setTimeout(() => {
                        message.error('Please try in lower RE Replacement'); // Display second message after 5 seconds
                    }, 2000); 
              setIsTableLoading(false);
              setFetchingCombinations(false);
              throw new Error(response.error);
            }

            // Success actions
            setCombinationData(response);
            formatAndSetCombinations(response);
            setIsTableLoading(false);
            setFetchingCombinations(false);

            if (dataSource.length > 0) {
              handleSensitivity(); // Call handleSensitivity only if dataSource has data
            }
           
            // Scroll to the bottom of the page
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          },
          (errorMessage) => {
            // Handle network or other fetch errors
            message.error(errorMessage);
            setIsTableLoading(false);
            setFetchingCombinations(false);
            throw new Error(errorMessage);
          }
        );

        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      } catch (error) {
        console.error("Error in loadCombinations:", error);
        message.error("Failed to fetch combinations.");
        setTryREreplacement(true);
        setIsTableLoading(false);
        setFetchingCombinations(false);
      }
    };

    // console.log(combinationData);

    fetchPatterns();
    loadCombinations();
  }, []);

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

const handleSensitivityClick = () => {
  setIsGraphModalVisible(true); // Show the modal
}

  const handleRowClick = (record) => {
    setSelectedRow(record);
    setIsIPPModalVisible(true);
  };

  const re_index = combinationData.re_index || 0;

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

        formatAndSetCombinations(combinations, sliderValue);
        setFetchingCombinations(false);
        setIsTableLoading(false);
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      } catch (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error in handleOptimizeClick:", error);
      message.error(error);
      // message.error("Failed to fetch combinations.");
    } finally {
      setFetchingCombinations(false);
      setIsTableLoading(false);

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  const sliderStyle = {
    height: "20px",
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
        const parts = text.split("-");
        if (parts.length === 4) {
          const a = parts[0];
          const b = parts[1].charAt(0) + parts[1].charAt(parts[1].length - 1);
          const c = parts[2].charAt(0) + parts[2].charAt(parts[2].length - 1);
          const d = parts[3].charAt(0) + parts[3].charAt(parts[3].length - 1);
          return a + b + c + d;
        }
        if (parts.length === 3) {
          const a = parts[0];
          const b = parts[1].charAt(0) + parts[1].charAt(parts[1].length - 1);
          const c = parts[2].charAt(0) + parts[2].charAt(parts[2].length - 1);
          return a + b + c;
        }
        if (parts.length === 2) {
          const a = parts[0];
          const b = parts[1].charAt(0) + parts[1].charAt(parts[1].length - 1);
          return a + b;
        } else {
          return text;
        }
      },
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
    },
    {
      title: "Total Capacity (MW)",
      dataIndex: "totalCapacity",
      key: "totalCapacity",
    },
    {
      title: "Per Unit Cost (INR/kWh)",
      dataIndex: "perUnitCost",
      key: "perUnitCost",
    },
    {
      title: "OA Cost (INR/kWh)",
      dataIndex: "OACost",
      key: "OACost",
    },
    {
      title: "Total Cost (INR/kWh)",
      dataIndex: "totalCost",
      key: "totalCost",
    },
    {
      title: "Per Unit Saving",
      dataIndex: "totalCost",
      key: "totalCost",
    },
    {
      title: "COD",
      dataIndex: "cod",
      key: "cod",
      width: 120,
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) =>
        text !== "Send Quotation" ? (
          <Tooltip title="refer offer">
            <Link
              to={`/offers`}
              style={{ textDecoration: "none", color: "#9A8406" }}
            >
              {text}
            </Link>
          </Tooltip>
        ) : (
          <button
            style={{ padding: "2px 2px" }}
            onClick={() => handleRowClick(record)}
          >
            Initiate Quotation
          </button>
        ),
    },
    {
      title: "Sensitivity",
      key: "sensitivity",
      render: () => (
        <Tooltip 
  title="Please wait while we optimize the model for different RE replacements." 
  disableHoverListener={!isGraphLoading && combinationData} // Disable tooltip when button is enabled
>
  <Button
    type="primary"
    disabled={!combinationData || isGraphLoading} // Button remains disabled while loading or if data is missing
    onClick={handleSensitivityClick}
  >
    {isGraphLoading ? (
      <>
        <Spin size="small" style={{ marginRight: 8 }} />
        Sensitivity
      </>
    ) : (
      "Sensitivity"
    )}
  </Button>
</Tooltip>

      
      
      
      ),
    },
  ];

  const chartData = {
    labels: Array.isArray(consumptionPatterns)
      ? consumptionPatterns.map((pattern) => pattern.month)
      : [],
    datasets: [
      {
        label: "Consumption (MWh)",
        data: Array.isArray(consumptionPatterns)
          ? consumptionPatterns.map((pattern) => pattern.consumption)
          : [],
        backgroundColor: "#4CAF50",
        barThickness: 10,
      },
    ],
  };

  const lineChartData = {
    labels: Array.isArray(consumptionPatterns)
      ? consumptionPatterns.map((pattern) => pattern.month)
      : [],
    datasets: [
      {
        type: "bar",
        label: "Consumption (MWh)",
        data: Array.isArray(consumptionPatterns)
          ? consumptionPatterns.map((pattern) => pattern.consumption)
          : [],
        backgroundColor: "#669800",
        barThickness: 10,
      },
      {
        type: "line",
        label: "Consumption during Peak hours(MWh)",
        data: Array.isArray(consumptionPatterns)
          ? consumptionPatterns.map((pattern) => pattern.peak_consumption)
          : [],
        borderColor: "#FF5733",
        borderWidth: 5,
        fill: false,
      },
      {
        type: "line",
        label: "Consumption during Off-Peak hours(MWh)",
        data: Array.isArray(consumptionPatterns)
          ? consumptionPatterns.map((pattern) => pattern.off_peak_consumption)
          : [],
        borderColor: "#337AFF",
        borderWidth: 5,
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
        min: 0,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
        paddingBottom: "50px",
      }}
    >
      <Row
        justify="center"
        align="middle"
        gutter={[16, 8]}
        style={{ height: "100%" }}
      >
        <Card style={{ width: "100%" }}>
          <Col span={24} style={{ textAlign: "center" }}>
            <Title level={4} style={{ color: "#001529" }}>
              Monthly Demand Pattern
            </Title>
          </Col>
          <Col span={24} style={{ textAlign: "center" }}>
            <p  style={{ color: "#001529" }}>
            Consumer ID: {consumerDetails?.username}
            </p>
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

        <Col
          span={24}
          style={{
            border: "1px solid #669800",
            background: "#E6E8F1",
            padding: "10px",
          }}
        >
          <div>
            <Title
              level={4}
              style={{
                color: "#669800",
                background: "#f8f8f8",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              Choose Your RE transition Goal!
            </Title>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <Card>
              <br />
              <p>(You can change your RE Replacement from below bar. )</p>
              <span>
                <div
                  style={{
                    position: "relative",
                    width: "80%",
                    marginLeft: "5%",
                  }}
                >
                  <Slider
                    min={0}
                    max={100}
                    marks={marks}
                    style={{ width: "80%", marginLeft: "5%", zIndex:0 }}
                    onChange={handleSliderChange}
                    value={`${sliderValue}`}
                    tooltip={{
                      open: !isIPPModalVisible && !isModalVisible,
                    }}
                    trackStyle={{ height: 20 }}
                    handleStyle={{ height: 20, width: 20 }}
                  />
                </div>
                <Button
                  type="primary"
                  onClick={handleOptimizeClick}
                  style={{
                    marginLeft: "80%",
                    transform: "translateY(-46px)",
                  }}
                >
                  Run Optimizer
                </Button>
              </span>
              <br />
            </Card>
          </div>
          <Card>
            <Title
              level={4}
              style={{ color: "#001529", marginBottom: "10px" }}
            >
              Optimized Combination for {value}% RE replacement
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
              </>
            ) : dataSource.length > 0 ? (
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                bordered
                size="small"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E6E8F1",
                  overflowX: "auto",
                }}
                scroll={{ x: true }}
                rowClassName={() => "custom-row"}
              />
            ) : (
              <>
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
              </>
            )}
          </Card>
        </Col>

        <Modal
          title="Sensitivity Analysis Graph"
          visible={isGraphModalVisible}
          onCancel={handleGraphModalClose}
          footer={null}
          width="80%"
          zIndex={5000}
        >
          {sensitivityData ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "400px",
                margin: "0 auto",
              }}
            >
              <Line data={prepareGraphData()} options={graphOptions} />
            </div>
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
              No sensitivity data available. Please fetch data to view the graph.
            </div>
          )}
        </Modal>

        {isIPPModalVisible && (
          <IPPModal
            visible={isIPPModalVisible}
            ipp={selectedRow}
            combination={combinationData}
            consumerDetails={consumerDetails}
            fromGenerator={true}
            fromConsumer={false}
            reIndex={re_index}
            onClose={handleIPPCancel}
            onRequestForQuotation={handleRequestForQuotation}
          />
        )}

        {isModalVisible && (
          <RequestForQuotationModal
            visible={isModalVisible}
            onCancel={handleQuotationModalCancel}
            data={selectedRow}
            selectedDemandId={selectedDemandId}
            fromInitiateQuotation="true"
            type="generator"
          />
        )}
      </Row>
    </div>
  );
};

export default CombinationPattern;
