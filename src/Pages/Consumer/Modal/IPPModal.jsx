import React, { useState } from "react";
import { Modal, Typography, Row, Col, Button, Card, Table } from "antd";
import RequestForQuotationModal from "../../../Components/Modals/RequestForQuotationModal";

const { Title, Text } = Typography;

const IPPModal = ({ visible, ipp, combination, reIndex, onClose, onRequestForQuotation }) => {
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);

  const showQuotationModal = () => {
    setIsQuotationModalVisible(true);
    onRequestForQuotation();
  };
  const handleQuotationCancel = () => setIsQuotationModalVisible(false);

  const dataSource = [
    { key: '1', label: 'RE Index', value: reIndex },
    { key: '3', label: 'Potential RE Replacement', value: ipp?.reReplacement },
    { key: '4', label: 'Per Unit Cost (INR/KWh)', value: ipp?.perUnitCost },
    { key: '5', label: 'OA Cost (INR/KWh)', value: ipp?.OACost },
    { key: '6', label: 'Total Cost (INR/KWh)', value: ipp?.totalCost },
  ];

  const columns = [
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const technologyData = Object.keys(combination).map((key, index) => ({
    key: index,
    battery: `Battery Capacity (MW): ${combination[key]["Optimal Battery Capacity (MW)"]} State: ${combination[key].state?.["Battery"] || "N/A"}`,
    solar: `Solar Capacity (MW): ${combination[key]["Optimal Solar Capacity (MW)"]} State: ${combination[key].state?.["Solar"] || "N/A"}`,
    wind: `Wind Capacity (MW): ${combination[key]["Optimal Wind Capacity (MW)"]} State: ${combination[key].state?.["Wind_1"] || "N/A"}`,
  }));

  const technologyColumns = [
    {
      title: 'Battery',
      dataIndex: 'battery',
      key: 'battery',
    },
    {
      title: 'Solar',
      dataIndex: 'solar',
      key: 'solar',
    },
    {
      title: 'Wind',
      dataIndex: 'wind',
      key: 'wind',
    },
  ];

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

              <Row justify="center" gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>RE Index</Text>
                </Col>
                <Col span={12}>
                  <Text>{reIndex}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Potential RE Replacement:</Text>
                </Col>
                <Col span={12}>
                  <Text>{ipp?.reReplacement}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Per Unit Cost (INR/KWh):</Text>
                </Col>
                <Col span={12}>
                  <Text>{ipp?.perUnitCost}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>OA Cost (INR/KWh):</Text>
                </Col>
                <Col span={12}>
                  <Text>{ipp?.OACost}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Total Cost (INR/KWh):</Text>
                </Col>
                <Col span={12}>
                  <Text>{ipp?.totalCost}</Text>
                </Col>
              </Row>

              <div style={{ borderTop: "1px solid #E6E8F1", margin: "20px 0" }} />
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