/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "../Pages/TrackStatus.css"; // Import the CSS file for styling
import { Card, Col, Form, Select, Spin, Table } from "antd";
import {
  fetchTrackStatusData,
  fetchTrackStatusGenerationData,
} from "../Redux/slices/consumer/trackStatusSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllProjectsById } from "../Redux/slices/generator/portfolioSlice";
import { fetchRequirements } from "../Redux/slices/consumer/consumerRequirementSlice";
const approvals = [
  { text: "Demand added", status: "green" },
  { text: "aa", status: "yellow" },
];

const TrackStatusP = () => {
  const user = JSON.parse(localStorage.getItem("user")).user;
  const dispatch = useDispatch();
  const user_category = user?.user_category;
  const titleText =
    user_category === "Consumer" ? "Demand Status" : "Generation Status"; // Set title based on user category
  const [trackData, setTrackData] = useState([]); // State to hold fetched data
  const [trackDataGen, setTrackDataGen] = useState([]); // State to hold fetched data
  const [loading, setLoading] = useState(false);
  const [generatorPortfolio, setGeneratorPortfolio] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
  const [consumerRequirement, setConsumerRequirement] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const user_id = user.id;
  const [filteredTrackDataGen, setFilteredTrackDataGen] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
 const [filteredTrackData, setFilteredTrackData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user_category === "Consumer") {
          // Check if user_category is Consumer
          const res = await dispatch(fetchTrackStatusData(user?.id)).unwrap(); // Await the dispatched action
          setTrackData(res); // Store the fetched data in state
        }
        if (user_category === "Generator") {
          // Check if user_category is Consumer
          const res = await dispatch(
            fetchTrackStatusGenerationData(user?.id)
          ).unwrap(); // Await the dispatched action
          setTrackDataGen(res); // Store the fetched data in state
        }
      } catch (error) {
        console.error("Error fetching trading data:", error);
      }
      setLoading(false);
    };

    fetchData(); // Call the async function
  }, [dispatch, user?.id, user_category]);

  const handleStateChange = (option) => {
    const compositeValue = option.value; // e.g., "Solar-19"
    const [type, idStr] = compositeValue.split("-");
    const id = parseInt(idStr, 10);
    setSelectedPortfolioId(id); // Update selectedPortfolioId directly
    const selected = generatorPortfolio.find(
      (item) => item.id === id && item.type === type
    );
    setSelectedPortfolio(selected);
    setSelectedTechnology(type);
    // console.log("Selected Portfolio:", selectedPortfolio);
  };
  // console.log('track',trackDataGen);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        const id = user_id;
        if (user_category === "Generator") {
          res = await dispatch(getAllProjectsById(id)).unwrap();
          const flattenedPortfolio = [
            ...res.Solar.map((item) => ({ ...item, type: "Solar" })),
            ...res.Wind.map((item) => ({ ...item, type: "Wind" })),
            ...res.ESS.map((item) => ({ ...item, type: "ESS" })),
          ];
          const filteredPortfolio = flattenedPortfolio.filter(
            (item) => item.type !== "ESS"
          );
          setGeneratorPortfolio(filteredPortfolio);
        } else if (user_category === "Consumer") {
          res = await dispatch(fetchRequirements(id)); // Wait for API response
          const states = res.payload.map((item) => item.state);
          setConsumerRequirement(res.payload);
        }
        // console.log(flattenedPortfolio);
      } catch (error) {
        // console.log("Error fetching portfolio:", error);
      }
    };

    fetchData();
  }, [user_id, dispatch]);

