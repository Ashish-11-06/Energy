import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatchingIPPById } from "../../Redux/Slices/Consumer/matchingIPPSlice";
import {
  Button,
  Card,
  Col,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import { fetchRequirements } from "../../Redux/Slices/Consumer/consumerRequirementSlice";
import { addPWatt } from "../../Redux/Slices/Consumer/pwattSlice";
import * as XLSX from "xlsx";
import RequirementForm from "./Modal/RequirenmentForm"; // Import the RequirementForm component
import { data } from "react-router-dom";
import { Legend, Title } from "chart.js";
import { decryptData } from "../../Utils/cryptoHelper";
import { CartesianGrid, LineChart, XAxis, YAxis } from "recharts";
import { Line } from "react-chartjs-2";
import { EyeOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { handleDownloadPDF } from "../../Components/Consumer/downloadOnsitePdf";
import AnnualGenerationChart from "../../Components/Consumer/AnnualGenerationChart";

const Rooftop = (props) => {
  const [selectedRequirement, setSelectedRequirement] = useState(null); // State for selected requirement
  const dispatch = useDispatch();
  // const userData = JSON.parse(localStorage.getItem("user")).user;
  const user = decryptData(localStorage.getItem("user"));
  const userData = user?.user;
  const radioValueRef = useRef(null); // store the selected value
  const [loading, setLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [energyReplaced, setEnergyReplaced] = useState("");
  const [requiredData, setRequiredData] = useState(null);
  const [warningModal, setWarningModal] = useState(false);
  const [incompleteRequirement, setIncompleteRequirement] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
  const [selectKey, setSelectKey] = useState(Date.now()); // initial unique key
  const [capacitySolar, setCapacitySolar] = useState("");
  const [totalSavings, setTotalSavings] = useState("");
  const [hourlyData, setHourlyData] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [submittedType, setSubmittedType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [hourlyAverages, setHourlyAverages] = useState([]); // <-- Add this state

  // Helper functions
  const formatNumber = (num, decimals = 3) => {
    if (num === undefined || num === null) return "N/A";
    return parseFloat(num).toFixed(decimals);
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "N/A";
    return `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount)}`;
  };

  const requirements = useSelector(
    (state) => state.consumerRequirement.requirements || []
  );
  // console.log("requirements", requirements);

  useEffect(() => {
    const filtered = requirements.filter(
      (item) =>
        item.solar_rooftop_capacity && Number(item.solar_rooftop_capacity) > 0
    );

    setRequiredData(filtered);
  }, [requirements]);

  useEffect(() => {
    const fetchReq = async () => {
      const res = await dispatch(fetchRequirements(userData?.id));
      // console.log("res", res);
    };
    fetchReq();
  }, [dispatch]);
  const handleRadioChange = (e) => {
    radioValueRef.current = e.target.value;
    // console.log("Selected value:", radioValueRef.current);
  };


  const handleRequirementChange = (value) => {
    console.log("Selected requirement ID:", value);

    const selected = requirements.find((req) => req.id === value);

    const isMissingFields =
      !selected?.roof_area ||
      !selected?.solar_rooftop_capacity ||
      !selected?.location;

    // if (isMissingFields) {
    //   message.warning("Some fields are missing, but selection allowed.");
    // }

    // ✅ Always allow setting
    setSelectedRequirement(selected);
    setSelectedRequirementId(selected.id);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleSubmit = async () => {
    setChartData([]);
    setMonthlyData([]);
    setEnergyReplaced("");
    setTotalSavings("");
    setCapacitySolar("");
    if (!selectedRequirement)
      return message.error("Please select a requirement");
    if (!radioValueRef.current) return message.error("Please select a type");
    setLoading(true);
    const data = {
      requirement_id: selectedRequirement?.id,
      button_type: radioValueRef.current,
      // requirement_id:18,
      // button_type:"grid_connected"
    };

    const res = await dispatch(addPWatt(data));

    if (addPWatt.fulfilled.match(res)) {
      // console.log("✅ Fulfilled response:", res.payload);
      // if(radioValueRef.current === "grid_connected") {
      setHourlyData(res?.payload?.hourly_data);
      const convertedData = res?.payload?.monthly_data.map((item) => ({
        ...item,
        month: monthNames[item.month - 1], // Convert number to name (e.g. 1 → January)
      }));
      const sortedData = [...convertedData].sort(
        (a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
      );
      setResponseData(res?.payload);
      setMonthlyData(sortedData);
      setLoading(false);
      // console.log("response payload:", res?.payload.hourly_generation);

      const hourly_generation = res?.payload.hourly_averages; // array of 8760

      const chartData = hourly_generation.map((value, index) => ({
        hour: index,
        generation: value,
      }));

      setChartData(chartData);



      setEnergyReplaced(res?.payload.total_energy_replaced);
      setCapacitySolar(res?.payload.capacity_of_solar_rooftop);
      setTotalSavings(res?.payload.total_savings);
      setLoading(false);
    } else if (addPWatt.rejected.match(res)) {
      // ❌ failed — show error message
      message.error(res.payload); // e.g. "no master data found for this state."
      setLoading(false);
      console.error("❌ Rejected:", res.payload);
    }
  };


  const handleCancel = () => {
    setIsModalOpen(false);
    setEditModal(false);
    setWarningModal(false);
    setIncompleteRequirement(null);
    setSelectedRequirement(null);
    setSelectedRequirementId(null); // Clear dropdown value
  };
  const handleCancelWarning = () => {
    setWarningModal(false);
    setIncompleteRequirement(null);
    setSelectedRequirement(null);
    setSelectedRequirementId(null); // Clear dropdown value
    setSelectKey(Date.now());
  };

  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleDownload = () => {
    if (!hourlyData || !Array.isArray(hourlyData)) {
      console.error("No data found or data is not an array");
      return;
    }

    // Transform keys to desired header names
    const formattedData = hourlyData.map((item) => ({
      Hours: item.hour,
      "Solar Generation (kWh)": item.generation,
      "Power Consumption": item.consumption,
      "Used Solar": item.used_solar,
      "Savings (INR)": item.savings,
      "Curtailment (kWh)": item.curtailment,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hourly Data");

    XLSX.writeFile(workbook, "hourly_data.xlsx");
  };

  // Sort monthlyData by correct calendar order
  const sortedMonthlyData = [...monthlyData].sort((a, b) => {
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });
  const middleIndex = Math.ceil(sortedMonthlyData.length / 2);
  const firstHalf = sortedMonthlyData.slice(0, middleIndex);
  const secondHalf = sortedMonthlyData.slice(middleIndex);

  const columns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      align: "center",
    },
    {
      title: "Generation (kWh)",
      dataIndex: "generation",
      key: "generation",
      align: "center",
      render: (value) =>
        new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value),
    },
    {
      title: "Savings (INR)",
      dataIndex: "savings",
      key: "savings",
      align: "center",
      render: (value) =>
        new Intl.NumberFormat("en-IN", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value),
    },
    {
      title: "RE Replacement (%)",
      dataIndex: "energy_replaced",
      key: "energy_replaced",
      align: "center",
    }
  ];

  // console.log("selected requirement", selectedRequirement);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <h2 style={{ alignSelf: "flex-start" }}>Onsite RE options</h2>

      <Card
        style={{
          width: "100%",
          // maxWidth: 800,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          marginTop: "20px",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {/* Dropdown */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <p
              style={{
                margin: "0 0 8px 0",
                fontWeight: "500",
              }}
            >
              Select Consumption Unit
            </p>
            <Select
              key={selectKey}
              style={{ width: "100%" }}
              value={selectedRequirementId || undefined}
              onChange={handleRequirementChange}
              options={
                Array.isArray(requirements)
                  ? requirements.map((req) => ({
                    label: (
                      <span>
                        {req.state && (
                          <>
                            <strong>State:</strong> {req.state || "N/A"},{" "}
                          </>
                        )}
                        {/* Always show Solar Rooftop Capacity label, show value or N/A */}
                        <>
                          <strong>Solar Rooftop Capacity:</strong>{" "}
                          {req.solar_rooftop_capacity !== undefined && req.solar_rooftop_capacity !== null
                            ? `${req.solar_rooftop_capacity} kWp`
                            : "N/A"}
                          ,{" "}
                        </>
                        {req.roof_area && (
                          <>
                            <strong>Roof Area:</strong>{" "}
                            {req.roof_area || "N/A"} square meters,{" "}
                          </>
                        )}
                        {req.annual_electricity_consumption && (
                          <>
                            <strong>Annual Consumption:</strong>{" "}
                            {req.annual_electricity_consumption || "N/A"} MWh,{" "}
                          </>
                        )}
                        {req.contracted_demand && (
                          <>
                            <strong>Contracted Demand:</strong>{" "}
                            {req.contracted_demand || "N/A"} MW,{" "}
                          </>
                        )}
                        {req.location && (
                          <>
                            <strong>Location:</strong> {req.location || "N/A"}
                            ,{" "}
                          </>
                        )}
                        {req.voltage_level && (
                          <>
                            <strong>Voltage:</strong>{" "}
                            {req.voltage_level || "N/A"} kV,{" "}
                          </>
                        )}
                        {req.procurement_date && (
                          <>
                            <strong>Procurement Date:</strong>{" "}
                            {req.procurement_date || "N/A"}
                          </>
                        )}
                      </span>
                    ),
                    value: req.id,
                  }))
                  : []
              }
              placeholder="Select the requirement"
              showSearch
              optionFilterProp="children"
            />
          </Col>
          {/* Show details card after selection */}
          {selectedRequirement && (
            <Col span={24} style={{ marginTop: 16 }}>
              <Card bordered style={{ background: "#fafbfc", marginBottom: 16 }}>
                <Row gutter={24}>
                  <Col span={8}>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ color: "#888" }}>State: </span>
                      <span style={{ fontWeight: 500 }}>{selectedRequirement.state || "N/A"}</span>
                    </div>
                    <div style={{ marginBottom: 8, display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#888" }}>Roof Area: </span>
                      <span style={{ fontWeight: 500, marginLeft: 4 }}>
                        {selectedRequirement.roof_area
                          ? `${selectedRequirement.roof_area} m²`
                          : "N/A"}
                      </span>

                      {selectedRequirement.roof_area && (
                        <Tooltip
                          title={
                            <>
                              <div>
                                {new Intl.NumberFormat("en-IN").format(
                                  selectedRequirement.roof_area * 10.7639
                                )}{" "}
                                ft²
                              </div>
                              <div>
                                {new Intl.NumberFormat("en-IN").format(
                                  selectedRequirement.roof_area * 1.19599
                                )}{" "}
                                yd²
                              </div>
                              <div>
                                {new Intl.NumberFormat("en-IN", {
                                  maximumFractionDigits: 4,
                                }).format(selectedRequirement.roof_area * 0.000247105)}{" "}
                                acres
                              </div>
                              <div>
                                {new Intl.NumberFormat("en-IN", {
                                  maximumFractionDigits: 4,
                                }).format(selectedRequirement.roof_area * 0.0001)}{" "}
                                hectares
                              </div>
                            </>
                          }
                        >
                          <InfoCircleOutlined
                            style={{
                              marginLeft: 6,
                              color: "#999",
                              cursor: "pointer",
                            }}
                          />
                        </Tooltip>
                      )}
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <span style={{ color: "#888" }}>Existing Solar Rooftop Capacity: </span>
                      <span style={{ fontWeight: 500 }}>
                        {selectedRequirement.solar_rooftop_capacity !== null &&
                          selectedRequirement.solar_rooftop_capacity !== undefined
                          ? `${selectedRequirement.solar_rooftop_capacity} kWp`
                          : "N/A"}
                      </span>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <span style={{ color: "#888" }}>Annual Consumption: </span>
                      <span style={{ fontWeight: 500 }}>
                        {selectedRequirement.annual_electricity_consumption
                          ? `${selectedRequirement.annual_electricity_consumption} MWh`
                          : "N/A"}
                      </span>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ color: "#888" }}>Contracted Demand: </span>
                      <span style={{ fontWeight: 500 }}>
                        {selectedRequirement.contracted_demand
                          ? `${selectedRequirement.contracted_demand} MW`
                          : "N/A"}
                      </span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ color: "#888" }}>Location: </span>
                      <span style={{ fontWeight: 500 }}>
                        {selectedRequirement.location || "N/A"}
                      </span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ color: "#888" }}>Voltage: </span>
                      <span style={{ fontWeight: 500 }}>
                        {selectedRequirement.voltage_level
                          ? `${selectedRequirement.voltage_level} kV`
                          : "N/A"}
                      </span>
                    </div>
                    {/* <div style={{ marginBottom: 8 }}>
                      <span style={{ color: "#888" }}>Procurement Date: </span>
                      <span style={{ fontWeight: 500 }}>
                        {selectedRequirement.procurement_date || "N/A"}
                      </span>
                    </div> */}
                  </Col>
                </Row>
              </Card>
            </Col>
          )}
          {/* Radio buttons */}
          <Row gutter={[16, 16]}>
            <p
              style={{
                margin: "0 0 8px 0",
                fontWeight: "500",
              }}
            >
              Select Type
            </p>
            <Col span={24}>
              <Radio.Group
                onChange={(e) => {
                  radioValueRef.current = e.target.value;
                  setSelectedType(e.target.value);
                  handleRadioChange(e);
                }}
                style={{ width: "100%" }}
              >
                <Radio value="grid_connected">Grid connected</Radio>
                <Radio value="behind_the_meter">Behind the meter</Radio>
              </Radio.Group>
            </Col>
          </Row>
        </Row>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              if (!selectedType) {
                message.warning("Please select a type first");
                return;
              }
              setSubmittedType(selectedType);
              handleSubmit();
            }}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Card>
      <Card
        style={{
          width: "100%",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          marginTop: "20px",
          padding: "20px",
          borderRadius: "10px",
        }}
      >


        {submittedType && (
          <h2 style={{ textAlign: "center" }}>
            Optimized Onsite Solar Option for{" "}
            {submittedType === "grid_connected"
              ? "Grid connected"
              : submittedType === "behind_the_meter"
                ? "Behind the meter"
                : ""}
          </h2>
        )}

        <Card style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            {energyReplaced && (
              <Col xs={24} sm={12} md={8}>
                <p style={{ fontWeight: "bold" }}>
                  Energy Replaced (%): {energyReplaced}
                </p>
              </Col>
            )}

            {capacitySolar && (
              <Col xs={24} sm={12} md={8}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      marginRight: 8,
                    }}
                  >
                    Capacity of Solar Rooftop (kWp): {capacitySolar}
                    {/* Capacity of Solar Rooftop (kWp):{" "}
                    {new Intl.NumberFormat("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(Number(capacitySolar))} */}
                  </span>
                </div>
              </Col>
            )}

            {totalSavings && (
              <Col xs={24} sm={12} md={8}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                    Total Annual Saving (INR):{" "}
                    {new Intl.NumberFormat("en-IN", {
                      maximumFractionDigits: totalSavings % 1 === 0 ? 0 : 2,
                    }).format(parseFloat(totalSavings))}
                  </span>
                  <Tooltip
                    title={`Rooftop solar price considered at ${responseData?.rooftop_price
                      ? `${responseData.rooftop_price} `
                      : "N/A"
                      } INR/kWh`}
                  >
                    <InfoCircleOutlined
                      style={{
                        color: "#999",
                        cursor: "pointer",
                        marginLeft: 8,
                      }}
                    />
                  </Tooltip>
                </div>
              </Col>
            )}
          </Row>
        </Card>


        <p
          style={{ textAlign: "center", fontWeight: "bold", marginTop: "20px" }}
        >
          Monthly Summary Of Replacement
        </p>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Table
              dataSource={firstHalf}
              columns={columns}
              rowKey="month"
              pagination={false}
              size="small"
              bordered
            />
          </Col>
          <Col xs={24} md={12}>
            <Table
              dataSource={secondHalf}
              columns={columns}
              rowKey="month"
              pagination={false}
              size="small"
              bordered
            />
          </Col>
        </Row>

        {/* Show graph for behind_the_meter using hourly_averages */}
        {radioValueRef.current === "behind_the_meter" && chartData.length > 0 && (
          <AnnualGenerationChart chartData={chartData} />
        )}

        {/* Default chart for grid_connected or if nothing else */}
        {radioValueRef.current !== "behind_the_meter" && <AnnualGenerationChart chartData={chartData} />}

        <Row style={{ marginTop: "20px" }} gutter={16}>
          {radioValueRef.current === "behind_the_meter" &&
            Array.isArray(hourlyData) &&
            hourlyData.length > 0 && (
              <Col span={12}>
                <div style={{ textAlign: "right" }}>
                  <Button type="primary" onClick={handleDownload}>
                    Download Hourly Data (Excel)
                  </Button>
                </div>
              </Col>
            )}

          {(monthlyData?.length > 0 || hourlyData?.length > 0) && (
            <Col span={radioValueRef.current === "behind_the_meter" ? 12 : 24}>
              <div style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  onClick={() =>
                    handleDownloadPDF(
                      {
                        ...selectedRequirement,
                        energyReplaced,
                        totalSavings,
                        capacitySolar,
                      },
                      selectedRequirement?.id,
                      monthlyData
                    )
                  }
                  style={{
                    backgroundColor: "#669800",
                    borderColor: "#669800",
                  }}
                >
                  Download Full Report (PDF)
                </Button>

                <Button
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  Request Quotation
                </Button>
              </div>
            </Col>
          )}
        </Row>

        {/* {radioValueRef.current === "behind_the_meter" &&
          Array.isArray(hourlyData) &&
          hourlyData.length > 0 && (
            <Row style={{ marginTop: "20px" }}>
              <Col span={24}>
                <div style={{ textAlign: "right" }}>
                  <Button type="primary" onClick={handleDownload}>
                    Download Hourly Data
                  </Button>
                </div>
              </Col>
            </Row>
          )}

        <Modal
          title="Warning"
          open={warningModal}
          onCancel={handleCancelWarning}
          footer={[
            <Button key="ok" onClick={onModalClick}>
              OK
            </Button>,
          ]}
        >
          <p>
            Please ensure that the selected requirement has valid roof area,
            solar rooftop capacity, and location before proceeding.
          </p>
        </Modal> */}
        <RequirementForm
          open={editModal}
          onCancel={handleCancel}
          // onSubmit={handleSubmit}
          handleCancelModal={handleCancel}
          data={incompleteRequirement}
          fromRooftop={true}
          isEdit={true}
        />
      </Card>
    </main>
  );
};

export default Rooftop;
