import React, { useEffect, useState } from "react";
import { Table, Typography, Button, Empty, Card, Tag, Input } from "antd";
import RooftopModal from "../../Components/Generator/RooftopModal";
import OnSiteOfferSendModal from "../../Components/Modals/OnSiteOfferSendModal";
import roofTop from "../../Redux/api/roofTop";
import { decryptData } from "../../Utils/cryptoHelper";

const { Title } = Typography;

const GeneratorRooftop = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [user, setUser] = useState(null);
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = decryptData(storedUser);
        const parsedUser =
          typeof userData === "string" ? JSON.parse(userData) : userData;
        setUser(parsedUser.user);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const response = await roofTop.getOffersById(user.id);
        setConsumers(response.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, refreshData]);

  const handleRowClick = (record) => {
    setSelectedConsumer(record);
    setModalVisible(true);
  };

  const handleOfferAction = (record) => {
    setSelectedOffer(record);
    setOfferModalVisible(true);
  };

  const handleInputChange = (field, value) => {
    setSelectedOffer((prev) => ({ ...prev, [field]: value }));
  };

  // Add filteredData for search
  const filteredData = consumers.filter((consumer) => {
    const searchLower = searchText.toLowerCase();
    return (
      (consumer.consumer && consumer.consumer.toLowerCase().includes(searchLower)) ||
      (consumer.industry && consumer.industry.toLowerCase().includes(searchLower)) ||
      (consumer.state && consumer.state.toLowerCase().includes(searchLower)) ||
      (consumer.generator_status && consumer.generator_status.toLowerCase().includes(searchLower)) 
      // (consumer.site_name && consumer.site_name.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    {
      title: "Sr. No.",
      key: "srno",
      render: (_, __, index) => index + 1,
      align: "center",
    },
    {
      title: "Consumer ID",
      dataIndex: "consumer",
      key: "consumer",
      align: "center",
      render: (text, record) => (
        <a
          style={{ color: "#9a8406", cursor: "pointer" }}
          onClick={() => handleRowClick(record)}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      align: "center",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      align: "center",
    },
    // {
    //   title: "Consumption Unit (Site Name)",
    //   dataIndex: "site_name",
    //   key: "site_name",
    //   align: "center",
    // },
    {
      title: "Contracted Demand (MW)",
      dataIndex: "contracted_demand",
      key: "contracted_demand",
      align: "center",
    },
    {
      title: "Roof Area (square meters)",
      dataIndex: "roof_area",
      key: "roof_area",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "generator_status",
      key: "generator_status",
      render: (status) => {
        let color = "";
        if (status === "Rejected") color = "orange";
        else if (status === "Accepted") color = "green";
        else if (status === "Counter offer recieved" || status === "Counter offer sent") color = "yellow";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          style={{ background: "#669800", borderRadius: 4 }}
          onClick={() => handleOfferAction(record)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 20 }}>
        Onsite RE Offers
      </Title>
      <Input
        placeholder="Search by Consumer ID, Industry, State or Status"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
        style={{ width: 400, marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={searchText ? filteredData : consumers}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        style={{
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          borderRadius: 8,
          cursor: "pointer",
        }}
        loading={loading}
        locale={{
          emptyText: <Empty description="No offers received yet" />,
        }}
      />

      {/* Consumer details modal */}
      <RooftopModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        consumer={selectedConsumer}
      />

      <OnSiteOfferSendModal
        visible={offerModalVisible}
        onClose={() => setOfferModalVisible(false)}
        selectedOffer={selectedOffer}
        handleInputChange={handleInputChange}
        setRefreshData={setRefreshData}
        fromConsumer={false}
      />
    </div>
  );
};

export default GeneratorRooftop;
