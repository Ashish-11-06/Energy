import React, { useState } from "react";
import { Modal, Typography, Row, Col, Button, Card } from "antd";
import RequestForQuotationModal from "../../../Components/Modals/RequestForQuotationModal";

const { Title, Text } = Typography;

const IPPModal = ({ visible, ipp, combination, reIndex, onClose, onRequestForQuotation }) => {
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);

  console.log('date',ipp.greatest_cod  );
ipp.greatest_cod
// console.log(annual_demand_met);

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
              }}
            >
              <Title level={5} style={{ color: "#9A8406", marginBottom: "20px", textAlign: "center" }}>
                IPP Project Details
              </Title>
              <div style={{ borderBottom: "1px solid #E6E8F1", marginBottom: "20px" }} />
              <Text style={{ fontSize: "16px", lineHeight: "1.6" }}>
                <ul>
                <li><strong>RE Index:</strong> {reIndex} <br /></li>
                <li><strong>Available Capacity:</strong> {ipp?.capacity} <br /></li>
                <li><strong>Potential RE Replacement:</strong> {ipp?.reReplacement} <br /></li>
                <li><strong>Per Unit Cost(INR/KWh):</strong> {ipp?.perUnitCost} <br /></li>
                <li> <strong>OA Cost(INR/KWh):</strong>{ipp?.OACost}  <br /></li>
                <li> <strong>Total Cost(INR/KWh):</strong>{ipp?.totalCost}<br /></li>

                <li><strong>Technology:</strong></li>
                
                
                <ol>
                  {Object.keys(combination).map((key, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                      <li>Battery Capacity (MW): {combination[key]["Optimal Battery Capacity (MW)"]}<br></br> State: {combination[key].state?.["Battery"] || "N/A"}</li> 
                      <li>Solar Capacity (MW): {combination[key]["Optimal Solar Capacity (MW)"]}  <br></br> State: {combination[key].state?.["Solar"] || "N/A"}</li>
                      <li>Wind Capacity (MW): {combination[key]["Optimal Wind Capacity (MW)"]} <br></br>State: {combination[key].state?.["Wind_1"] || "N/A"}</li>
                    </div>
                  ))}
                </ol>
                </ul>
              </Text>
              <div style={{ borderTop: "1px solid #E6E8F1", margin: "20px 0" }} />
              {/* <Title level={5} style={{ color: "#9A8406", marginBottom: "10px" }}>
                About Project
              </Title>
              <Text style={{ fontSize: "14px", lineHeight: "1.6" }}>
                This IPP project focuses on renewable energy with scalable capacity and sustainable development. The project is aimed at providing reliable and eco-friendly power solutions, paving the way for a greener future.
              </Text> */}
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