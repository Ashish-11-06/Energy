// ConsumptionUnitModal.jsx
import React from 'react';
import { Modal, Descriptions } from 'antd';

const ConsumptionUnitModal = ({ open, onClose, record }) => {
  if (!record) return null;

  return (
    <Modal
      open={open}
      title={`Details for Consumption Unit : ${record.site_name}`}
      onCancel={onClose}
      footer={null}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Consumer ID">{record.cid}</Descriptions.Item>
        <Descriptions.Item label="Consumption Unit">{record.site_name}</Descriptions.Item>
        <Descriptions.Item label="Industry">{record.industry}</Descriptions.Item>
        {/* Add more fields as needed */}
        {/* <Descriptions.Item label="Phone">{record.phone}</Descriptions.Item> */}
        {/* <Descriptions.Item label="City">{record.city}</Descriptions.Item> */}
      </Descriptions>
    </Modal>
  );
};

export default ConsumptionUnitModal;