const handleStateChangee = (value) => {
  const [state, industry, contracted_demand, consumption_unit] = value.split("||");

  const selectedRequirement = consumerRequirement.find(
    (item) =>
      item.state === state &&
      item.industry === industry &&
      String(item.contracted_demand) === contracted_demand &&
      item.consumption_unit === consumption_unit
  );

  if (selectedRequirement) {
    setSelectedState(value);
    setSelectedRequirementId(selectedRequirement.id);

    // Filter the trackData here
    const filtered = trackData.filter((item) => {
      const detail = item.consumption_unit_details;
      return (
        item?.consumption_unit_details &&
        detail.state === state &&
        detail.industry === industry &&
        String(detail.contracted_demand) === contracted_demand &&
        detail.consumption_unit === consumption_unit
      );
    });

    setFilteredTrackData(filtered);
  } else {
    setSelectedRequirementId(null);
    setFilteredTrackData(trackData); // fallback to all
  }
};


  const genColumns = [
    {
      title: "Trade Date",
      dataIndex: "generation_date",
    },
    {
      title: "Trade Volume (MW)",
      dataIndex: "generation",
    },

    {
      title: "Technology & Price (INR/MWh)",
      render: (text, record) =>
        `${record.portfolio_details?.technology || ""} - ${record.price || ""}`,
    },
    {
      title: "Portfolio Details",
      children: [
        {
          title: "Site Name",
          dataIndex: ["portfolio_details", "site_name"],
          render: (text) => text || "N/A",
        },
        {
          title: "Available Capacity (MW)",
          dataIndex: ["portfolio_details", "available_capacity"],
        },
      ],
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const conColumns = [
    {
      title: "Trade Date",
      dataIndex: "demand_date",
    },
    {
      title: "Trade Volume (MW)",
      dataIndex: "average_demand",
    },

    {
      title: "Consumption Unit Details",
      children: [
        // {
        //     title: 'Industry',
        //     dataIndex: ['consumption_unit_details', 'industry'],
        // },
        {
          title: "Site Name",
          dataIndex: ["consumption_unit_details", "consumption_unit"],
        },
        {
          title: "Contracted Demand (MWh)",
          dataIndex: ["consumption_unit_details", "contracted_demand"],
        },
      ],
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const columns = user_category === "Consumer" ? conColumns : genColumns;
  // console.log("filtered requ", generatorPortfolio);
  // console.log("selected portfolio id", selectedPortfolioId);
  // console.log("selected portfolio", selectedPortfolio);
  // console.log("track data gen", trackDataGen);

  useEffect(() => {
    if (selectedPortfolioId) {
      const filtered = trackDataGen.filter(
        (item) => item.portfolio_details?.portfolio === selectedPortfolioId
      );
      setFilteredTrackDataGen(filtered);
    } else {
      setFilteredTrackDataGen(trackDataGen); // Show all by default
    }
  }, [selectedPortfolioId, trackDataGen]);

// console.log('track data',trackData);


  return (
    <div
      style={{
        padding: "3%",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#669800",
          fontWeight: "bold",
        }}
      >
        {titleText}
      </h1>

      {/* This wrapper forces the Select to left side of screen */}
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-start" }}
      >
        <div style={{ width: "90%" }}>
          <Form.Item label="Select Portfolio" style={{ width: "100%" }}>
            {user_category === "Generator" && (
              <Select
                labelInValue
                value={
                  selectedPortfolioId && selectedTechnology
                    ? {
                        value: `${selectedTechnology}-${selectedPortfolioId}`,
                        label: `${selectedPortfolio?.type}: State: ${selectedPortfolio?.state}, Connectivity: ${selectedPortfolio?.connectivity}, Available Capacity: ${selectedPortfolio?.available_capacity} MWh, Annual Generation Potential: ${selectedPortfolio?.annual_generation_potential}`,
                      }
                    : undefined
                }
                onChange={handleStateChange}
                style={{ width: "70%", borderColor: "#669800" }}
                placeholder="Select Portfolio"
              >
                {Array.isArray(generatorPortfolio) &&
                  generatorPortfolio.map((item) => {
                    const compositeId = `${item.type}-${item.id}`;
                    const label = `${item.type}: State: ${item.state}, Connectivity: ${item.connectivity}, Available Capacity: ${item.available_capacity} MWh, Annual Generation Potential: ${item.annual_generation_potential}`;
                    return (
                      <Select.Option key={compositeId} value={compositeId}>
                        {label}
                      </Select.Option>
                    );
                  })}
              </Select>
            )}

            {user_category === "Consumer" && (
            <Select
  value={selectedState || undefined} // use composite string directly
  onChange={handleStateChangee}
  style={{ width: "100%", borderColor: "#669800" }}
  placeholder="Select Consumption Unit"
>
  {consumerRequirement.map((item) => (
    <Select.Option
      key={item.id}
      value={`${item.state}||${item.industry}||${item.contracted_demand}||${item.consumption_unit}`}
    >
      {`State: ${item.state}, Industry: ${item.industry}, Contracted Demand: ${item.contracted_demand} MWh, Consumption Unit: ${item.consumption_unit}`}
    </Select.Option>
  ))}
</Select>

            )}
          </Form.Item>
        </div>
      </div>

      <Card
        style={{
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#fff",
          width: "90%",
        }}
      >
        <Spin spinning={loading} tip="Loading...">
        <Table
  dataSource={
    user_category === "Consumer"
      ? (selectedState ? filteredTrackData : trackData)
      : selectedPortfolioId
      ? filteredTrackDataGen
      : trackDataGen
  }
  columns={columns}
  style={{ textAlign: "center" }}
  bordered
  pagination={false}
  scroll={{ y: 350 }}
/>

        </Spin>
      </Card>
    </div>
  );
};
export default TrackStatusP;
