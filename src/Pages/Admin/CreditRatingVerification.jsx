import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  message,
  Input,
  Select,
  Card,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import consumerApi from "../../Redux/Admin/api/consumerApi";
const { TextArea } = Input;
const { Option } = Select;

const CreditRatingVerification = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [action, setAction] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await consumerApi.getCreditRatingList();
      if (response.status === 200 && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]);
        message.error("Failed to fetch data");
      }
    } catch (error) {
      message.error("Failed to fetch data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async () => {
    if (!currentRecord || !action) return;

    // If rejecting, require remarks
    if (action === "rejected" && !remarks.trim()) {
      message.warning("Please provide remarks for rejection");
      return;
    }

    setLoading(true);
    try {
      // Call backend API to update credit rating status
      await consumerApi.updateCreditRatingStatus({
        user_id: currentRecord.user_id,
        credit_rating_status: action === "approved" ? "Approved" : "Rejected",
        remarks: action === "rejected" ? remarks : undefined
      });

      // Update local state for UI feedback
      const updatedData = data.map((item) => {
        if (item.user_id === currentRecord.user_id) {
          return {
            ...item,
            credit_rating_status: action === "approved" ? "Approved" : "Rejected",
            remarks: action === "rejected" ? remarks : item.remarks
          };
        }
        return item;
      });

      setData(updatedData);
      message.success(`Credit rating ${action} successfully`);
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        const lowerSearch = searchText.toLowerCase();
        const matchesSearch =
          (item.username || "").toLowerCase().includes(lowerSearch) ||
          (item.email || "").toLowerCase().includes(lowerSearch);

        const matchesStatus =
          statusFilter === "all" ||
          (item.credit_rating_status &&
            item.credit_rating_status.toLowerCase() === statusFilter.toLowerCase());

        return matchesSearch && matchesStatus;
      })
    : [];

  const columns = [
    {
      title: "User",
      dataIndex: "username",
      key: "username",
      render: (text, record) => (
        <div>
          <div>{record.username || "-"}</div>
          <div style={{ color: "#888", fontSize: 12 }}>{record.email || "-"}</div>
        </div>
      ),
    },
    {
      title: "Credit Rating",
      dataIndex: "credit_rating",
      key: "credit_rating",
      render: (value) => <span style={{ fontWeight: "bold" }}>{value || "-"}</span>,
    },
    {
      title: "Proof",
      dataIndex: "credit_rating_proof",
      key: "credit_rating_proof",
      render: (value) =>
        value ? (
          <a href={value} target="_blank" rel="noopener noreferrer">
            <UploadOutlined /> View Proof
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Status",
      dataIndex: "credit_rating_status",
      key: "credit_rating_status",
      render: (status) => {
        let color = "";
        let icon = null;
        if (status?.toLowerCase() === "approved") {
          color = "green";
          icon = <CheckOutlined />;
        } else if (status?.toLowerCase() === "rejected") {
          color = "red";
          icon = <CloseOutlined />;
        } else {
          color = "orange";
        }
        return (
          <Tag color={color} icon={icon}>
            {status ? status.toUpperCase() : "-"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Tooltip title="View details">
          <EyeOutlined
            style={{
              fontSize: "16px",
              color: "#3b3b3bff",
              cursor: "pointer",
            }}
            onClick={() => {
              setCurrentRecord(record);
              setRemarks("");
              setIsModalVisible(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <h2>Credit Rating Verification</h2>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by user"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300, marginBottom: 16 }}
          />
          <Select
            placeholder="Filter by Status"
            style={{ width: 200 }}
            onChange={(value) => setStatusFilter(value)}
            allowClear
          >
            <Option value="Pending">Pending</Option>
            <Option value="Approved">Approved</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="user_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
      <Modal
        title={`Credit Rating Verification - ${currentRecord?.username || "User"}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="approve"
            type="primary"
            icon={<CheckOutlined />}
            loading={loading}
            onClick={() => {
              setAction("approved");
              handleVerify();
            }}
            disabled={
              !(
                currentRecord?.credit_rating_status === "Pending" ||
                currentRecord?.credit_rating_status === "Rejected"
              )
            }
            style={{
              backgroundColor:
                currentRecord?.credit_rating_status === "Pending" ||
                currentRecord?.credit_rating_status === "Rejected"
                  ? "#669800"
                  : "#f0f0f0",
              borderColor:
                currentRecord?.credit_rating_status === "Pending" ||
                currentRecord?.credit_rating_status === "Rejected"
                  ? "#669800"
                  : "#d9d9d9",
              color:
                currentRecord?.credit_rating_status === "Pending" ||
                currentRecord?.credit_rating_status === "Rejected"
                  ? "#fff"
                  : "#bfbfbf",
              cursor:
                currentRecord?.credit_rating_status === "Pending" ||
                currentRecord?.credit_rating_status === "Rejected"
                  ? "pointer"
                  : "not-allowed"
            }}
          >
            Approve
          </Button>,
          <Button
            key="reject"
            danger
            icon={<CloseOutlined />}
            loading={loading}
            onClick={() => {
              setAction("rejected");
              handleVerify();
            }}
            disabled={
              !(
                currentRecord?.credit_rating_status === "Pending" ||
                currentRecord?.credit_rating_status === "Approved"
              )
            }
            style={{
              backgroundColor:
                currentRecord?.credit_rating_status === "Pending" ||
                currentRecord?.credit_rating_status === "Approved"
                  ? "#669800"
                  : "#f0f0f0",
              borderColor:
                currentRecord?.credit_rating_status === "Pending" ||
                currentRecord?.credit_rating_status === "Approved"
                  ? "#669800"
                  : "#d9d9d9",
              color:
                currentRecord?.credit_rating_status === "Pending" ||
                currentRecord?.credit_rating_status === "Approved"
                  ? "#fff"
                  : "#bfbfbf",
              cursor:
                currentRecord?.credit_rating_status === "Pending" ||
                currentRecord?.credit_rating_status === "Approved"
                  ? "pointer"
                  : "not-allowed"
            }}
          >
            Reject
          </Button>,
        ]}
      >
        {currentRecord && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="User Information">
                <div>
                  <div>
                    <strong>Name:</strong> {currentRecord.username || "-"}
                  </div>
                  <div>
                    <strong>Email:</strong> {currentRecord.email || "-"}
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Credit Rating">
                <div style={{ fontSize: 24, fontWeight: "bold" }}>
                  {currentRecord.credit_rating || "-"}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    currentRecord.credit_rating_status === "Approved"
                      ? "green"
                      : currentRecord.credit_rating_status === "Rejected"
                      ? "red"
                      : "orange"
                  }
                >
                  {currentRecord.credit_rating_status
                    ? currentRecord.credit_rating_status.toUpperCase()
                    : "-"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Proof">
                {currentRecord.credit_rating_proof ? (
                  <a
                    href={currentRecord.credit_rating_proof}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <UploadOutlined /> View Proof
                  </a>
                ) : (
                  "-"
                )}
              </Descriptions.Item>
              {/* Show remarks if rejected */}
              {currentRecord.credit_rating_status === "Rejected" && (
                <Descriptions.Item label="Remarks">
                  {currentRecord.remarks || "-"}
                </Descriptions.Item>
              )}
              {/* Remarks input for rejection */}
              {(currentRecord.credit_rating_status === "Pending" ||
                currentRecord.credit_rating_status === "Approved") && (
                <Descriptions.Item label="Remarks (required for rejection)">
                  <TextArea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter remarks for rejection"
                    disabled={
                      !(
                        currentRecord?.credit_rating_status === "Pending" ||
                        currentRecord?.credit_rating_status === "Approved"
                      )
                    }
                  />
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CreditRatingVerification;