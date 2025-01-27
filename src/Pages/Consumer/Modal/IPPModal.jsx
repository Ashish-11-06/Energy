import React, { useState } from "react";
import { Modal, Typography, Row, Col, Button, Card, Table } from "antd";
import RequestForQuotationModal from "../../../Components/Modals/RequestForQuotationModal";
import moment from 'moment';

const { Title, Text } = Typography;

const IPPModal = ({ visible, ipp, combination, reIndex, onClose, onRequestForQuotation }) => {
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);

  console.log('ipp', ipp);
  
  const showQuotationModal = () => {
    setIsQuotationModalVisible(true);
    onRequestForQuotation();
  };
  const handleQuotationCancel = () => setIsQuotationModalVisible(false);

  const dataSource = [
    { key: '1', label: 'RE Index', value: reIndex },
    { key: '2', label: 'Annual Demand Met', value: ipp?.annual_demand_met },
    { key: '3', label: 'Potential RE Replacement', value: ipp?.reReplacement },
    { key: '4', label: 'Per Unit Cost (INR/KWh)', value: ipp?.perUnitCost },
    { key: '5', label: 'OA Cost (INR/KWh)', value: ipp?.OACost },
    { key: '6', label: 'Total Cost (INR/KWh)', value: ipp?.totalCost },
    { key: '7', label: 'COD', value: ipp?.cod ? moment(ipp.cod).format('DD-MM-YYYY') : '', },
    { key: '8', label: 'Connectivity', value: ipp?.connectivity },
    { key: '9', label: 'Total Capacity (MW)', value: ipp?.totalCapacity },
  ];

const annualDemand=ipp?.annualDemand;
console.log('annual deman',annualDemand);

  const stateMapping = {
    Solar: 'Solar_1',
    Wind: 'Wind_1',
    ESS: 'ESS_1',
  };

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

  const technologyData = ipp?.technology.map((tech, index) => ({
    key: index,
    name: tech.name,
    capacity: tech.capacity,
    state: ipp?.states?.[stateMapping[tech.name]] || "N/A",
  }));

  const technologyColumns = [
    {
      title: 'Technology',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
  ];

  return (
    <div>
      {/* Main Project Details Modal */}
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
        centered
        style={{
          borderRadius: "1px",
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
                padding: "2px",
                border: "1px solid #E6E8F1",
                boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Title level={5} style={{ color: "#9A8406", marginBottom: "5px", textAlign: "center" }}>
                IPP Project Details
              </Title>

              <Row justify="center" gutter={[16, 16]}>
                {dataSource.map(item => (
                  <React.Fragment key={item.key}>
                    <Col span={12}>
                      <Text strong>{item.label}</Text>
                    </Col>
                    <Col span={12}>
                      <Text>: {item.value}</Text>
                    </Col>
                  </React.Fragment>
                ))}
              </Row>

              <div style={{ borderTop: "1px solid #E6E8F1", margin: "20px 0" }} />

              <Title level={5} style={{ color: "#9A8406", marginBottom: "5px", textAlign: "center" }}>
                Technologies
              </Title>
              <Table
                dataSource={technologyData}
                columns={technologyColumns}
                pagination={false}
                bordered
                size="small"
                // style={{ marginBottom: "2px" }}
              />
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
                padding: "2px 2px",
                borderRadius: "8px",
                width: "100%",
                maxWidth: "300px",
                margin: "2px auto 0",
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