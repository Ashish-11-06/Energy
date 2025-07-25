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
  Descriptions,
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
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { decryptData } from "../../Utils/cryptoHelper";

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
  const selectedDemandId = decryptData(localStorage.getItem('matchingConsumerId'));
  const reReplacement = state?.reReplacement;
  const [sliderValue, setSliderValue] = useState(65); // Default value set to 65

  const dispatch = useDispatch();
 const userData = decryptData(localStorage.getItem('user'));
  const user= userData?.user;
  // const user = JSON.parse(localStorage.getItem("user")).user;
  const role = user.role;
  const user_id = user.id;

const [isGraphModalVisible, setIsGraphModalVisible] = useState(false); // State to control modal visibility
const [isGraphLoading, setIsGraphLoading] = useState(false); // State to control loader in the button
const [hasRunSensitivity, setHasRunSensitivity] = useState(false); // Track sensitivity execution
const [lastSensitivityRunId, setLastSensitivityRunId] = useState(null); // Track the last ID for sensitivity
const [rowSensitivityLoading, setRowSensitivityLoading] = useState({}); // {combinationId: boolean}
const [rowSensitivityData, setRowSensitivityData] = useState({}); // {combinationId: data}
const [activeGraphCombination, setActiveGraphCombination] = useState(null); // combinationId for modal

// Sequentially fetch sensitivity for each combinationId, one at a time
const fetchNextSensitivity = async (combinationIds) => {
  if (!combinationIds || combinationIds.length === 0) return;
  const combinationId = combinationIds[0];
  // Prevent duplicate API call for same combinationId
  if (rowSensitivityData[combinationId] || rowSensitivityLoading[combinationId]) {
    // Already fetched or loading, skip to next
    if (combinationIds.length > 1) {
      fetchNextSensitivity(combinationIds.slice(1));
    }
    return;
  }
  setRowSensitivityLoading((prev) => ({ ...prev, [combinationId]: true }));
  try {
    const data = {
      requirement_id: selectedDemandId,
      optimize_capacity_user: user.user_category,
      user_id: user.id,
      combinations: [combinationId],
    };
    const res = await dispatch(fetchSensitivity(data)).unwrap();
    if (res.error) {
      message.error(res.error);
      setRowSensitivityLoading((prev) => ({ ...prev, [combinationId]: false }));
    } else {
      setRowSensitivityData((prev) => ({
        ...prev,
        [combinationId]: res[combinationId]
      }));
      setRowSensitivityLoading((prev) => ({ ...prev, [combinationId]: false }));
    }
    if (combinationIds.length > 1) {
      fetchNextSensitivity(combinationIds.slice(1));
    }
  } catch (error) {
    setRowSensitivityLoading((prev) => ({ ...prev, [combinationId]: false }));
    message.error("Failed to fetch sensitivity data.");
    if (combinationIds.length > 1) {
      fetchNextSensitivity(combinationIds.slice(1));
    }
  }
};

const handleSensitivity = async () => {
  if (hasRunSensitivity) return; // Prevent re-execution
  setIsGraphLoading(true); // Show loader in the button

  const combinationIds = dataSource.map((item) => item.combination);

  // Sequentially fetch sensitivity for each combinationId, one at a time
  let mergedResult = {};
  try {
    for (let i = 0; i < combinationIds.length; i++) {
      const data = {
        requirement_id: selectedDemandId,
        optimize_capacity_user: user.user_category,
        user_id: user.id,
        combinations: [combinationIds[i]], // always array, one at a time
      };
      const res = await dispatch(fetchSensitivity(data)).unwrap();
      if (res.error) {
        message.error(res.error);
        setIsGraphLoading(false);
        return;
      }
      // Merge response into mergedResult
      mergedResult = { ...mergedResult, ...res };
    }
    setSensitivityData(mergedResult);
    setHasRunSensitivity(true);
    setIsGraphModalVisible(true); // Show the modal after all data is ready
  } catch (error) {
    console.error("Error fetching sensitivity data:", error);
    message.error("Failed to fetch sensitivity data.");
  } finally {
    setIsGraphLoading(false);
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
  // console.log(combinationIds, "combinationIds");
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
    technologyCombinationData: technologyCombinationData, // Pass separately for tooltips
  };
};

