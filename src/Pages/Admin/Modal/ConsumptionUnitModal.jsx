import React from 'react';
import { Modal, Table } from 'antd';

const ConsumptionUnitModal = ({ open, onClose, record }) => {
  if (!record) return null;

  const data = [
    { key: '1', label: 'Consumer ID', value: record.username },
    { key: '2', label: 'Consumption Unit', value: record.consumption_unit },
    { key: '3', label: 'Industry', value: record.industry },
    { key: '4', label: 'Contracted Demand (MW)', value: record.contracted_demand },
    { key: '5', label: 'Tariff Category', value: record.tariff_category },
    { key: '6', label: 'Voltage Level (kV)', value: record.voltage_level },
    { key: '7', label: 'Annual Electricity Consumption (MWh)', value: record.annual_electricity_consumption },
    { key: '8', label: 'Expected Procurement Date', value: record.procurement_date },
    // Add more fields if needed:
    // { key: '9', label: 'Phone', value: record.phone },
    // { key: '10', label: 'City', value: record.city },
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
      title={`Details for Consumption Unit: ${record.consumption_unit}`}
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

export default ConsumptionUnitModal;
