import React, { useState } from "react";
import { Modal, Typography, Row, Col, Button, Card } from "antd";
import RequestForQuotationModal from "../../../Components/Modals/RequestForQuotationModal";

const { Title, Text } = Typography;

const IPPModal = ({ visible,reReplacement, ipp, onClose, onRequestForQuotation }) => {
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);

  const showQuotationModal = () => {
    setIsQuotationModalVisible(true);
    onRequestForQuotation();
  };
  const handleQuotationCancel = () => setIsQuotationModalVisible(false);

  return (
    <div>
      {/* Main Project Details Modal */}
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={500}
        centered
        style={{
          borderRadius: "8px",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Row justify="center" align="middle" gutter={[16, 16]}>
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
                {/* <strong>IPP:</strong> {ipp?.ipp} <br />
                <strong>Index:</strong> {ipp?.index} <br />
                <strong>State:</strong> {ipp?.states} <br /> */}
                <strong>Available Capacity:</strong> {ipp?.capacity} <br />
                <strong>Potential RE Replacement:</strong>75
                 {/* {ipp?.replacement} <br /> */}
                 <br />
                <strong>per Unit Cost:</strong> {ipp?.perUnitCost} <br />
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
              onClick={showQuotationModal} // Show Request for Quotation Modal
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
      </Modal>

      {/* Quotation Request Modal */}
      <RequestForQuotationModal
        visible={isQuotationModalVisible}
        onCancel={handleQuotationCancel}
        data={ipp}
        selectedDemandId={ipp?.selectedDemandId}
        type="generator"
      />
    </div>
  );
};

export default IPPModal;