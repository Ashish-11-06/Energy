/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Modal, Table } from 'antd';

const GenerationModal = ({ open, onClose, record }) => {
  if (!record) return null;

  const data = [
    { key: '1', label: 'Generation ID', value: record.gen_id },
    { key: '2', label: 'Consumption Unit', value: record.site_name },
    { key: '3', label: 'Available Capacity', value: record.available_capacity },
    { key: '4', label: 'Total install capacity', value: record.total_install_capacity },
    { key: '5', label: 'Capital cost', value: record.capital_cost },
    { key: '6', label: 'Expected tariff', value: record.expected_tariff },
    { key: '7', label: 'Annual generation', value: record.annual_generation },
    { key: '8', label: 'Expected Procurement Date', value: record.expected_date },
  ];

  const columns = [
    {
      title: 'Field',
      dataIndex: 'label',
      key: 'label',
      width: '50%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '50%',
    },
  ];

  return (
    <Modal
      open={open}
      title={`Details for Consumption Unit: ${record.site_name}`}
      onCancel={onClose}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="small"
      />
    </Modal>
  );
};

export default GenerationModal;
