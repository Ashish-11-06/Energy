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
  Slider,
  Button,
  Card,
  Modal,
  Input,
} from "antd";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { DownloadOutlined, SaveOutlined } from "@ant-design/icons";

import "chart.js/auto";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import IPPModal from "../Consumer/Modal/IPPModal";
import RequestForQuotationModal from "../../Components/Modals/RequestForQuotationModal";
import { fetchCapacitySizing, saveCapacitySizingData } from "../../Redux/Slices/Generator/capacitySizingSlice";
import "./CombinationPattern.css";

const { Title, Text } = Typography;

const CombinationPatternCap = () => {
  //COMBINATION PATTERN SCROLLBAR
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isIPPModalVisible, setIsIPPModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [combinationData, setCombinationData] = useState([]);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [saveInput, setSaveInput] = useState("");
  const [saveRecord, setSaveRecord] = useState(null);
  const { state } = useLocation(); // Access navigation state

  const [sliderValue, setSliderValue] = useState(65); // Default value set to 65

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user")).user;
  // console.log('state', state)
  const formatAndSetCombinations = (combinations) => {
    if (!combinations || typeof combinations !== "object" || !Object.keys(combinations).length) {
      setDataSource([]);
      return;
    }

    const formattedCombinations = Object.entries(combinations).map(([key, combination], index) => {
      const windCapacity = combination["Optimal Wind Capacity (MW)"] || 0;
      const solarCapacity = combination["Optimal Solar Capacity (MW)"] || 0;
      const batteryCapacity = combination["Optimal Battery Capacity (MW)"] || 0;

      return {
        key: index + 1,
        srNo: index + 1,
        combination: key,
        technology: [
          { name: "Solar", capacity: `${solarCapacity} MW` },
          { name: "Wind", capacity: `${windCapacity} MW` },
          { name: "ESS", capacity: `${batteryCapacity} MWh` },
        ],
        annualDemandMet: combination["Annual Demand Met"] || 0,
        annualCurtailment: combination["Annual Curtailment"] || 0,
        perUnitCost: combination["Per Unit Cost"]?.toFixed(2) || 0,
        oaCost: combination["OA_cost"]?.toFixed(2) || "N/A", // Add OA Cost
        totalCost: combination["Total Cost"]?.toFixed(2) || 0,
        cod: combination["greatest_cod"] ? dayjs(combination["greatest_cod"]).format("DD-MM-YYYY") : "N/A",
        annualDemandOffeset: combination["Annual Demand Offset"] || 0,
        // annualDemandMet:combination["Annual Demand Met"] || 0,

      };
    });

    setDataSource(formattedCombinations);
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
      }
      console.log(state.data);

      setCombinationData(state.modalData); // Store modalData for display

      setIsTableLoading(false); // Stop loader if data is already available
    } else if (state?.error) {
      message.error(state.error);
      setCombinationData(state.modalData); // Store modalData even if there's an error
      setIsTableLoading(false); // Stop loader if there's an error
    }
  }, [state]);
  console.log('combination data', combinationData);

  useEffect(() => {
    const fetchCombinations = async () => {
      if (state?.modalData) {
        try {
          setIsTableLoading(true);
          const response = await dispatch(fetchCapacitySizing(state.modalData)).unwrap(); // Call API with modalData
          console.log(response);

          if (response) {
            const formattedData = Object.entries(response).map(([key, value], index) => ({
              key: index + 1,
              combinationId: key,
              solarCapacity: value["Optimal Solar Capacity (MW)"] || 0,
              windCapacity: value["Optimal Wind Capacity (MW)"] || 0,
              batteryCapacity: value["Optimal Battery Capacity (MW)"] || 0,
              perUnitCost: value["Per Unit Cost"]?.toFixed(2) || "N/A",
              oaCost: value["OA_cost"]?.toFixed(2) || 0, // Add OA Cost
              finalCost: value["Final Cost"]?.toFixed(2) || "N/A",
              annualCurtailment: value['Annual Curtailment'] || 0,
              annualDemandMet: value['Annual Demand Met'] || 0,
              annualDemandOffeset: value['Annual Demand Offset'] || 0
            }));
            setDataSource(formattedData); // Set the formatted data in the table
          } else {
            message.error("No combinations found. Please check your input.");
          }
        } catch (error) {
          console.error("Error fetching combinations:", error);
          message.error(error);
        } finally {
          setIsTableLoading(false);
        }
      } else {
        message.error("No input data found. Please go back and try again.");
        setIsTableLoading(false);
      }
    };

    fetchCombinations();
  }, [state?.modalData]);


  const handleSaveConfirm = async () => {
    if (!saveInput.trim()) {
      message.error("Please enter a valid name.");
      return;
    }
  
    const data = {
      generator: user.id, 
      record_name: saveInput,
      combination: saveRecord.combinationId,
      optimal_solar_capacity: 1,
      optimal_wind_capacity: 2,
      optimal_battery_capacity: 3,
      per_unit_cost: 5,
      oa_cost: 2,
      final_cost: 3,
      annual_demand_offset: 32,
      annual_demand_met: 54,
      annual_curtailment: 100
      // ...saveRecord,
    };
  
    try {
      await dispatch(saveCapacitySizingData(data)).unwrap();
      message.success("Record saved successfully!");
      // Reset modal and states
      setIsSaveModalVisible(false);
      setSaveInput("");
      setSaveRecord(null);
    } catch (error) {
      console.error("Save failed:", error);
      message.error("Failed to save record.");
    }
  };

  const re_index = combinationData.re_index || 0;
  console.log('comb', combinationData);

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

      // Retain the original payload and only update the RE replacement value
      const updatedPayload = {
        ...state.modalData, // Original payload details
        re_replacement: sliderValue, // Update RE replacement value
      };

      const response = await dispatch(fetchCapacitySizing(updatedPayload)).unwrap(); // Pass updated payload
      console.log(response);

      if (response) {
        const formattedData = Object.entries(response).map(([key, value], index) => ({
          key: index + 1,
          combinationId: key,
          solarCapacity: value["Optimal Solar Capacity (MW)"] || 0,
          windCapacity: value["Optimal Wind Capacity (MW)"] || 0,
          batteryCapacity: value["Optimal Battery Capacity (MW)"] || 0,
          perUnitCost: value["Per Unit Cost"]?.toFixed(2) || "N/A",
          oaCost: value["OA_cost"]?.toFixed(2) || 0, // Add OA Cost
          finalCost: value["Final Cost"]?.toFixed(2) || "N/A",
          annualCurtailment: value['Annual Curtailment'] || 0,
          annualDemandMet: value['Annual Demand Met'] || 0,
          annualDemandOffeset: value['Annual Demand Offset'] || 0
        }));
        setDataSource(formattedData); // Set the formatted data in the table
      } else {
        message.error("No combinations found. Please check your input.");
      }
      setIsTableLoading(false); // Stop loader after processing response
    } catch (error) {
      console.error("Error in handleOptimizeClick:", error);
      message.error("Failed to fetch optimized combinations.");
      setIsTableLoading(false); // Stop loader on error
    }
  };


  const marks = {
    0: "0%",
    100: "100%",
  };

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "key",
      key: "key",
      width: 50,
    },
    {
      title: "Combination ID",
      dataIndex: "combinationId",
      key: "combinationId",
      width: 150,
    },
    {
      title: "Optimal Solar Capacity (MW)",
      dataIndex: "solarCapacity",
      key: "solarCapacity",
    },
    {
      title: "Optimal Wind Capacity (MW)",
      dataIndex: "windCapacity",
      key: "windCapacity",
    },
    {
      title: "Optimal Battery Capacity (MW)",
      dataIndex: "batteryCapacity",
      key: "batteryCapacity",
    },
    {
      title: "Per Unit Cost (INR/kWh)",
      dataIndex: "perUnitCost",
      key: "perUnitCost",
    },
    {
      title: "OA Cost (INR/kWh)", // New column for OA Cost
      dataIndex: "oaCost",
      key: "oaCost",
    },
    {
      title: "Final Cost (INR/kWh)",
      dataIndex: "finalCost",
      key: "finalCost",
    },
    {
      title: 'Annual Demand Offset(%)',
      dataIndex: 'annualDemandOffeset',
      key: 'annualDemandOffeset'
    },
    {
      title: 'Annual Demand Met (million units)',
      dataIndex: 'annualDemandMet',
      key: 'annualDemandMet'
    },
    {
      title: 'Annual Curtailment(%)',
      dataIndex: 'annualCurtailment',
      key: 'annualCurtailment'
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", flexDirection: 'column', gap: "10px" }}>
          <Button
            type="link"
            icon={<DownloadOutlined style={{ color: "white" }} />}
            onClick={() => handleDownloadPdf(record)}
          >
            Download
          </Button>
          <Button
            style={{
              backgroundColor: "#88B048", // Green
              color: "white",
              border: "none",
            }}
            icon={<SaveOutlined style={{ color: "white" }} />}
            onClick={() => {
              setSaveRecord(record);
              setIsSaveModalVisible(true);
            }}
          >
            Save
          </Button>

        </div>
      ),
    },

  ];


  // Function to handle PDF download
  const handleDownloadPdf = (record) => {
    const doc = new jsPDF();
console.log(record);

    // Add title
    doc.setFontSize(16);
    doc.text("Combination Details", 10, 10);

    // Add table with row details
    doc.autoTable({
      startY: 20,
      head: [["Field", "Value"]],
      body: [
        ["Combination ID", record.combinationId || "N/A"],
        ["Optimal Solar Capacity (MW)", record.solarCapacity || "N/A"],
        ["Optimal Wind Capacity (MW)", record.windCapacity || "N/A"],
        ["Optimal Battery Capacity (MW)", record.batteryCapacity || "N/A"],
        ["Per Unit Cost (INR/kWh)", record.perUnitCost || "N/A"],
        ["OA Cost (INR/kWh)", record.oaCost || "N/A"],
        ["Final Cost (INR/kWh)", record.finalCost || "N/A"],
        ["Annual Demand Offset (%)", record.annualDemandOffeset || "N/A"],
        ["Annual Demand Met (million units)", record.annualDemandMet || "N/A"],
        ["Annual Curtailment (%)", record.annualCurtailment || "N/A"],
      ],
      styles: { lineWidth: 0.1 }, // Add border for the table
    });

    // Add additional table for 8760 rows
    const columnTitles = [
      "Demand (MW)",
      "Solar Allocation (MW)",
      "Wind Allocation (MW)",
      "Generation (MW)",
      "Unmet Demand (MW)",
      "Curtailment (MW)",
      "Total Demand Met By Allocation (MW)",
    ];

    const dataRows = record.dataRows || []; // Assuming `record.dataRows` contains 8760 rows of data

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10, // Start below the previous table
      head: [columnTitles],
      body: dataRows.map((row) => [
        row.Demand || "N/A",
        row.solarAllocation || "N/A",
        row.windAllocation || "N/A",
        row.generation || "N/A",
        row.unmetDemand || "N/A",
        row.curtailment || "N/A",
        row.totalDemandMet || "N/A",
      ]),
      styles: { lineWidth: 0.1 }, // Add border for the table
    });

    // Save the PDF
    doc.save(`Combination_${record.combinationId || "Details"}.pdf`);
  };

  // console.log(dataSource);
  console.log(dataSource?.[0]?.annualDemandOffeset);


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
            <Title level={4} style={{ color: "#669800", background: '#f8f8f8', marginBottom: "10px", padding: '10px' }}>
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
                      marginLeft: "10px",
                      textAlign: "center",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <Button
                  type="primary"
                  onClick={handleOptimizeClick}
                  style={{ marginLeft: "80%", transform: "translateY(-46px)" }}
                >
                  Run Optimizer
                  {/* For {sliderValue}% RE Replacement */}
                </Button>
              </span>
              <br />
            </Card>
          </div>
          <Card>
            <Title level={4} style={{ color: "#001529", marginBottom: "10px" }}>
              {isTableLoading ? (
                <>
                  Optimized Combination for {sliderValue} % RE replacement
                </>
              ) : (
                <>
                  Optimized Combination for {dataSource?.[0]?.annualDemandOffeset || sliderValue} % RE replacement
                </>
              )

              }

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

      <Modal
        title="Save Capacity Sizing Data"
        open={isSaveModalVisible}
        onOk={() => handleSaveConfirm()}
        onCancel={() => setIsSaveModalVisible(false)}
        okText="Save"
      >
        <p>Please enter a name for this data (capacity sizing):</p>
        <Input
          value={saveInput}
          onChange={(e) => setSaveInput(e.target.value)}
          placeholder="Enter name"
        />
      </Modal>

    </div>
  );
};
export default CombinationPatternCap;
