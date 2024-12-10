import React from "react";
import { Modal, Button, Typography, Row, Col, DatePicker, Radio, Select, InputNumber } from "antd";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;

const RequestForQuotationModal = ({ visible, onCancel }) => {
  return (
    <Modal
      title={<Text style={{ color: "#001529", fontSize: "18px" }}>Request for Quotation</Text>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Title level={5} style={{ textAlign: "center", color: "#669800" }}>
        Standard Terms Sheet
      </Title>

      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Typography.Paragraph>
            <strong>Term of PPA:</strong> 20 years
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Paragraph>
            <strong>Lock-in Period:</strong> 10 years
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Paragraph>
            <strong>Commencement of Supply:</strong> 31 August 2024
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Paragraph>
            <strong>Contracted Energy:</strong> 20 million units
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Paragraph>
            <strong>Minimum Supply Obligation:</strong> 18 million units
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Paragraph>
            <strong>Payment Security:</strong> 10 days
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Paragraph>
            <strong>Other Terms (Integer):</strong> 50
          </Typography.Paragraph>
        </Col>
        <Col span={12}>
          <Typography.Paragraph>
            <strong>Payment Security Type:</strong> Bank Guarantee
          </Typography.Paragraph>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Button block style={{ backgroundColor: "#FFFFFF", border: `1px solid #E6E8F1`, color: "#001529", fontSize: "14px" }}>
            Download Other Terms & Conditions
          </Button>
        </Col>
        <Col span={12}>
          <Button block style={{ backgroundColor: "#FFFFFF", border: `1px solid #E6E8F1`, color: "#001529", fontSize: "14px" }}>
            Chat with Expert
          </Button>
        </Col>
      </Row>

      <Row justify="space-between" style={{ marginTop: "20px" }}>
        <Button style={{ backgroundColor: "#FFFFFF", border: `1px solid #E6E8F1`, color: "#669800", fontSize: "14px" }}>
          Counter Offer
        </Button>
        <Button
          type="primary"
          style={{
            backgroundColor: "#669800",
            borderColor: "#669800",
            fontSize: "16px",
            padding: "10px 20px",
          }}
        >
          Send to IPPs
        </Button>
      </Row>
    </Modal>
  );
};

export default RequestForQuotationModal;
