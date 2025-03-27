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
// import { fetchOptimizedCombinations } from "../../Redux/Slices/Generator/optimizeCapacitySlice";
// import { fetchConsumptionPattern } from "../../Redux/Slices/Generator/ConsumptionPatternSlice";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import IPPModal from "../Consumer/Modal/IPPModal";
import RequestForQuotationModal from "../../Components/Modals/RequestForQuotationModal";
import { fetchCapacitySizing } from "../../Redux/Slices/Generator/capacitySizingSlice";
import "./CombinationPattern.css"; // Import the custom CSS file

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
  const [tryREreplacement,setTryREreplacement]=useState(false);
  const [consumerDetails,setConsumerDetails]=useState('');
  const { state } = useLocation(); // Access navigation state
  const navigate = useNavigate();

  const location = useLocation();
  // const selectedDemandId = location.state?.selectedDemandId;
  const selectedDemandId = localStorage.getItem('matchingConsumerId')
  const reReplacement = state?.reReplacement;
  const [sliderValue, setSliderValue] = useState(65); // Default value set to 65

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user")).user;
  // const user_category=user.user_category;
  // console.log(user_category);
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
            ? (combination?.sent_from_you === 1 ? "Already Sent" : "Already received")
            : "Send Quotation",
        };
      }
    );

    // console.log('tech',tech);
    // console.log("formatting com");
    setDataSource(formattedCombinations);
  };
useEffect(()=> {
if(dataSource?.length<=0) {
  setTryREreplacement(true);
}
},[dataSource])
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

  // console.log('comn', combinationData);klklkl

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
  
  const fetchPatternsAndModelOutput = async () => {
    try {
      setIsTableLoading(true);
      const response = await dispatch(fetchCapacitySizing({})).unwrap();
      console.log("API Response:", response); // Debugging log to inspect the API response

      if (response && response.data) {
        const { combinations, monthly_consumption } = response.data;

        // Update monthly consumption for the graph
        if (monthly_consumption && Array.isArray(monthly_consumption)) {
          setCombinationData(monthly_consumption); // Store monthly consumption data
        } else {
          console.warn("No monthly consumption data found in the response.");
        }

        // Update combinations for the table
        if (combinations && Object.keys(combinations).length > 0) {
          setConsumerDetails(response.consumer_details || '');
          formatAndSetCombinations(combinations, sliderValue);
        } else {
          console.warn("No combinations found in the response.");
          message.error("No combinations found in the response.");
          setDataSource([]); // Clear the table if no combinations are found
        }
      } else {
        message.error("Unexpected response structure.");
      }

      setIsTableLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data. Please try again.");
      setIsTableLoading(false);
    }
  };

  useEffect(() => {
    if (state?.data) {
      console.log("Received data from navigation:", state.data); // Debugging log
      const { combinations, monthly_consumption } = state.data;

      if (combinations) {
        formatAndSetCombinations(combinations, sliderValue);
      }

      if (monthly_consumption) {
        setCombinationData(monthly_consumption);
      }
    } else {
      console.warn("No data received from navigation. Fetching from API...");
      fetchPatternsAndModelOutput(); // Fallback to API call if no state is passed
    }
  }, [state, sliderValue]);

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
    // console.log(record);

    setIsIPPModalVisible(true);
  };

  const re_index = combinationData.re_index || 0;
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
    try {
      setIsTableLoading(true);
      const response = await dispatch(fetchCapacitySizing()).unwrap();
      formatAndSetCombinations(response.combinations, sliderValue);
      setIsTableLoading(false);
    } catch (error) {
      console.error("Error in handleOptimizeClick:", error);
      message.error("Failed to fetch optimized combinations.");
      setIsTableLoading(false);
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
      title: "Total Cost (INR/KWh)",
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
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // width: 150,
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

  //Chart data for consumption patterns
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
    labels: Array.isArray(combinationData)
      ? combinationData.map((pattern) => pattern.month)
      : [], // Safely check if it's an array
    datasets: [
      {
        type: "bar",
        label: "Consumption (MWh)",
        data: Array.isArray(combinationData)
          ? combinationData.map((pattern) => pattern.consumption)
          : [], // Safely check if it's an array
        backgroundColor: "#669800",
        barThickness: 10, // Set bar thickness
      },
      {
        type: "line",
        label: "Consumption during Peak hours (MWh)",
        data: Array.isArray(combinationData)
          ? combinationData.map((pattern) => pattern.peak_consumption)
          : [], // Safely check if it's an array
        borderColor: "#FF5733",
        borderWidth: 5, // Increase line thickness
        fill: false,
      },
      {
        type: "line",
        label: "Consumption during Off-Peak hours (MWh)",
        data: Array.isArray(combinationData)
          ? combinationData.map((pattern) => pattern.off_peak_consumption)
          : [], // Safely check if it's an array
        borderColor: "#337AFF",
        borderWidth: 5, // Increase line thickness
        fill: false,
      },
    ],
  };

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

  useEffect(() => {
    //console.log(consumptionPatterns, "consumptionPatterns");
  }, [consumptionPatterns]);

  // console.log(consumptionPatterns);

  const sliderRef = React.createRef(); // Replace findDOMNode with ref

  return (
    <div style={{ padding: "20px", fontFamily: "'Inter', sans-serif", paddingBottom: '50px' }}>
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
              {/* <Text>RE Replacement Value: {sliderValue}%</Text> Display slider value */}
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
              {/* <p>(You can change your RE Replacement from above bar. )</p> */}
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
            // reReplacement={sliderValue} // Pass the latest slider value
            ipp={selectedRow}
            combination={combinationData}
            consumerDetails={consumerDetails}
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
      {/* <Modal 
  open={tryREreplacement}
  onOk={() => setTryREreplacement(false)}
  cancelButtonProps={{ style: { display: "none" } }} // Hides cancel button
>
  Try for lower RE Replacement
</Modal> */}
      </Row>

    </div>
  );
};

export default CombinationPatternCap;