// console.log(sensitivityData, "sensitivityData");

const graphOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          // Use activeGraphCombination for correct tooltip data
          const index = context.dataIndex;
          const graphData = prepareGraphDataForCombination(activeGraphCombination);
          const techData = graphData?.technologyCombinationData[index];

          if (context.raw === null) {
            return `${context.label}: Demand cannot be met`;
          }

          return [
            `${context.dataset.label}: ${context.raw}`,
            techData,
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
  setActiveGraphCombination(null);
};

const prepareGraphDataForCombination = (combinationId) => {
  const dataObj = rowSensitivityData[combinationId];
  if (!dataObj) return null;

  const labels = [];
  const tariffData = [];
  const finalCostData = [];
  const technologyCombinationData = [];

  Object.entries(dataObj).forEach(([reReplacement, data]) => {
    if (typeof data !== "string") {
      labels.push(reReplacement);
      tariffData.push(data["Per Unit Cost"]);
      finalCostData.push(data["Final Cost"]);
      technologyCombinationData.push(
        `Solar: ${data["Optimal Solar Capacity (MW)"]} MW, Wind: ${data["Optimal Wind Capacity (MW)"]} MW, Battery: ${data["Optimal Battery Capacity (MW)"]} MW`
      );
    }
  });

  return {
    labels,
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
    technologyCombinationData,
  };
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
// console.log('sensitivity data', sensitivityData);


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
//         console.log('combinationsssssss',combination);
//         console.log("Full combination object:", JSON.stringify(combination, null, 2));
// console.log("Type of Annual Demand Met:", typeof combination["Annual Demand Met"]);
const annual_demand_mett = Number(combination["Annual Demand Met"]?.toString().trim()) || 0;
// console.log('annual_demand_mett',annual_demand_mett);

    const annualDemandRaw = combination["Annual Demand Met"];
    const annual_demand_met = 
      annualDemandRaw !== undefined && annualDemandRaw !== null && !isNaN(annualDemandRaw)
        ? parseFloat(annualDemandRaw)
        : 0;

    // console.log(`Index: ${index}`);
    // console.log("Annual Demand Met Raw:", annualDemandRaw);
    // console.log("Parsed Annual Demand Met:", annual_demand_met);

        const windCapacity = combination["Optimal Wind Capacity (MW)"] || 0;
        const solarCapacity = combination["Optimal Solar Capacity (MW)"] || 0;
        const batteryCapacity =
          combination["Optimal Battery Capacity (MW)"] || 0;
          const annual_curtailment=combination["Annual Curtailment"];
          // const annual=combination["Annual Demand Met"];

// const annual_demand_met = parseFloat(combination["Annual Demand Met"]) || 0;
        return {
          key: index + 1,
          srNo: index + 1,
          combination: key,
  //        annual_demand_met: annual_demand_met,
  // annual: annual_demand_met,
          technology: [
            { name: "Solar", capacity: `${solarCapacity} MW` },
            { name: "Wind", capacity: `${windCapacity} MW ` },
            { name: "ESS", capacity: `${batteryCapacity} MWh` },
          ],
          OACost:
            combination["OA_cost"] && !isNaN(combination["OA_cost"])
              ? combination["OA_cost"].toFixed(2)
              : 0,
          ISTSCharges:
            combination["ISTS_charges"] && !isNaN(combination["ISTS_charges"])
              ? combination["ISTS_charges"].toFixed(2)
              : 0,
          stateCharges:
            combination["state_charges"] && !isNaN(combination["state_charges"])
              ? combination["state_charges"].toFixed(2)
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
          per_unit_savings:
            combination["per_unit_savings"] && !isNaN(combination["per_unit_savings"])
              ? combination["per_unit_savings"].toFixed(2)
              : 0,
          finalCost:
            combination["FinalCost"] && !isNaN(combination["Final Cost"])
              ? combination["Final Cost"].toFixed(2)
              : 0,
          cod: combination["greatest_cod"]
            ? dayjs(combination["greatest_cod"]).format("YYYY-MM-DD")
            : 0,
             annual_demand_met:
            combination["Annual Demand Met"] && !isNaN(combination["Annual Demand Met"])
              ? combination["Annual Demand Met"].toFixed(2)
              : 0,
          reReplacement:
            reReplacementValue ||
            combination["Annual Demand Offset"]?.toFixed(2) ||
            0, // updated to handle null or undefined values
          connectivity: combination.connectivity,
          states: combination.state,
          site_names: combination.site_names,
            state_charges:combination.state_charges,
          ISTS_charges:combination.ISTS_charges,
          capital_cost_ess: combination.capital_cost_ess || 0,
          capital_cost_solar: combination.capital_cost_solar || 0,
          capital_cost_wind: combination.capital_cost_wind || 0,
          banking_available: combination.banking_available || 0,
            // annual_cost:annual_cost,
          status: combination?.terms_sheet_sent
            ? combination?.sent_from_you === 1
              ? "Already Sent"
              : "Already received"
            : "Send Quotation",
        };
      }
    );
