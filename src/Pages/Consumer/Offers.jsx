import React, { useState, useEffect } from "react";
import { Table, Button, Col, Row, Typography, Select, Input, Modal, message } from "antd";
import { useDispatch } from "react-redux";
import { getOffers } from "../../Redux/Slices/Consumer/offersSlice";
import TermsDetailModal from "../../Components/Modals/CounterOffer"; // Adjust the path as needed
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

const Offers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCombinationModalVisible, setIsCombinationModalVisible] = useState(false);
  const [isRequirementModalVisible, setIsRequirementModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [combinationContent, setCombinationContent] = useState(null);
  const [RequirementContent, setRequirementContent] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [ippData, setIppData] = useState([]);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user")).user;

  useEffect(() => {
    const fetchIPPData = async () => {
      try {
        const data = {
          id: user.id,
          user_category: "Generator",
        };
        const response = await dispatch(getOffers(data));
        if (response?.payload?.length > 0) {
          setIppData(response.payload);
        } else {
          setIppData([]);
          message.info("No data found");
        }
      } catch (error) {
        setError("Error fetching IPP data");
        message.error("Error fetching IPP data");
      }
    };

    fetchIPPData();
  }, [dispatch, user.id]);

  const showModal = (record) => {
    console.log(record);
    setModalContent(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  const showCombinationModal = (record) => {
    setCombinationContent(record);
    setIsCombinationModalVisible(true);
  };
  const showRequirementModal = (record) => {
    setRequirementContent(record);
    setIsRequirementModalVisible(true);
  };

  const handleCloseCombinationModal = () => {
    setIsCombinationModalVisible(false);
    setCombinationContent(null);
  };
  const handleRequirementModalClose = () => {
    setIsRequirementModalVisible(false);
    setRequirementContent(null);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = Array.isArray(ippData)
  ? ippData.filter((record) => {
      const statusMatch = statusFilter ? record.consumer_status === statusFilter : true;
      const searchMatch = searchText
        ? Object.values(record)
            .some(value =>
              value &&
              value.toString().toLowerCase().includes(searchText.toLowerCase())
            ) ||
          Object.values(record.requirement || {})
            .some(value =>
              value &&
              value.toString().toLowerCase().includes(searchText.toLowerCase())
            ) ||
            Object.values(record.combination || {})
            .some(value =>
              value &&
              value.toString().toLowerCase().includes(searchText.toLowerCase())
            )
        : true;

      return statusMatch && searchMatch;
    })
  : [];



    console.log(filteredData);

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      key: "srNo",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Combination ID",
      dataIndex: "combination",
      key: "combination",
      render: (text) => {
        const transformCombination = (text) => {
          const parts = text.split("-");
          if (parts.length === 4) {
            return parts[0] + parts[1].charAt(0) + parts[1].charAt(parts[1].length - 1) +
                   parts[2].charAt(0) + parts[2].charAt(parts[2].length - 1) +
                   parts[3].charAt(0) + parts[3].charAt(parts[3].length - 1);
          } 
          if (parts.length === 3) {
            return parts[0] + parts[1].charAt(0) + parts[1].charAt(parts[1].length - 1) +
                   parts[2].charAt(0) + parts[2].charAt(parts[2].length - 1);
          } 
          if (parts.length === 2) {
            return parts[0] + parts[1].charAt(0) + parts[1].charAt(parts[1].length - 1);
          }
          return text; // Default case
        };
    
        return (
          <Typography.Link onClick={() => showCombinationModal(text)}>
            {transformCombination(text.combination)}
          </Typography.Link>
        );
      },
    },
    // {
    //   title: "State",
    //   dataIndex: "requirement",
    //   key: "requirement",
    //   render: (text) => text.rq_state,
    // },
    // {
    //   title: "Industry",
    //   dataIndex: "requirement",
    //   key: "industry",
    //   render: (text) => text.rq_industry,
    // },
    {
      title: "Contracted Energy (MW)",
      dataIndex: "contracted_energy",
      key: "contracted_energy",
    },
    {
      title: "Contracted Demand (MW)",
      dataIndex: "requirement",
      key: "contractedDemand",
      render: (text) => 
      <Typography.Link onClick={() => showRequirementModal(text)}>
      {text.rq_contracted_demand}
    </Typography.Link>,
    },
    {
      title: "Lock-in Period (Months)",
      dataIndex: "lock_in_period",
      key: "lock_in_period",
    },  
    {
      title: "term_of_ppa (Years)",
      dataIndex: "term_of_ppa",
      key: "term_of_ppa",
    },  
    {
      title: "Commencement Date",
      dataIndex: "commencement_of_supply",
      key: "commencement_of_supply",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },  
    // {
    //   title: "Tariff Category",
    //   dataIndex: "requirement",
    //   key: "tariffCategory",
    //   render: (text) => text.rq_tariff_category,
    // },
    {
      title: "Status",
      key: "status",
      dataIndex: "consumer_status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => showModal(record)}>
          Counter Offer
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Col span={24} style={{ marginLeft: "20px" }}>
        <Title level={3} style={{ color: "#001529" }}>Offers</Title>
        <h4>( Total offers received and sent from you. )</h4>
      </Col>

      <Row gutter={16} style={{ marginBottom: "20px", justifyContent: "center", marginTop: "20px" }}>
        <Col style={{ marginRight: "40%" }}>
          <Input
            placeholder="Search"
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: 200, border: "1px solid #6698005c" }}
          />
        </Col>
        <Col>
          <Select
            placeholder="Filter by Status"
            onChange={handleStatusChange}
            style={{ width: 200, border: "1px solid #6698005c", borderRadius: "5px" }}
            allowClear
          >
            <Option value="Pending">Pending</Option>
            <Option value="Accepted">Accepted</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        </Col>
      </Row>

      {error ? (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      ) : ippData.length === 0 ? (
        <div style={{ textAlign: "center" }}>No Data Found</div>
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          bordered
          pagination={false}
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "95%",
            margin: "0 auto",
          }}
        />
      )}

      {/* Terms Detail Modal */}
      {modalContent && (
        <TermsDetailModal
          visible={isModalVisible}
          data={modalContent}
          onCancel={handleCloseModal}
          type="generator"
          selectedDemandId={modalContent.requirement.rq_id}
        />
      )}

      {/* Combination Detail Modal */}
      <Modal
        title="Combination Details"
        open={isCombinationModalVisible}
        onCancel={handleCloseCombinationModal}
        footer={null}
      >
        {combinationContent && (
          <div>
            <p><strong>Combination ID:</strong> {combinationContent.combination}</p>
            <p><strong>State:</strong> {combinationContent.state}</p>
            <p><strong>Solar:</strong> {combinationContent.optimal_solar_capacity} MW</p>
            <p><strong>Wind:</strong> {combinationContent.optimal_wind_capacity} MW</p>
            <p><strong>ESS:</strong> {combinationContent.optimal_battery_capacity} MW</p>
            <p><strong>Final Cost:</strong> {combinationContent.final_cost}</p>
            <p><strong>Per Unit Cost:</strong> {combinationContent.per_unit_cost}</p>
          </div>
        )}
      </Modal>

      {/* Terms Detail Modal */}
      <Modal
        title="Demand Details"
        open={isRequirementModalVisible}
        onCancel={handleRequirementModalClose}
        footer={null}
      >
        {RequirementContent && (
          <div>
            <p><strong>Demand ID:</strong> {RequirementContent.rq_id}</p>
            <p><strong>Industry:</strong> {RequirementContent.rq_industry}</p><p>
  <strong>Procurement Date:</strong>{" "}
  {moment(RequirementContent.rq_procurement_date).format("DD-MM-YYYY")}
</p>
            <p><strong>Site Name:</strong> {RequirementContent.rq_site}</p>
            <p><strong>State:</strong> {RequirementContent.rq_state}</p>
            <p><strong>Tarrif Category:</strong> {RequirementContent.rq_tariff_category}</p>
            <p><strong>Voltage Level:</strong> {RequirementContent.rq_voltage_level}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Offers;
