/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Modal, Typography, Row, Col, Button, Card, Table } from "antd";
import RequestForQuotationModal from "../../../Components/Modals/RequestForQuotationModal";
import moment from 'moment';
import { CheckCircleFilled, CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

const { Title, Text } = Typography;

const IPPModal = ({ visible, ipp, reIndex,fromConsumer,combination, fromGenerator, onClose, onRequestForQuotation, consumerDetails }) => {
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false);

  // console.log('ippppp',ipp);
  // console.log('consumerrrrrrr',consumerDetails);
  // console.log('combination',combination);
  // console.log('annual_demand_met',ipp?.annual_demand_met);
  // console.log('annual_demand_met',combination?.annual_demand_met);
  

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
{
  key: '6',
  label: 'ISTS Charges (INR/kWh)',
  value: ipp?.ISTS_charges != null ? ipp.ISTS_charges : "N/A"
},
    { key: '7', label: 'State Charges (INR/kWh)', value: ipp?.state_charges || "N/A" },
    { key: '8', label: 'Total Cost (INR/kWh)', value: ipp?.totalCost || "N/A" },
    { key: '9', label: 'COD', value: ipp?.cod ? moment(ipp.cod).format('DD-MM-YYYY') : "N/A" },
    { key: '10', label: 'Connectivity', value: ipp?.connectivity || "N/A" },
    { key: '11', label: 'Total RE Capacity (MW)', value: ipp?.totalCapacity || "N/A" },
    ...(fromConsumer ? [
      { key: '1', label: 'Elite Generator', value: ipp?.elite_generator }
    ]: []) ,
    ...(fromGenerator ? [
      { key: '12', label: 'Consumer ID', value: consumerDetails?.username || "N/A" },
      { key: '13', label: 'Consumer Credit Rating', value: consumerDetails?.credit_rating === null ? "N/A" : consumerDetails?.credit_rating },
{ 
    key: '14', 
    label: 'Banking Available', 
    value: ipp?.banking_available === 1 ? (
      <CheckCircleTwoTone twoToneColor="#669800" />
    ) : (
      <CloseCircleTwoTone twoToneColor="#FF0000" />
    )
  },    ] : [])
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
  
  // console.log('ippp technology',ipp?.technology);
  
const technologyData = ipp?.technology.map((tech, index) => {
  const techNameLower = tech.name.toLowerCase();
  const capacityValue = parseFloat(tech.capacity); // Extract numeric part from "10.53 MW" etc.

  let state = "N/A";
  let siteName = "N/A";

  // For multiple sites stored as objects (e.g., { Solar_1: 'Madhya Pradesh' })
  if (typeof ipp?.states === 'object' && ipp?.states !== null) {
    const matchedKey = Object.keys(ipp.states).find(key =>
      key.toLowerCase().includes(techNameLower)
    );
    state = matchedKey ? ipp.states[matchedKey] : "N/A";
  }

  if (typeof ipp?.site_names === 'object' && ipp?.site_names !== null) {
    const matchedKey = Object.keys(ipp.site_names).find(key =>
      key.toLowerCase().includes(techNameLower)
    );
    siteName = matchedKey ? ipp.site_names[matchedKey] : "N/A";
  }

  // For single site string - only if capacity is non-zero
  if (
    typeof ipp?.states === 'string' &&
    typeof ipp?.site_names === 'string' &&
    capacityValue > 0
  ) {
    state = ipp.states;
    siteName = ipp.site_names;
  }

  return {
    key: index,
    name: tech.name,
    capacity: tech.capacity,
    state,
    site_names: siteName,
  };
});


  // console.log('technology',technologyData);
  
  

  // console.log(ipp?.technology);

  const technologyColumns = [
    { title: 'Technology', dataIndex: 'name', key: 'name' },
    { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
    { title: 'State', dataIndex: 'state', key: 'state' },
    // { title: 'Site Name', dataIndex: 'site_names', key: 'site_names',}
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
          {item.label === "Elite Generator" && item.value === 0 ? (
            <>
              <Text>Yes</Text>
              <CheckCircleFilled style={{ color: "#1890ff", marginLeft: 8, fontSize: 18, verticalAlign: "middle" }} />
            </>
          ) : item.label === "Elite Generator" ? (
            <Text>No</Text>
          ) : (
            <Text>{item.value}</Text>
          )}
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

          {/* <Col span={24} style={{ textAlign: "center" }}>
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
          </Col> */}
        </Row>
        </div>
      </Modal>

      <RequestForQuotationModal
        visible={isQuotationModalVisible}
        onCancel={handleQuotationCancel}
        data={ipp}
        fromModal={true}
        selectedDemandId={ipp?.selectedDemandId}
     
      />
    </div>
  );
};

export default IPPModal;