// console.log('formatted combinantion',formattedCombinations);
// console.log("Check:", formattedCombinations[0]?.annual_demand_met);
// console.log("Check:", formattedCombinations[0]?.annual_met);
// console.log("Check:", formattedCombinations[0]?.annual_cost);
// console.log('Before setting dataSource:', formattedCombinations);

    setDataSource(formattedCombinations);
// console.log('After setting dataSource:', dataSource); // This may still show the old state due to async nature

    // Only trigger fetchNextSensitivity here, not in any useEffect or handleSensitivity
    const ids = formattedCombinations.map((item) => item.combination);
    if (ids.length > 0) {
      fetchNextSensitivity(ids);
    }
  };
useEffect(()=> {
if(dataSource?.length<=0) {
      setTryREreplacement(true);
    }
  }, [dataSource]);
// console.log('dataSource', dataSource);

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
  // console.log('Updated dataSource:', dataSource);
}, [dataSource]);

  // Remove fetchPatterns from the main useEffect and move it to its own useEffect
useEffect(() => {
  const fetchPatterns = async () => {
    // Don't clear previous data here, just fetch new data
    try {
      if (
        (!consumptionPatterns.length &&
          consumptionPatternStatus === "idle") ||
        consumptionPatternStatus === "failed" ||
        consumptionPatternStatus === "succeeded"
      ) {
        const response = await dispatch(
          fetchConsumptionPattern({ id: selectedDemandId, user_id })
        );
        setConsumerDetails(response.payload?.consumer_details);
      }
    } catch (error) {
      message.error("Failed to fetch consumption patterns.");
    }
  };

  if (selectedDemandId) {
    fetchPatterns();
  }
  // eslint-disable-next-line
}, [selectedDemandId, user_id]); // Only refetch when selectedDemandId or user_id changes

