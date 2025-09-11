import React, { useEffect, useState } from "react";
import { Table, Button, Typography, Empty, Card, Tag, Input } from "antd";
import { decryptData } from "../../Utils/cryptoHelper";
import roofTop from "../../Redux/api/roofTop";
import OnSiteOfferSendModal from "../../Components/Modals/OnSiteOfferSendModal";
import RooftopConsumerModal from "../../Components/Consumer/RooftopConsumerModal";

const { Title } = Typography;

const OnsiteREOffers = () => {
  const [modalVisible, setModalVisible] = useState(false);
const [selectedGenerator, setSelectedGenerator] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false); // 👈 loader state
  const [refreshData, setRefreshData] = useState(false); // to trigger data refresh after actions     
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [searchText, setSearchText] = useState("");

  const handleOfferAction = (record) => {
    setSelectedOffer(record);
    setOfferModalVisible(true);
  };

  const handleRowClick = (record) => {
  setSelectedGenerator(record);
  setModalVisible(true);
};

  const filteredData = offers.filter((offer) => {
    const searchLower = searchText.toLowerCase();
    return (
      offer.generator.toLowerCase().includes(searchLower) ||
      (offer.industry && offer.industry.toLowerCase().includes(searchLower)) ||
      (offer.state && offer.state.toLowerCase().includes(searchLower)) ||
      (offer.site_name && offer.site_name.toLowerCase().includes(searchLower)) ||
      (offer.consumer_status && offer.consumer_status.toLowerCase().includes(searchLower))
    );
  });


  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.log("No user found in localStorage");
        return;
      }

      try {
        setLoading(true); 
        const userData = decryptData(storedUser);
        // console.log("Decrypted user data:", userData);

        let parsedUser;
        if (typeof userData === "string") {
          parsedUser = JSON.parse(userData)?.user;
        } else {
          parsedUser = userData?.user;
        }

        // console.log("Parsed user data:", parsedUser);

        if (parsedUser?.id) {
          try {
            const response = await roofTop.getOnSiteOffersById(parsedUser.id);
            // console.log("API Response:", response);
            setOffers(response.data || []);
          } catch (apiError) {
            console.error("Error fetching offers:", apiError);
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [refreshData]);

  const columns = [
    {
      title: "Sr. No.",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Generator ID",
      dataIndex: "generator",
      key: "generator",
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
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Consumption Unit (Site Name)",
      dataIndex: "site_name",
      key: "site_name",
    },
    {
      title: "Required Capacity (kWp)",
      dataIndex: "offered_capacity",
      key: "offered_capacity",
      render: (value) => value ?? "NA",
    },
    {
      title: "Status",
      dataIndex: "consumer_status",
      key: "consumer_status",
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
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button type="primary" onClick={() => handleOfferAction(record)} style={{ background: "#669800" }}>
            View
          </Button>
        </div>
      ),
    },

  ];

  return (
    <div style={{ margin: 20 }}>
      <Title level={4} style={{ marginBottom: 20 }}>
        Onsite RE Offers
      </Title>
      <Input
        placeholder="Search by Generate ID, Industry, State, Site Name or Status"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
        style={{ width: 440, marginBottom: 16 }}
      />
      {/* <Card> */}
      <Table
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.15)", borderRadius: 8 }}
        dataSource={searchText ? filteredData : offers}
        columns={columns}
        pagination={{ pageSize: 10 }}
        bordered
        loading={loading}
        rowKey={(record, index) => record.id || index}
        locale={{
          emptyText: <Empty description="No offers sent yet" />,
        }}
      />
      {/* </Card> */}

       {/* generator details modal */}
      <RooftopConsumerModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  consumer={selectedGenerator}
/>

      {selectedOffer && (
        <OnSiteOfferSendModal
          visible={offerModalVisible}
          onClose={() => setOfferModalVisible(false)}
          formValues={selectedOffer}
          fromConsumer={true}
          setRefreshData={setRefreshData}
          selectedOffer={selectedOffer}
          loading={loading}
        />
      )}
    </div>
  );
};

export default OnsiteREOffers;
