import React, { useState } from "react";
import { Typography, Row, Col, Button, Card } from "antd";
import RequestForQuotationModal from "../../Modals/RequestForQuotationModal";

const { Title, Text } = Typography;

const IppProjectDetails = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  return (
    <div
      style={{
        backgroundColor: "#F5F6FB",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Row justify="center" align="middle" gutter={[16, 16]} style={{ maxWidth: "500px", width: "100%" }}>
        <Col span={24}>
          <Card
            style={{
              backgroundColor: "#FFFFFF",
              color: "#001529",
              borderRadius: "8px",
              padding: "20px",
              border: "1px solid #E6E8F1",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <Title level={5} style={{ color: "#9A8406", marginBottom: "20px" }}>
              IPP Project Details
            </Title>
            <div style={{ borderBottom: "1px solid #E6E8F1", marginBottom: "20px" }} />
            <Text style={{ fontSize: "16px", lineHeight: "1.6" }}>
              <strong>Track:</strong> RE track <br />
              <strong>Index:</strong> INDEX <br />
              <strong>Commission Capacity:</strong> 500 MW <br />
              <strong>Profile:</strong> Basic profile
            </Text>
            <div style={{ borderTop: "1px solid #E6E8F1", margin: "20px 0" }} />
            <Title level={5} style={{ color: "#9A8406", marginBottom: "10px", marginTop: "20px" }}>
              About Project
            </Title>
            <Text style={{ fontSize: "14px", lineHeight: "1.6" }}>
              This IPP project focuses on renewable energy with scalable capacity and sustainable development. The project is aimed at providing reliable and eco-friendly power solutions, paving the way for a greener future.
            </Text>
          </Card>
        </Col>

        <Col span={24} style={{ textAlign: "center" }}>
          <Button
            type="primary"
            onClick={showModal}
            style={{
              backgroundColor: "#669800",
              borderColor: "#669800",
              fontSize: "16px",
              padding: "10px 40px",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "300px",
              margin: "20px auto 0",
            }}
          >
            Request for Quotation
          </Button>
        </Col>
      </Row>

      <RequestForQuotationModal visible={isModalVisible} onCancel={handleCancel} />
    </div>
  );
};

export default IppProjectDetails;
