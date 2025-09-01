import React, { useEffect, useState } from "react";
import { Table, Button, Card } from "antd";
import RooftopModal from "../../Components/Generator/RooftopModal";
import roofTop from "../../Redux/api/roofTop";
import { decryptData } from "../../Utils/cryptoHelper";

const GeneratorRooftop = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [user, setUser] = useState(null);
  const [consumers, setConsumers] = useState([]); // ✅ state for API data

  // ✅ Load user only once on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = decryptData(storedUser);
        const parsedUser =
          typeof userData === "string" ? JSON.parse(userData) : userData;
        setUser(parsedUser.user); // adjust if your decrypted data structure differs
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // ✅ Fetch offers when user ID is available
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return; // only fetch if user exists
      try {
        console.log("Fetching offers for user ID:", user.id);
        const response = await roofTop.getOffersById(user.id);
        console.log("API Response:", response.data);
        setConsumers(response.data); // ✅ update table data
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchData();
  }, [user]);

  const columns = [
    {
      title: "Sr. No.",
      key: "srno",
      render: (text, record, index) => index + 1,
      align: "center",
    },
    {
      title: "Consumer ID",
      dataIndex: "consumer",
      key: "consumer",
      align: "center",
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
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          style={{ color: "#fff", background: "#669800", borderRadius: 4 }}
          onClick={() => handleRowClick(record)} // ✅ open modal with record
        >
          View Details
        </Button>
      ),
    },
  ];

  const handleRowClick = (record) => {
    setSelectedConsumer(record);
    setModalVisible(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Table
          columns={columns}
          dataSource={consumers}
          rowKey="id" // ✅ use API "id" as unique key
          bordered
          pagination={false}
          style={{ cursor: "pointer" }}
        />
      </Card>

      <RooftopModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        consumer={selectedConsumer}
      />
    </div>
  );
};

export default GeneratorRooftop;
