/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"; 
import { Modal, Button, Row, Col, Card, Typography } from "antd";

const { Text } = Typography;

const CombinationModal = ({ open, onCancel, combinationContent }) => {
  // console.log(combinationContent?.state);
  const user = JSON.parse(localStorage.getItem("user")).user;
  const user_category = user.user_category;
//   console.log(user_category);

  return (
    <Modal
      title="Combination Details"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="close" type="primary" onClick={onCancel}>
          Close
        </Button>,
      ]}
      width={600}
    >
      <Row justify="center" style={{ marginTop: "50px" }}>
        <Col>
          {/* <p level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
            Requirement Details
          </p> */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>Combination</Text>
            </Col>
            <Col span={12}>
              <Text>: {combinationContent?.combination || "NA"}</Text>
            </Col>
            <Col span={12}>
  <Text strong>Solar Capacity (MWh)</Text>
</Col>
<Col span={12}>
  <Text>
    : {combinationContent?.optimal_solar_capacity || "0"} &nbsp;
    {
      Object.entries(combinationContent?.state || {}).find(([key]) =>
        key.startsWith("Solar")
      )?.[1] || " "
    }
  </Text>
</Col>

<Col span={12}>
  <Text strong>Wind Capacity (MWh)</Text>
</Col>
<Col span={12}>
  <Text>
    : {combinationContent?.optimal_wind_capacity || "0"} &nbsp;
    {
      Object.entries(combinationContent?.state || {}).find(([key]) =>
        key.startsWith("Wind")
      )?.[1] || " "
    }
  </Text>
</Col>

            {/* {user_category === "Consumer" ? (
              <> */}
         <Col span={12}>
  <Text strong>Battery Capacity (MWh)</Text>
</Col>
<Col span={12}>
  <Text>
    : {combinationContent?.optimal_battery_capacity || "0"} &nbsp;
    {
      Object.entries(combinationContent?.state || {}).find(([key]) =>
        key.startsWith("ESS")
      )?.[1] || " "
    }
  </Text>
</Col>

            {/* </>
            ) : null} */}
            <Col span={12}>
              <Text strong>Final Cost (INR/MWh)</Text>
            </Col>
            <Col span={12}>
              <Text>: {combinationContent?.final_cost || "NA"}</Text>
            </Col>
            {/* <Col span={12}>
              <Text strong>Tariff Category</Text>
            </Col>
            <Col span={12}>
              <Text>:  {combinationContent?.rq_tariff_category || "NA"}</Text>
            </Col> */}
            <Col span={12}>
              <Text strong>Per Unit Cost (INR/MWh)</Text>
            </Col>
            <Col span={12}>
              <Text>: {combinationContent?.per_unit_cost || "0"}</Text>
            </Col>
            <Col span={12}>
              <Text strong>RE Replacement</Text>
            </Col>
            <Col span={12}>
              <Text>:{combinationContent?.re_replacement|| "A1"}</Text>
            </Col>
            <Col span={12}>
              <Text strong>RE Index</Text>
            </Col>
            <Col span={12}>
              <Text>: {combinationContent?.re_index|| "A1"}</Text>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default CombinationModal;
