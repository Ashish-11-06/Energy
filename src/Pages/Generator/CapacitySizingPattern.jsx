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
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import IPPModal from "../Consumer/Modal/IPPModal";
import RequestForQuotationModal from "../../Components/Modals/RequestForQuotationModal";
import { fetchCapacitySizing } from "../../Redux/Slices/Generator/capacitySizingSlice";
import "./CombinationPattern.css";

const { Title, Text } = Typography;

const CombinationPatternCap = () => {
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
  const [consumerDetails, setConsumerDetails] = useState('');
  const { state } = useLocation(); // Access navigation state
  const navigate = useNavigate();
  const [monthlyConsumption, setMonthlyConsumption] = useState([]); // State for monthly consumption

  const location = useLocation();
  const reReplacement = state?.reReplacement;
  const [sliderValue, setSliderValue] = useState(65); // Default value set to 65

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user")).user;
  const role = user.role;
  const user_id = user.id;

  const formatAndSetCombinations = (combinations, reReplacementValue) => {
    if (
      !combinations ||
      typeof combinations !== "object" ||
      !Object.keys(combinations).length
    ) {
      setDataSource([]);
      return;
    }

    const formattedCombinations = Object.entries(combinations).map(
      ([key, combination], index) => {
        const windCapacity = combination["Optimal Wind Capacity (MW)"] || 0;
        const solarCapacity = combination["Optimal Solar Capacity (MW)"] || 0;
        const batteryCapacity = combination["Optimal Battery Capacity (MW)"] || 0;
        const annualDemandMet = combination["Annual Demand Met"] || 0;
        const annualCurtailment = combination["Annual Curtailment"] || 0;

        return {
          key: index + 1,
          srNo: index + 1,
          combination: key,
          annualDemandMet,
          annualCurtailment,
          technology: [
            { name: "Solar", capacity: `${solarCapacity} MW` },
            { name: "Wind", capacity: `${windCapacity} MW` },
            { name: "ESS", capacity: `${batteryCapacity} MWh` },
          ],
          OACost:
            combination["OA_cost"] && !isNaN(combination["OA_cost"])
              ? combination["OA_cost"].toFixed(2)
              : 0,
          totalCost:
            combination["Total Cost"] && !isNaN(combination["Total Cost"])
              ? combination["Total Cost"].toFixed(2)
              : 0,
          perUnitCost:
            combination["Per Unit Cost"] && !isNaN(combination["Per Unit Cost"])
              ? combination["Per Unit Cost"].toFixed(2)
              : 0,
          finalCost:
            combination["Final Cost"] && !isNaN(combination["Final Cost"])
              ? combination["Final Cost"].toFixed(2)
              : 0,
          reReplacement:
            reReplacementValue ||
            combination["Annual Demand Offset"]?.toFixed(2) ||
            0,
        };
      }
    );
    setDataSource(formattedCombinations);
  };

  useEffect(() => {
    if (dataSource?.length <= 0) {
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

  useEffect(() => {
    if (state?.data) {
      const { combinations } = state.data;
      if (combinations) {
        formatAndSetCombinations(combinations, sliderValue); // Display data passed from GeneratorInput
      console.log(combinations);
      
      }
      setIsTableLoading(false); // Stop loader if data is already available
    } else if (state?.error) {
      message.error(state.error);
      setIsTableLoading(false); // Stop loader if there's an error
    }
  }, [state]);

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
    try {
      setIsTableLoading(true);
      const response = await dispatch(fetchCapacitySizing({ user_id, reReplacement: sliderValue })).unwrap(); // Pass RE replacement value
      console.log(response);
      
      if (response?.combinations) {
        formatAndSetCombinations(response.combinations, sliderValue); // Update table with API response
      } else {
        message.error("No combinations found. Please try again.");
      }
      setIsTableLoading(false); // Stop loader after processing response
    } catch (error) {
      console.error("Error in handleOptimizeClick:", error);
      message.error("Failed to fetch optimized combinations.");
      setIsTableLoading(false); // Stop loader on error
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
      render: (text) => text, // Display the combination ID as is
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
      title: "Per Unit Cost (INR/KWh)",
      dataIndex: "perUnitCost",
      key: "perUnitCost",
    },
    {
      title: "OA Cost (INR/KWh)",
      dataIndex: "OACost",
      key: "OACost",
    },
    {
      title: "Total Cost (INR/KWh)",
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
    },
  ];

  const sliderRef = React.createRef();

  return (
    <div style={{ padding: "20px", fontFamily: "'Inter', sans-serif", paddingBottom: '50px' }}>
      <Row
        justify="center"
        align="middle"
        gutter={[16, 8]}
        style={{ height: "100%" }}
      >
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
                                 ref={sliderRef} // Add ref directly to the Slider component
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
                             </div>
                             <Button
                               type="primary"
                               onClick={handleOptimizeClick}
                               style={{ marginLeft: "80%", transform: "translateY(-46px)" }}
                             >
                               Run Optimizer For {sliderValue}% RE Replacement
                             </Button>
                           </span>
                            <br />
            </Card>
          </div>
          <Card>
            <Title level={4} style={{ color: "#001529", marginBottom: "10px" }}>
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
                rowClassName={() => "custom-row"} // Add a custom row class
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
              <Modal title='Please try again'>
                
                </Modal>
              </>
            )}
          </Card>
        </Col>

        {/* IPP Modal */}
        {isIPPModalVisible && (
          <IPPModal
            visible={isIPPModalVisible}
            ipp={selectedRow}
            combination={combinationData}
            consumerDetails={consumerDetails}
            reIndex={re_index} // Pass re_index to the modal
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
            type="generator"
          />
        )}
      </Row>

    </div>
  );
};
export default CombinationPatternCap;
