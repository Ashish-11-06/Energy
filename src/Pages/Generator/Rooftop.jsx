import React, { useEffect, useState } from "react";
import { Table, Typography, Button, Empty } from "antd";
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
      title: "Contracted Demand",
      dataIndex: "contracted_demand",
      key: "contracted_demand",
      align: "center",
    },
    {
      title: "Roof Area",
      dataIndex: "roof_area",
      key: "roof_area",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "generator_status",
      key: "generator_status",
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
      <Table
        columns={columns}
        dataSource={consumers}
        rowKey="id"
        bordered
        pagination={false}
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
