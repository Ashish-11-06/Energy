import React, { useState, useEffect } from "react";
import { Table, Space, Button, Input, message, Card, Modal } from "antd";
import GenerationModal from "./Modal/GenerationModal";
import generationDataApi from "../../Redux/Admin/api/generationDataApi";
import Notification from "./Notification"; // Import your Notification component

const GenerationData = () => {
  const [searchText, setSearchText] = useState("");
  const [generationModalOpen, setGenerationModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await generationDataApi.getGeneratorList();
      if (response.status === 200) {
        let flatData = [];
        // Fix: Handle paginated API with results containing technology keys
        const results = response.data?.results || response.data;
        if (results && typeof results === "object" && !Array.isArray(results)) {
          Object.entries(results).forEach(([tech, arr]) => {
            if (Array.isArray(arr)) {
              arr.forEach((item) => {
                flatData.push({ ...item, technology: tech });
              });
            }
          });
        } else if (Array.isArray(results)) {
          flatData = results;
        }
        setData(flatData);
      } else {
        message.error("Failed to fetch data");
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      item.site_name?.toLowerCase().includes(lowerSearch) ||
      "" ||
      item.technology?.toLowerCase().includes(lowerSearch) ||
      "" ||
      item.state?.toLowerCase().includes(lowerSearch) ||
      ""
    );
  });

  const handleConsumptionUnitClick = (record) => {
    setSelectedRecord(record);
    setGenerationModalOpen(true);
  };

  const handleGenerationModalClose = () => {
    setGenerationModalOpen(false);
    setSelectedRecord(null);
  };

  const handleNotificationClick = (record) => {
    setSelectedRecord(record);
    setNotificationModalOpen(true);
  };

  const handleNotificationModalClose = () => {
    setNotificationModalOpen(false);
    setSelectedRecord(null);
  };

  const columns = [
    {
      title: "Sr.No.",
      dataIndex: "sr_no",
      key: "sr_no",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Site Name",
      dataIndex: "site_name",
      key: "site_name",
      align: "center",
      render: (_, record) => (
        <p
          type="link"
          onClick={() => handleConsumptionUnitClick(record)}
          style={{ color: "rgb(154, 132, 6)", cursor: "pointer" }}
        >
          {record.site_name}
        </p>
      ),
    },
    { title: "State", dataIndex: "state", key: "state", align: "center" },
    {
      title: "Technology",
      dataIndex: "technology",
      key: "technology",
      align: "center",
    },
    {
      title: "Connectivity",
      dataIndex: "connectivity",
      key: "connectivity",
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleNotificationClick(record)}>
            Send Notification
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Generation Data List</h2>
      <Input
        placeholder="Search by Site Name, State, Technology"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
        style={{ width: 300, marginBottom: 16 }}
      />
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          bordered
          pagination={{ pageSize: 10 }}
          rowKey="id"
          size="small"
          loading={loading}
        />
      </Card>
      <GenerationModal
        open={generationModalOpen}
        onClose={handleGenerationModalClose}
        record={selectedRecord}
      />

      {/* Notification Modal */}
      <Modal
        title={`Send Notification to ${
          selectedRecord?.site_name || "Generator"
        }`}
        open={notificationModalOpen}
        onCancel={handleNotificationModalClose}
        footer={null}
        width={800}
        destroyOnClose
        style={{ top: 20 }}
        bodyStyle={{
          padding: "24px",
          overflowY: "auto",
          maxHeight: "calc(100vh - 160px)",
        }}
      >
        <Notification
          isModal={true} // Explicitly pass as boolean
          preselectedUserType="Generator"
          preselectedUser={selectedRecord?.id}
          onClose={handleNotificationModalClose}
        />
      </Modal>
    </div>
  );
};

export default GenerationData;
