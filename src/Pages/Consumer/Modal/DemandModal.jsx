import React from "react";
import { Modal, Button, Row, Col, Card, Typography } from "antd";

const { Text } = Typography;

const DemandModal = ({ open, onCancel, requirementContent }) => {
  // console.log(requirementContent);

  const user = JSON.parse(localStorage.getItem("user")).user;
  const user_category = user.user_category;
// console.log(user_category);
// console.log(requirementContent);

  return (
    <Modal
      title="Requirement Details"
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
        <Col >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>Contracted Demand (MW)</Text>
            </Col>
            <Col span={12}>
              <Text>:  {requirementContent?.rq_contracted_demand || requirementContent?.contracted_demand || "NA"}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Industry</Text>
            </Col>
            <Col span={12}>
              <Text>:  {requirementContent?.rq_industry || requirementContent?.consumer_company_name || "NA"}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Procurement Date</Text>
            </Col>
            <Col span={12} >
            <Text>
  :{" "}
  {requirementContent?.rq_procurement_date || requirementContent?.procurement_date
    ? new Date(requirementContent?.rq_procurement_date || requirementContent?.procurement_date)
        .toISOString()
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-")
    : "NA"}
</Text>

   </Col>
            {user_category === "Consumer" ? (
              <>
                <Col span={12}>
                  <Text strong>Site Name</Text>
                </Col>
                <Col span={12}>
                  <Text>:  {requirementContent?.rq_site || requirementContent?.consumption_unit_name || "NA"}</Text>
                </Col>
              </>
            ) : null}
            <Col span={12}>
              <Text strong>State</Text>
            </Col>
            <Col span={12}>
              <Text>:  {requirementContent?.rq_state || requirementContent?.state || "NA"}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Tariff Category</Text>
            </Col>
            <Col span={12}>
              <Text>:  {requirementContent?.rq_tariff_category || requirementContent?.tariff_category || "NA"}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Voltage Level (kV)</Text>
            </Col>
            <Col span={12}>
              <Text>:  {requirementContent?.rq_voltage_level || requirementContent?.connected_voltage || "NA"}</Text>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default DemandModal;
