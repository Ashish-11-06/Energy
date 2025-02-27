import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Col,
  Row,
  Typography,
  Select,
  Input,
  Modal,
  message,
  Spin,
  Tag
} from "antd";
import { useDispatch } from "react-redux";
import { getOffers } from "../../Redux/Slices/Consumer/offersSlice";
import TermsDetailModal from "../../Components/Modals/CounterOffer"; // Adjust the path as needed
import moment from "moment";
import { render } from "less";
import DemandModal from "./Modal/DemandModal";
import CombinationModal from "./Modal/CombinationModal";

const { Title } = Typography;
const { Option } = Select;

const Offers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCombinationModalVisible, setIsCombinationModalVisible] =
    useState(false);
  const [isRequirementModalVisible, setIsRequirementModalVisible] =
    useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [combinationContent, setCombinationContent] = useState(null);
  const [requirementContent, setRequirementContent] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [ippData, setIppData] = useState([]);
  const [error, setError] = useState(null);
  const [loading,setLoader]=useState(false);
  const [ refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user")).user;
  const user_category = user.user_category;

  useEffect(() => {
    const fetchIPPData = async () => {
      try {
        const data = {
          id: user.id,
          user_category: "Generator",
        };
        setLoader(true);
        const response = await dispatch(getOffers(data));
        if (response?.payload?.length > 0) {
          setIppData(response.payload);
          setLoader(false);
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
    setRefresh(false);
  }, [dispatch, user.id, refresh]);


  console.log(ippData);

  const showModal = (record) => {
    console.log(record);
    setModalContent(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
    setRefresh(true);
  };

  const showCombinationModal = (record) => {
    setCombinationContent(record);
    setIsCombinationModalVisible(true);
  };
  const showRequirementModal = (record) => {
    console.log(record);
    setRequirementContent(record);
    console.log(requirementContent);
    setIsRequirementModalVisible(true);
  };
  // console.log(requirementContent);

  const handleCloseCombinationModal = () => {
    setIsCombinationModalVisible(false);
    setCombinationContent(null);
  };
  const handleRequirementModalClose = () => {
    setIsRequirementModalVisible(false);
    // setRequirementContent(null);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = Array.isArray(ippData)
    ? ippData.filter((record) => {
        const statusMatch = statusFilter
          ? record.consumer_status === statusFilter
          : true;
        const searchMatch = searchText
          ? Object.values(record).some(
              (value) =>
                value &&
                value
                  .toString()
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
            ) ||
            Object.values(record.requirement || {}).some(
              (value) =>
                value &&
                value
                  .toString()
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
            ) ||
            Object.values(record.combination || {}).some(
              (value) =>
                value &&
                value
                  .toString()
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
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
      width: '12%',
      render: (text) => {
        const transformCombination = (text) => {
          const parts = text.split("-");
          if (parts.length === 4) {
            return (
              parts[0] +
              parts[1].charAt(0) +
              parts[1].charAt(parts[1].length - 1) +
              parts[2].charAt(0) +
              parts[2].charAt(parts[2].length - 1) +
              parts[3].charAt(0) +
              parts[3].charAt(parts[3].length - 1)
            );
          }
          if (parts.length === 3) {
            return (
              parts[0] +
              parts[1].charAt(0) +
              parts[1].charAt(parts[1].length - 1) +
              parts[2].charAt(0) +
              parts[2].charAt(parts[2].length - 1)
            );
          }
          if (parts.length === 2) {
            return (
              parts[0] +
              parts[1].charAt(0) +
              parts[1].charAt(parts[1].length - 1)
            );
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
      render: (text) => (
        <Typography.Link onClick={() => showRequirementModal(text)}>
          {text.rq_contracted_demand}
          {/* {console.log(text)} */}
        </Typography.Link>
      ),
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
    // {
    //   title: "Status",
    //   key: "status",
    //   render: (_, record) => {
    //     return user_category === "Consumer"
    //       ? record.consumer_status `Generator response awaited`
    //       : record.generator_status;
    //   },

    {
      title: "Status",
      key: "status",
      width: "15%",
      render: (_, record) => {
        if (user_category === "Consumer") {
          return (record.consumer_status === "Offer Sent" || record.consumer_status === "Counter Offer Sent") 
            ? <>
                {record.consumer_status} - <Tag color="blue">Generator response awaited</Tag>
              </>
            : record.consumer_status || "";
        } else {
          return (record.generator_status === "Offer Sent" || record.generator_status === "Counter Offer Sent") 
            ? <>
                {record.generator_status} - <Tag color="green">Consumer response awaited</Tag>
              </>
            : record.generator_status || "";
        }
      },
    },

    // {
    //   title: "Bidding Window Date",
    //   dataIndex: "transaction_window_date",
    //   key: "transaction_window_date",
    //   render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          
            record.consumer_status === 'Accepted' || record.consumer_status === 'Rejected' ||  record.generator_status === 'Accepted' || record.generator_status === 'Rejected' ? (
              <Button type="primary" disabled  >
                Offer Closed
              </Button>
            ) : (
          <Button type="primary" onClick={() => showModal(record)}>
            Send Offer
          </Button>
            )
          //   )
          // ) : user_category === 'Generator' ? (
          //   record.count === 1 && record.generator_status === 'Pending' ? (
          //     <Button type="primary" disabled>
          //       Counter Offer
          //     </Button>
          //   ) : (
          //     <Button type="primary" onClick={() => showModal(record)}>
          //       Counter Offer
          //     </Button>
          //   )
          // ) : null // This covers the case when user_category is neither 'Consumer' nor 'Generator'
        );
      },
    },
    {
      title: "Bidding Window Date",
      dataIndex: "transaction_window_date",
      key: "transaction_window_date",
      width: "10%",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Col span={24} style={{ marginLeft: "20px" }}>
        <Title level={3} style={{ color: "#001529" }}>
          Offer Transaction Window
        </Title>
        <h4>( Total offers received and sent from you. )</h4>
      </Col>

      <Row
  gutter={16}
  style={{
    marginBottom: "20px",
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingLeft:'2.5%',
    paddingRight:'2.5%'
  }}
>
  <Col>
    <Input
      placeholder="Search"
      value={searchText}
      onChange={handleSearchChange}
      style={{
        width: 200,
        border: "1px solid #6698005c",
        borderRadius: "5px",
        height: 30,
        fontSize:'16px',
        backgroundColor:'white'
      }}
    />
  </Col>
  <Col>
    <Select
      placeholder="Filter by Status"
      onChange={handleStatusChange}
      style={{
        width: 200,
        border: "1px solid #6698005c",
        borderRadius: "5px",
        height: 30,
      }}
      allowClear
    >
      <Option value="Pending">Pending</Option>
      <Option value="Accepted">Accepted</Option>
      <Option value="Rejected">Rejected</Option>
      <Option value="Negotiated">Negotiated</Option>
    </Select>
  </Col>
</Row>


      {error ? (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      ) : loading ? ( // Show loader when data is being fetched
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spin size="large" />
        </div>
      ) : ippData.length === 0 ? (
        <div style={{ textAlign: "center" }}>No Data Found</div>
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          size="small"
          bordered
          loading={loading} // AntD's built-in loader
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
      {/* <Modal
        title="Combination Details"
        open={isCombinationModalVisible}
        onCancel={handleCloseCombinationModal}
        footer={null}
      >
        {combinationContent && (
          <div>
            <p><strong>Combination ID:</strong> {combinationContent.combination}</p>
            <p><strong>State:</strong> {combinationContent.state.Solar_1} {combinationContent.state.Wind_1}</p>
            <p><strong>Solar:</strong> {combinationContent.optimal_solar_capacity} MW</p>
            <p><strong>Wind:</strong> {combinationContent.optimal_wind_capacity} MW</p>
            <p><strong>ESS:</strong> {combinationContent.optimal_battery_capacity} MW</p>
            <p><strong>Final Cost:</strong> {combinationContent.final_cost}</p>
            <p><strong>Per Unit Cost:</strong> {combinationContent.per_unit_cost}</p>
          </div>
        )}
      </Modal> */}

      {/* Terms Detail Modal */}
      <DemandModal
        title="Demand Details"
        open={isRequirementModalVisible}
        onCancel={handleRequirementModalClose}
        requirementContent={requirementContent}
        footer={null}
      />
      <CombinationModal
        title="Combination Modal"
        open={isCombinationModalVisible}
        onCancel={handleCloseCombinationModal}
        combinationContent={combinationContent}
      />
    </div>
  );
};

export default Offers;
