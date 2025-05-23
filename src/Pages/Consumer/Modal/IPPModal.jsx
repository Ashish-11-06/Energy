/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Modal, Typography, Row, Col, Button, Card, Table } from "antd";
import RequestForQuotationModal from "../../../Components/Modals/RequestForQuotationModal";
import moment from 'moment';

const { Title, Text } = Typography;

const IPPModal = ({ visible, ipp, reIndex,fromConsumer, fromGenerator, onClose, onRequestForQuotation, consumerDetails }) => {
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);

  // console.log('ippppp',ipp);
  console.log('consumer',consumerDetails);
  

  const showQuotationModal = () => {
    setIsQuotationModalVisible(true);
    onRequestForQuotation();
  };
  const handleQuotationCancel = () => setIsQuotationModalVisible(false);


  const dataSource = [
  
    { key: '2', label: 'Annual Contracted Energy (million units)', value: ipp?.annual_demand_met || 0 },
    { key: '3', label: 'Potential RE Replacement (%)', value: ipp?.reReplacement || "N/A" },
    { key: '4', label: 'Per Unit Cost (INR/kWh)', value: ipp?.perUnitCost || "N/A" },
    { key: '5', label: 'OA Cost (INR/kWh)', value: ipp?.OACost || "N/A" },
    { key: '6', label: 'Total Cost (INR/kWh)', value: ipp?.totalCost || "N/A" },
    { key: '7', label: 'COD', value: ipp?.cod ? moment(ipp.cod).format('DD-MM-YYYY') : "N/A" },
    { key: '8', label: 'Connectivity', value: ipp?.connectivity || "N/A" },
    { key: '9', label: 'Total RE Capacity (MW)', value: ipp?.totalCapacity || "N/A" },
    ...(fromConsumer ? [
      { key: '1', label: 'RE Index', value:reIndex || 'N/A'}
    ]: []) ,
    ...(fromGenerator ? [
      { key: '10', label: 'Consumer ID', value: consumerDetails?.username || "N/A" },
      { key: '11', label: 'Consumer Credit Rating', value: consumerDetails?.credit_rating === null ? "N/A" : consumerDetails?.credit_rating },
    ] : [])
  ];

  const mapToBaseType = (value) => {
    if (!value) return null;
    const baseTypes = {
      Solajkjr: ['Solar_1', 'Solar_2', 'Solar_3'],
      Wind: ['Wind_1', 'Wind_2', 'Wind_3'],
      ESS: ['ESS_1', 'ESS_2', 'ESS_3'],
    };
    return Object.keys(baseTypes).find((key) => 
      baseTypes[key].some((item) => item.startsWith(value.split('_')[0]))
    ) || null;
  };

  const getStateForTechnology = (techName) => {
    if (!techName || !ipp?.states) return "N/A";
    
    // Find the first matching state key that starts with the technology name
    const matchingStateKey = Object.keys(ipp.states).find((stateKey) =>
      stateKey.startsWith(techName)
    );
  
    return matchingStateKey ? ipp.states[matchingStateKey] : "N/A";
  };
  
  const technologyData = ipp?.technology.map((tech, index) => ({
    key: index,
    name: tech.name,
    capacity: tech.capacity,
    state: getStateForTechnology(tech.name),
  }));
  

  // console.log(ipp?.technology);

  const technologyColumns = [
    { title: 'Technology', dataIndex: 'name', key: 'name' },
    { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
    { title: 'State', dataIndex: 'state', key: 'state' },
  ];

  return (
    <div>
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
        
        centered
        style={{ borderRadius: "1px", fontFamily: "'Inter', sans-serif" }}
      >
              <div style={{ maxHeight: '70vh', overflowY: 'auto' ,padding:'10px'}}>
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

              <Row justify="center">
  {dataSource.map(item => (
    <Col key={item.key} span={24}>
      <Row align="middle" justify="center">
        {/* Common vertical alignment for labels */}
        <Col span={12} style={{ textAlign: 'left',marginBottom:'10px' }}>
          <Text strong>{item.label}</Text>
        </Col>

        {/* Colon centered */}
        <Col span={2} style={{ textAlign: 'center',marginBottom:'10px' }}>
          <Text>:</Text>
        </Col>

        {/* Values start from the same vertical position */}
        <Col span={10} style={{ textAlign: 'left',marginBottom:'10px' }}>
          <Text>{item.value}</Text>
        </Col>
      </Row>
    </Col>
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
              />
            </Card>
          </Col>

          <Col span={24} style={{ textAlign: "center" }}>
            <Button
              type="primary"
              onClick={showQuotationModal}
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
              Send Quotation
            </Button>
          </Col>
        </Row>
        </div>
      </Modal>

      <RequestForQuotationModal
        visible={isQuotationModalVisible}
        onCancel={handleQuotationCancel}
        data={ipp}
        fromModal={true}
        selectedDemandId={ipp?.selectedDemandId}
        type="generator"
      />
    </div>
  );
};

export default IPPModal;