/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Modal, Table } from 'antd';

const GenerationModal = ({ open, onClose, record }) => {
  if (!record) return null;

  const data = [
    // { key: '1', label: 'Generation ID', value: record.gen_id },
    { key: '1', label: 'Consumption Unit', value: record.site_name },
    { key: '2', label: 'Available Capacity', value: record.available_capacity },
    { key: '3', label: 'Total install capacity', value: record.total_install_capacity },
    // { key: '4', label: 'Capital cost', value: record.capital_cost },
    // { key: '5', label: 'Expected tariff', value: record.expected_tariff },
    { key: '4', label: 'Annual generation', value: record.annual_generation_potential },
    { key: '5', label: 'Expected Procurement Date', value: record.cod },
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
      title={`Details for Project: ${record.site_name}`}
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
