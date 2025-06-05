import React from "react";
import { Modal, Form, Input, InputNumber, Button, Select, Typography, Row, Col, DatePicker, Radio } from "antd";
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
      <Form layout="vertical" style={{ marginTop: "20px" }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item label="Term of PPA">
              <Input placeholder="e.g., 20 years" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Lock-in Period">
              <Input placeholder="e.g., 10 years" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Commencement of Supply">
              <DatePicker 
                placeholder="e.g., 31 August 2024" 
                format="DD MMMM YYYY" 
                style={{ width: "100%" }} 
                defaultValue={moment()} 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Contracted Energy">
              <Input placeholder="e.g., 20 million units" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Minimum Supply Obligation">
              <Input placeholder="e.g., 18 million units" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Payment Security">
              <Select placeholder="Select payment security">
                <Option value="10">10 days</Option>
                <Option value="20">20 days</Option>
                <Option value="30">30 days</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Other Terms (Integer)">
              <InputNumber 
                min={1} 
                placeholder="Enter an integer" 
                style={{ width: "100%" }} 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Select Payment Security Type">
              <Radio.Group>
                <Radio value="bankGuarantee">Bank Guarantee</Radio>
                <Radio value="letterOfCredit">Letter of Credit</Radio>
                                <Option value="None">None</Option>

              </Radio.Group>
            </Form.Item>
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
      </Form>
    </Modal>
  );
};

export default RequestForQuotationModal;
