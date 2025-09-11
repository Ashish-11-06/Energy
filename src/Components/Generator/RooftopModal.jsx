import React from "react";
import { Modal, Button, Descriptions } from "antd";

const RooftopModal = ({ visible, onClose, consumer }) => {
  // console.log("RooftopModal consumer data:", consumer);

  return (
    <Modal
      title="Consumer Details"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={600}
    >
      {consumer && (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Consumer ID">
            {consumer.consumer}
          </Descriptions.Item>
          <Descriptions.Item label="Credit Rating">{consumer.credit_rating}</Descriptions.Item>
          <Descriptions.Item label="Industry">{consumer.industry}</Descriptions.Item>
          <Descriptions.Item label="Sub-Industry">{consumer.sub_industry}</Descriptions.Item>
          <Descriptions.Item label="Tarrif Category">{consumer.tariff_category}</Descriptions.Item>
          <Descriptions.Item label="Voltage Level (kV)">{consumer.voltage_level}</Descriptions.Item>
          <Descriptions.Item label="Roof Area (square meters)">{consumer.roof_area} </Descriptions.Item>
          <Descriptions.Item label="State">{consumer.state}</Descriptions.Item>
          <Descriptions.Item label="District">{consumer.district}</Descriptions.Item>
          <Descriptions.Item label="Consumption Unit (Site Name)">{consumer.site_name}</Descriptions.Item>
          <Descriptions.Item label="Required Capacity (kWp)">
            {consumer.offered_capacity || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default RooftopModal;
