import React from "react";
import { Modal, Button, Descriptions } from "antd";

const RooftopModal = ({ visible, onClose, consumer }) => (
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
        <Descriptions.Item label="Consumer ID">{consumer.consumer_id}</Descriptions.Item>
        <Descriptions.Item label="Industry">{consumer.industry}</Descriptions.Item>
        <Descriptions.Item label="State">{consumer.state}</Descriptions.Item>
        <Descriptions.Item label="Required Capacity">{consumer.required_capacity}</Descriptions.Item>
        <Descriptions.Item label="Name">{consumer.name}</Descriptions.Item>
        <Descriptions.Item label="Address">{consumer.address}</Descriptions.Item>
        <Descriptions.Item label="Contact">{consumer.contact}</Descriptions.Item>
        <Descriptions.Item label="Email">{consumer.email}</Descriptions.Item>
        <Descriptions.Item label="Details">{consumer.details}</Descriptions.Item>
      </Descriptions>
    )}
  </Modal>
);

export default RooftopModal;
