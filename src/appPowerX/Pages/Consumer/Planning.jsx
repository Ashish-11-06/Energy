/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Row,
  Col,
  Tooltip,
  Button,
  Spin,
  message,
  Form,
  Select,
  DatePicker,
  Input,
  Modal,
  Checkbox,
  Radio,
  Upload,
} from "antd";
import "antd/dist/reset.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  fetchTableMonthData,
  uploadTableMonthDataC,
} from "../../Redux/slices/consumer/monthAheadSlice"; // Correct import
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { Calendar as AntdCalendar } from "antd"; // Import Ant Design Calendar
import "./Planning.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { fetchPlanningData } from "../../Redux/slices/consumer/planningSlice";
import { fetchRequirements } from "../../Redux/slices/consumer/consumerRequirementSlice";
import { addMonthData } from "../../Redux/slices/consumer/monthAheadSlice";
import { color } from "framer-motion";
import { fetchHolidayList } from "../../Redux/slices/consumer/holidayListSlice";

dayjs.locale("en");

const Planning = () => {
  const navigate = useNavigate();
  const [showTable, setShowTable] = useState(true); // Set default to true
  const [showInputFields, setShowInputFields] = useState(false); // State to manage input fields visibility
  const [selectedState, setSelectedState] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [demand, setDemand] = useState("");
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [consumerRequirement, setConsumerRequirement] = useState([]);
  const [tableDemandData, setTableDemandData] = useState([]); // Ensure it's initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [price, setPrice] = useState({});
  const [selectedTechnology, setSelectedTechnology] = useState([]);
  const dispatch = useDispatch();
  const user_id = Number(JSON.parse(localStorage.getItem("user")).user.id);
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
  const [isInputModalVisible, setIsInputModalVisible] = useState(false); // Separate state for input modal
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedUnitDetails, setSelectedUnitDetails] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState(null); // Add state for selected interval
  const [startDate, setStartDate] = useState(null); // Add state for start date
  const [endDate, setEndDate] = useState(null); // Add state for end date
  const [requirementId, setRequirementId] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null); // State to store uploaded file
  const [disableDates, setDisableDates] = useState([]); // State to store holiday dates
  const [addLoading, setAddLoading] = useState(false);
  const [allFilled, setAllFilled] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const id = user_id; // Ensure `user_id` is defined in scope
      try {
        const res = await dispatch(fetchPlanningData(id));
        console.log(res);
        // console.log(res.payload);
        setTableDemandData(res.payload);
        setRequirementId(res.payload.map((item) => item.requirement));
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || "No demand records found";
        // console.log(error?.response?.data?.message);

        message.error(errorMessage); // Display the error message
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the function inside useEffect
  }, [user_id, dispatch]); // Add dependencies if needed
  // console.log(requirementId);

  useEffect(() => {
    const fetchHolidayData = async () => {
      try {
        const res = await dispatch(fetchHolidayList());
        // setDisableDates(["2025-04-27"])
        setDisableDates(res.payload); // Assuming res.payload contains the list of holidays
        // console.log("Holiday List:", res);
      } catch (error) {
        // console.error("Error fetching holiday list:", error);
      }
    };
    fetchHolidayData();
  }, [dispatch]);

  // console.log('disable dates',disableDates);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = user_id;
        const res = await dispatch(fetchRequirements(id)); // Wait for API response
        setConsumerRequirement(res.payload);
        console.log("consumer requirement res", res);

        console.log(res.payload);
      } catch (error) {
        // console.log("Error fetching consumer requirements:", error);
      }
    };
    fetchData();
  }, [user_id, dispatch]);
  console.log("table demand data", tableDemandData);

  const getListData = (date) => {
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    if (!Array.isArray(tableDemandData)) return []; // Ensure tableDemandData is an array
   return tableDemandData.filter((item) => {
  const isMatchingDate = item.date === dateStr;
  const isMatchingRequirement =
    selectedRequirementId === null || item.requirement === selectedRequirementId;
  return isMatchingDate && isMatchingRequirement;
});

  };

  const tileContent = (value) => {
    const date = value.toDate();
    const listData = getListData(date);
    const isToday = dayjs(date).isSame(dayjs(), "day");
    const isPastDate = dayjs(date).isBefore(dayjs(), "day");
    const isDisabledDate = disableDates.some((disabledDate) =>
      dayjs(disabledDate).isSame(dayjs(date), "day")
    );

    return (
      <div
        style={{
          position: "relative",
          textAlign: "center",
          marginTop: "5px",
          cursor: isPastDate || isDisabledDate ? "not-allowed" : "pointer",
          opacity: isPastDate || isDisabledDate ? 0.5 : 1,
          pointerEvents: "auto", // <-- Always allow hover!
        }}
        onClick={() => {
          if (!isPastDate && !isDisabledDate) {
            setSelectedDate(dayjs(date));
            setIsModalVisible(true);
          }
        }}
      >
        {isToday && (
          <div
            style={{
              position: "absolute",
              top: "-5px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#1890ff",
            }}
          >
            ●
          </div>
        )}

        {listData.length > 0 && (
          <Tooltip
            title={
              <div>
                {listData.map((item, index) => {
                  const showItem =
                    selectedRequirementId === null ||
                    item.requirement === selectedRequirementId;
                  if (!showItem) return null;

                  return (
                    <div key={index}>
                      <div>
                        <strong>Demand:</strong> {item.demand} MWh
                      </div>
                      {item.price?.Solar && (
                        <div>
                          <strong>Solar:</strong> {item.price.Solar} INR
                        </div>
                      )}
                      {item.price?.["Non-Solar"] && (
                        <div>
                          <strong>Non-Solar:</strong> {item.price["Non-Solar"]}{" "}
                          INR
                        </div>
                      )}
                      <hr style={{ margin: "4px 0" }} />
                    </div>
                  );
                })}
              </div>
            }
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#52c41a",
                margin: "5px auto 0",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        )}
      </div>
    );
  };

  const handleToggleView = () => {
    setShowTable(!showTable);
  };

  const handleAddDetailsClick = () => {
    setIsInputModalVisible(true); // Show input modal when button is clicked
  };

  const handleStateChange = (value) => {
    const selectedRequirement = consumerRequirement.find(
      (item) => item.id === value
    );
    // console.log('selected req',selectedRequirement);
    console.log("id", value);

    setSelectedRequirementId(
      selectedRequirement ? selectedRequirement.id : null
    );
    setSelectedRequirement(selectedRequirement);
    setSelectedState(value);
  };

  const handleAddData = () => {
    setIsInputModalVisible(false); // Hide input modal
    setIsModalVisible(true); // Show technology modal
  };

  console.log("selected requirement", selectedRequirementId);

  const handleModalOk = async () => {
    // console.log('all fields filled:', allFieldsFilled);
    setAddLoading(true);
    if (!selectedRequirementId) {
      setAddLoading(false);
      message.error("Please select a valid consumption unit.");
      return;
    }
    if (!demand) {
      message.error("Please enter a demand value.");
      return;
    }
    if (!selectedTechnology) {
      message.error("Please select a technology.");
      return;
    }
    // console.log(selectedDate);

    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
    try {
      const newData = {
        requirement: selectedRequirementId,
        date: formattedDate,
        demand: Number(demand),
        price: (Array.isArray(selectedTechnology)
          ? selectedTechnology
          : [selectedTechnology]
        ).reduce((acc, tech) => {
          acc[tech] = parseFloat(price[tech]); // Convert price to number
          return acc;
        }, {}),
      };

      const res = await dispatch(addMonthData(newData)).unwrap();
      console.log("res add month data", res);

      if (res) {
        message.success("Data added successfully");

        // Fetch updated planning data to show the newly added record
        const updatedData = await dispatch(fetchPlanningData(user_id));
        console.log("updated data res", updatedData);

        setTableDemandData(
          Array.isArray(updatedData.payload) ? updatedData.payload : []
        );
      }
      setIsModalVisible(false);
      navigate("/px/consumer/planning");
    } catch (error) {
      message.error("Failed to submit data. Please try again.");
    }
    setAddLoading(false);
  };

  const handleDemandClick = (record) => {
    const selectedRequirement = consumerRequirement.find(
      (item) => item.state === record.state
    );
    setSelectedUnitDetails(selectedRequirement);

    setIsDetailModalVisible(true);
  };

  // console.log(selectedUnitDetails);

  const handleDateClick = (date) => {
    // console.log('date clicked');

    setSelectedDate(date.format("YYYY-MM-DD")); // Store selected date
    setIsModalVisible(true); // Open modal
  };

  const handleFileUpload = async (file, record) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64File = reader.result.split(",")[1]; // Get Base64 string without prefix

      const data = {
        requirement: record.requirementId, // Use requirementId from the record
        file: base64File, // Use Base64 encoded file
      };
      // console.log(data);

      try {
        const res = await dispatch(uploadTableMonthDataC(data)); // Call the API with the updated data
        // console.log('res', res);

        if (res) {
          message.success("File uploaded successfully");
          const updatedData = await dispatch(fetchPlanningData(user_id)); // Fetch updated data
          setTableDemandData(
            Array.isArray(updatedData.payload) ? updatedData.payload : []
          );
        }
      } catch (error) {
        message.error("Failed to upload file. Please try again.");
      }
    };

    reader.readAsDataURL(file); // Read the file as a Base64 string
    return false; // Prevent automatic upload
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      rowSpan: 2,
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Demand (MWh)",
      dataIndex: "demand",
      key: "demand",
      rowSpan: 2,
      render: (text, record) => (
        <Tooltip title="">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleDemandClick(record)}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Technology & Price (INR/kWh)",
      dataIndex: "technology",
      key: "technology",
    },
    // { title: 'Requirement Details', dataIndex: 'requirements', key: 'requirements' },
    {
      title: "Consumption Unit Details",
      children: [
        {
          title: "Site Name",
          dataIndex: "consumption_unit",
          key: "consumption_unit",
        },
        // {
        //   title: "Requirement ID",
        //   dataIndex: "requirementId",
        //   key: "requirementId",
        // },

        {
          title: "Industry",
          dataIndex: "industry",
          key: "industry",
        },
        {
          title: "Contracted Demand (MWh)",
          dataIndex: "contracted_demand",
          key: "contracted_demand",
        },
        // {
        //   title: 'Available Capacity (MWh)',
        //   dataIndex: 'available_capacity',
        //   key: 'available_capacity',
        // },
      ],
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        const currentDate = new Date();
        const currentDateStr = currentDate.toISOString().split("T")[0]; // Get YYYY-MM-DD
        const currentTimeStr = currentDate.toTimeString().split(" ")[0]; // Get HH:MM:SS

        // Convert both dates to Date objects
        const recordDate = new Date(record.date); // Ensure record.date is in YYYY-MM-DD format
        const currentDateOnly = new Date(currentDateStr); // Convert current date to Date object

        // Compare full DateTime when needed
        const isBeforeDeadline =
          recordDate > currentDateOnly ||
          (recordDate.getTime() === currentDateOnly.getTime() &&
            currentTimeStr < "10:30:00");

        // console.log("Comparing:", record.date, currentDateStr, currentTimeStr, isBeforeDeadline);

        return isBeforeDeadline ? (
          <Upload
            beforeUpload={(file) => {
              handleFileUpload(file, record);
              return false; // Prevent automatic upload
            }}
            showUploadList={false}
          >
            <Button type="primary">Upload Data</Button>
          </Upload>
        ) : (
          <Button disabled>Upload Data</Button>
        );
      },
    },
  ];

  const checkAllFieldsFilled = (tech, priceObj, demandVal) => {
    const hasTechnology = tech !== "";
    const hasPrice = priceObj[tech] && priceObj[tech] !== "";
    const hasDemand = demandVal !== "";

    setAllFilled(hasTechnology && hasPrice && hasDemand);
  };

  const tableData = Array.isArray(tableDemandData)
    ? tableDemandData.map((item) => {
        const requirementDetails = consumerRequirement.find(
          (req) => req.id === item.requirement
        );
        // console.log(requirementDetails);
        // console.log(item);

        return {
          key: item.requirement,
          date: item.date,
          demand: item.demand,
          state: requirementDetails ? requirementDetails.state : "N/A",
          consumption_unit: requirementDetails ? requirementDetails.consumption_unit : "N/A",
          industry: requirementDetails ? requirementDetails.industry : "N/A",
          contracted_demand: requirementDetails
            ? `${requirementDetails.contracted_demand} `
            : "N/A",
          technology: `${
            item.price?.Solar ? `Solar: ${item.price.Solar}` : ""
          }${item.price?.Solar && item.price?.["Non-Solar"] ? ", " : ""}${
            item.price?.["Non-Solar"]
              ? `Non-Solar: ${item.price["Non-Solar"]}`
              : ""
          }`,
          price: `${
            item.price?.Solar ? `${item.price.Solar} INR (Solar)` : ""
          }${item.price?.Solar && item.price?.["Non-Solar"] ? ", " : ""}${
            item.price?.["Non-Solar"]
              ? `${item.price["Non-Solar"]} INR (Non-Solar)`
              : ""
          }`,
          requirements: requirementDetails
            ? `State: ${requirementDetails.state}, Industry: ${requirementDetails.industry}, Contracted Demand: ${requirementDetails.contracted_demand} MWh, Consumption Unit: ${requirementDetails.consumption_unit}`
            : "N/A",
          requirementId: item.requirement, // Add requirement ID for file upload
        };
      })
    : [];

  // console.log(requirementId);

  const handlePrevMonth = () => {
    setCurrentMonth(dayjs(currentMonth).subtract(1, "month").toDate());
  };

  const handleNextMonth = () => {
    const nextMonthLimit = dayjs().add(1, "month");
    if (dayjs(currentMonth).isBefore(nextMonthLimit, "month")) {
      setCurrentMonth(dayjs(currentMonth).add(1, "month").toDate());
    } else {
      message.warning("You can plan for the current month only");
    }
  };

  return (
    <div
      style={{
        padding: "3%",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {" "}
      {/* Changed background color and set minHeight */}
      <div style={{ padding: "20px" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "10px" }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#669800",
              fontWeight: "bold",
            }}
          >
            Energy Planner
          </h1>
          {/* <h1 style={{ margin: 0 }}>Energy Planner</h1> */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
              margin: "1rem 0",
            }}
          >
            <Button
              style={{
                backgroundColor: "#669800",
                borderColor: "#669800",
                height: "40px",
                color: "white",
                minWidth: "140px",
                flex: "1 1 auto",
              }}
              onClick={handleToggleView}
            >
              {showTable ? "Show Calendar" : "Show Table"}
            </Button>

            <Button
              onClick={handleAddDetailsClick}
              style={{
                backgroundColor: "#ff5722",
                borderColor: "#ff5722",
                color: "black",
                height: "40px",
                minWidth: "140px",
                flex: "1 1 auto",
              }}
            >
              Schedule Trade
            </Button>
          </div>
        </Row>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Spin tip="Loading..." />
          </div>
        ) : !showTable ? (
          <Col span={24}>
            <p style={{ color: "GrayText" }}>
              (Note:
              <ol>
                <li>Select consumption unit from the drop down.</li>
                <li>
                  Select the date for which you want to schedule the trade.
                </li>
                <li>Enter the Price and Demand)</li>
              </ol>
            </p>
            <Form.Item
              label="Select Consumption Unit"
              style={{ fontSize: "24px" }}
            >
              <Select
                value={selectedRequirement ? selectedRequirement.id : undefined}
                onChange={handleStateChange}
                style={{ width: "80%", borderColor: "#669800" }}
                placeholder="Select Consumption Unit"
              >
                {Array.isArray(consumerRequirement) &&
                  consumerRequirement.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {`State: ${item.state}, Industry: ${item.industry}, Contracted Demand: ${item.contracted_demand} MWh, Consumption Unit: ${item.consumption_unit}`}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Card
              className="mainCard"
              style={{
                width: "90%",
                margin: "auto",
                padding: "10px",
                backgroundColor: "#fff",
              }}
            >
              {" "}
              {/* Updated card background color */}
              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: "10px" }}
              >
                <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
                <h2>{dayjs(currentMonth).format("MMMM YYYY")}</h2>
                <Tooltip title="You can plan for the current month only">
                  <Button icon={<RightOutlined />} onClick={handleNextMonth} />
                </Tooltip>
              </Row>
              <AntdCalendar
                value={dayjs(currentMonth)}
                onPanelChange={(date) => setCurrentMonth(date.toDate())}
                onSelect={handleDateClick}
                className="temp-calender"
                cellRender={(value) => tileContent(value)}
                style={{ "--cell-size": "20px" }} // Add custom CSS variable for cell size
              />
            </Card>
          </Col>
        ) : (
          <Col span={24}>
            <Card
              style={{
                width: "90%",
                margin: "auto",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "#fff",
              }}
            >
              {" "}
              {/* Updated shadow and card background color */}
              <Table
                dataSource={tableData}
                columns={columns}
                pagination={false}
                bordered
                scroll={{ y: 400 }}
              />
            </Card>
          </Col>
        )}
        {/* <Button
          type="primary"
          style={{ position: 'fixed', right: '20px', bottom: '20px' }}
          onClick={() => navigate('/consumer/plan-month-trade')}
        >
          Plan for More Days
        </Button> */}
      </div>
      <Modal
        title="Plan for More Days"
        open={isInputModalVisible}
        footer={null} // Remove default footer
        onCancel={() => setIsInputModalVisible(false)}
      >
        <Form.Item label="Select Consumption Unit" style={{ fontSize: "24px" }}>
          <Select
            value={selectedRequirement ? selectedRequirement.id : undefined}
            onChange={handleStateChange}
            style={{ width: "80%", borderColor: "#669800" }}
            placeholder="Select Consumption Unit"
          >
            {Array.isArray(consumerRequirement) &&
              consumerRequirement.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {`State: ${item.state}, Industry: ${item.industry}, Contracted Demand: ${item.contracted_demand} MWh, Consumption Unit: ${item.consumption_unit}`}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Select Date"
          style={{ fontSize: "16px", fontWeight: "600" }}
        >
          <DatePicker
            style={{
              width: "100%",
              fontSize: "16px",
              backgroundColor: "white",
            }}
            format="DD/MM/YYYY"
            disabledDate={(current) => {
              const isPastDate = current && current <= dayjs().endOf("day");
              const isDisabledDate = disableDates.some((disabledDate) =>
                dayjs(disabledDate).isSame(current, "day")
              );
              return isPastDate || isDisabledDate;
            }}
            onChange={(date) => {
              setSelectedDate(date);
              setAllFieldsFilled(selectedState && date); // Check if both fields are filled
            }}
          />
        </Form.Item>
        <Tooltip
          title={!allFieldsFilled ? "All fields are required" : ""}
          placement="top"
        >
          <Button onClick={handleAddData} disabled={!allFieldsFilled}>
            Add Data
          </Button>
        </Tooltip>
        <Button
          onClick={() => setIsInputModalVisible(false)}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </Button>
      </Modal>
      <Modal
        title="Select Technology"
        open={isModalVisible}
        onOk={handleModalOk} // Call handleModalOk on OK button click
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={addLoading}
        okButtonProps={{ disabled: !allFilled }} // 👈 disables OK when allFilled is false
      >
        <Radio.Group
          onChange={(e) => {
            const value = e.target.value;
            setSelectedTechnology(value);
            checkAllFieldsFilled(value, price, demand);
          }}
          value={selectedTechnology}
        >
          <Radio value="Solar">Solar</Radio>
          <Radio value="Non-Solar">Non-Solar</Radio>
        </Radio.Group>

        {/* Input fields for price */}
        <div style={{ marginTop: "15px" }}>
          {/* Solar Price Input */}
          {selectedTechnology === "Solar" && (
            <div>
              <label style={{ fontWeight: "bold" }}>Enter Solar Price (INR/kWh):</label>
              <Input
                type="number"
                placeholder="Enter solar price in INR/kWh"
                value={price["Solar"] || ""}
                min={0}
                onChange={(e) => {
                  const updatedPrice = { ...price, Solar: e.target.value };
                  setPrice(updatedPrice);
                  checkAllFieldsFilled(
                    selectedTechnology,
                    updatedPrice,
                    demand
                  );
                }}
                style={{
                  marginTop: "5px",
                  width: "100%",
                  marginBottom: "20px",
                }}
              />
            </div>
          )}

          {/* Non-Solar Price Input */}
          {selectedTechnology === "Non-Solar" && (
            <div>
              <label style={{ fontWeight: "bold" }}>
                Enter Non Solar Price (INR/kWh):
              </label>
              <Input
                type="number"
                placeholder="Enter non-solar price in INR/kWh"
                value={price["Non-Solar"] || ""}
                min={0}
                onChange={(e) => {
                  const updatedPrice = {
                    ...price,
                    "Non-Solar": e.target.value,
                  };
                  setPrice(updatedPrice);
                  checkAllFieldsFilled(
                    selectedTechnology,
                    updatedPrice,
                    demand
                  );
                }}
                style={{
                  marginTop: "5px",
                  width: "100%",
                  marginBottom: "20px",
                }}
              />
            </div>
          )}
        </div>
        <label
          style={{ fontSize: "14px", fontWeight: "700", marginTop: "3s0px" }}
        >
          Enter Demand (MWh):
        </label>
        <Input
          type="number"
          placeholder="Enter demand"
          min={0}
          style={{
            width: "100%",
            padding: "5px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          onChange={(e) => {
            const value = e.target.value;
            setDemand(value);
            checkAllFieldsFilled(selectedTechnology, price, value);
          }}
        />
        {/* </Form.Item> */}
      </Modal>
      <Modal
        title="Consumption Unit Details"
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
      >
        {selectedUnitDetails && (
          <div>
            <p>
              <strong>State:</strong> {selectedUnitDetails.state}
            </p>
            <p>
              <strong>Industry:</strong> {selectedUnitDetails.industry}
            </p>
            <p>
              <strong>Contracted Demand:</strong>{" "}
              {selectedUnitDetails.contracted_demand} MWh
            </p>
            <p>
              <strong>Consumption Unit:</strong>{" "}
              {selectedUnitDetails.consumption_unit}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Planning;