useEffect(() => {
    const loadCombinations = async () => {
      try {
        setIsTableLoading(true);
        setFetchingCombinations(true);
        setProgress(0); // Reset progress when starting a new fetch
        setCombinationData([]); // Reset combination data
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
         // console.log('set combination 387',response);
            
            formatAndSetCombinations(response);
            setIsTableLoading(false);
            setFetchingCombinations(false);

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

    loadCombinations();
  }, []); // This effect remains as is, or you can add selectedDemandId if you want to reload combinations as well

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

const handleRowSensitivity = async (combinationId) => {
  setRowSensitivityLoading((prev) => ({ ...prev, [combinationId]: true }));
  try {
    const data = {
      requirement_id: selectedDemandId,
      optimize_capacity_user: user.user_category,
      user_id: user.id,
      combinations: [combinationId],
    };
    const res = await dispatch(fetchSensitivity(data)).unwrap();
    if (res.error) {
      message.error(res.error);
      setRowSensitivityLoading((prev) => ({ ...prev, [combinationId]: false }));
      return;
    }
    setRowSensitivityData((prev) => ({ ...prev, ...res }));
    setActiveGraphCombination(combinationId); // Show modal for this row
  } catch (error) {
    message.error("Failed to fetch sensitivity data.");
  } finally {
    setRowSensitivityLoading((prev) => ({ ...prev, [combinationId]: false }));
  }
};

  const handleRowClick = (record) => {
    // console.log('handle click record',record);
    
    setSelectedRow(record);
    setIsIPPModalVisible(true);
  };

// console.log('selected rowwwww',selectedRow);


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
  setLastSensitivityRunId(null); // Reset sensitivity execution flag for new data
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
      setDataSource([]);
      const combinations = await dispatch(
        fetchOptimizedCombinations(modalData)
      ).unwrap();
// console.log('fetchOptimizedCombinationssssss',combinations);

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
    message.error('Try in lower RE Replacement value');
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
  title: "Annual Demand Met",
  dataIndex: "annual_demand_met",
  key: "annual_demand_met"
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
      dataIndex: "per_unit_savings",
      key: "per_unit_savings",
    },
    {
      title: "COD",
      dataIndex: "cod",
      key: "cod",
      width: 300,
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
 {
  title: "Banking Available",
  dataIndex: "banking_available",
  key: "banking_available",
  width: 300,
  align: 'center',
  render: (value) => (
    <div style={{ textAlign: 'center' }}>
      {value === 0 ? (
        <CloseCircleTwoTone twoToneColor="#FF0000" />
      ) : (
        <CheckCircleTwoTone twoToneColor="#669800" />
      )}
    </div>
  ),
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
      render: (_, record) => (
        <Tooltip
          title={
            rowSensitivityLoading[record.combination]
              ? "Please wait while we optimize the model for different RE replacements."
              : rowSensitivityData[record.combination]
              ? "View Sensitivity Graph"
              : "Sensitivity data is loading..."
          }
        >
          <Button
            type="primary"
            disabled={!!rowSensitivityLoading[record.combination] || !rowSensitivityData[record.combination]}
            loading={!!rowSensitivityLoading[record.combination]}
            onClick={() => {
              if (rowSensitivityData[record.combination]) {
                setActiveGraphCombination(record.combination);
              }
            }}
          >
            Sensitivity
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

  const chartOptionss = {
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

  // const stackedBarChartData = {
  //   labels: Array.isArray(consumptionPatterns)
  //     ? consumptionPatterns.map((pattern) => pattern.month)
  //     : [],
  //   datasets: [
  //     {
  //       label: "Consumption (MWh)",
  //       data: Array.isArray(consumptionPatterns)
  //         ? consumptionPatterns.map((pattern) => pattern.consumption)
  //         : [],
  //       backgroundColor: "#4CAF50",
  //     },
  //     {
  //       label: "Consumption during Peak hours (MWh)",
  //       data: Array.isArray(consumptionPatterns)
  //         ? consumptionPatterns.map((pattern) => pattern.peak_consumption)
  //         : [],
  //       backgroundColor: "#FF5733",
  //     },
  //     {
  //       label: "Consumption during Off-Peak hours (MWh)",
  //       data: Array.isArray(consumptionPatterns)
  //         ? consumptionPatterns.map((pattern) => pattern.off_peak_consumption)
  //         : [],
  //       backgroundColor: "#337AFF",
  //     },
  //   ],
  // };
  
  // const stackedBarChartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       position: "bottom",
  //     },
  //   },
  //   scales: {
  //     x: {
  //       stacked: true,
  //       title: {
  //         display: true,
  //         text: "Months",
  //       },
  //     },
  //     y: {
  //       stacked: true,
  //       title: {
  //         display: true,
  //         text: "Consumption (MWh)",
  //       },
  //       beginAtZero: true,
  //     },
  //   },
  // };

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
  useEffect(() => {
    //console.log(consumptionPatterns, "consumptionPatterns");
  }, [consumptionPatterns]);

  // console.log(consumptionPatterns);

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
          {/* <Col span={24} style={{ textAlign: "center" }}>
            <p  style={{ color: "#001529" }}>
            Consumer ID: {consumerDetails?.username || "N/A"}
            </p>
          </Col> */}

          <Col span={24} style={{ marginBottom: "20px" }}>
            <div
              style={{
                position: "relative",
                width: "80%",
                height: "300px",
                margin: "0 auto",
              }}
            >
               <Line data={lineChartData} options={chartOptionss} />
              {/* <Bar data={stackedBarChartData} options={stackedBarChartOptions} /> */}
            </div>
          </Col>
        </Card>
   <Card title="Demand's Details" variant={true} >
      <Descriptions column={3} size="small">
        <Descriptions.Item label="Username">{consumerDetails.username}</Descriptions.Item>
        <Descriptions.Item label="Credit Rating"> {consumerDetails.credit_rating || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="State">{consumerDetails.state}</Descriptions.Item>
        <Descriptions.Item label="Tariff Category">{consumerDetails.tariff_category}</Descriptions.Item>
        <Descriptions.Item label="Voltage Level">{consumerDetails.voltage_level} kV</Descriptions.Item>
        <Descriptions.Item label="Contracted Demand">{consumerDetails.contracted_demand} MW</Descriptions.Item>
        <Descriptions.Item label="Industry">{consumerDetails.industry}</Descriptions.Item>
      </Descriptions>
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
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Slider
                  min={0}
                  max={100}
                  marks={marks}
                  style={{ width: "70%", marginRight: "10px", zIndex: 0 }}
                  onChange={handleSliderChange}
                  value={sliderValue}
                  tooltip={{
                    open: !isIPPModalVisible && !isModalVisible,
                  }}
                  trackStyle={{ height: 20 }}
                  handleStyle={{ height: 20, width: 20 }}
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={sliderValue}
                  onChange={(e) => {
                    const value = Math.min(Math.max(Number(e.target.value), 0), 100); // Clamp value between 0 and 100
                    setSliderValue(value);
                  }}
                  style={{
                    width: "60px",
                    height: "30px",
                    marginLeft: "30px",
                    textAlign: "center",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
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
                Please wait while we are fetching you the best matching Renewable Capacity
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
                scroll={{ x: 1200 }} // Enable horizontal scrolling with a minimum width
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
          open={!!activeGraphCombination}
          onCancel={handleGraphModalClose}
          footer={null}
          width="80%"
          zIndex={5000}
        >
          {activeGraphCombination && rowSensitivityData[activeGraphCombination] ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "400px",
                margin: "0 auto",
              }}
            >
              <Line data={prepareGraphDataForCombination(activeGraphCombination)} options={graphOptions} />
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
  {/* {console.log('selected row',selectedRow)
            } */}
        {isIPPModalVisible && (
          <IPPModal
            visible={isIPPModalVisible}
            ipp={{
              ...selectedRow,
              ISTSCharges: selectedRow?.ISTSCharges,
              stateCharges: selectedRow?.stateCharges,
              capital_cost_solar: selectedRow?.capital_cost_solar,
              capital_cost_wind: selectedRow?.capital_cost_wind,
              capital_cost_ess: selectedRow?.capital_cost_ess,
              banking_available: selectedRow?.banking_available,
              annual_demand_met:selectedRow?.annual_demand_met
            }}
          
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
            istsCharges={selectedRow?.ISTSCharges}
            stateCharges={selectedRow?.stateCharges}
          />
        )}
      </Row>
    </div>
  );
};

export default CombinationPattern;
