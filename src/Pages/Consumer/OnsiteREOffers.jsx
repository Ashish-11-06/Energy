import React, { useEffect, useState } from "react";
import { Table, Button, Typography, Empty, Card } from "antd";
import { decryptData } from "../../Utils/cryptoHelper";
import roofTop from "../../Redux/api/roofTop";
import OnSiteOfferSendModal from "../../Components/Modals/OnSiteOfferSendModal";

const { Title } = Typography;

const OnsiteREOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false); // 👈 loader state
  const [refreshData, setRefreshData] = useState(false); // to trigger data refresh after actions     
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleOfferAction = (record) => {
    setSelectedOffer(record);
    setOfferModalVisible(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.log("No user found in localStorage");
        return;
      }

      try {
        setLoading(true); // 👈 start loader
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
        setLoading(false); // 👈 stop loader
      }
    };

    fetchData();
  }, []);

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
      title: "Required Capacity (kWp)",
      dataIndex: "offered_capacity",
      key: "offered_capacity",
      render: (value) => value ?? "NA",
    },
    {
      title: "status",
      dataIndex: "consumer_status",
      key: "consumer_status",
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
      {/* <Card> */}
      <Table
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.15)", borderRadius: 8 }}
        dataSource={offers}
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

      {selectedOffer && (
        <OnSiteOfferSendModal
          visible={offerModalVisible}
          onClose={() => setOfferModalVisible(false)}
          formValues={selectedOffer}
          fromConsumer={true}
          setRefreshData={setRefreshData}
          selectedOffer={selectedOffer}
        />
      )}
    </div>
  );
};

export default OnsiteREOffers;
