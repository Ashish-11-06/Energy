import React, { useState } from 'react';
import { Table } from 'antd';
import RequestForQuotationModal from '../../Components/Modals/RequestForQuotationModal';

const OptimizeCombination = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Static data array
  const data = [
    {
      key: '1',
      srNo: 1,
      combination: 'Combination 1',
      technology: [
        { key: '1.1', name: 'Solar', capacity: '50 MW' },
        { key: '1.2', name: 'Wind', capacity: '30 MW' },
        { key: '1.3', name: 'ESS', capacity: '20 MWh' },
      ],
      totalCapacity: '100 MW',
      perUnitCost: '5.2',
      cod: '02-01-2025',
    },
    {
      key: '2',
      srNo: 2,
      combination: 'Combination 2',
      technology: [
        { key: '2.1', name: 'Solar', capacity: '60 MW' },
        { key: '2.2', name: 'Wind', capacity: '40 MW' },
      ],
      totalCapacity: '100 MW',
      perUnitCost: '4.8',
      cod: '12-01-2025',
    },
    {
      key: '3',
      srNo: 3,
      combination: 'Combination 3',
      technology: [
        { key: '3.1', name: 'Solar', capacity: '60 MW' },
        { key: '3.2', name: 'ESS', capacity: '15 MWh' },
      ],
      totalCapacity: '75 MW',
      perUnitCost: '5.25',
      cod: '22-01-2025',
    },
  ];

  // Columns configuration
  const columns = [
    {
      title: 'Sr No',
      dataIndex: 'srNo',
      key: 'srNo',
    },
    {
      title: 'Combination',
      dataIndex: 'combination',
      key: 'combination',
    },
    {
      title: 'Technology',
      key: 'technology',
      render: (_, record) => record.technology.slice(0, 3).map((tech) => (
        <div key={tech.key}>{`${tech.name} (${tech.capacity})`}</div>
      )),
    },
    {
      title: 'Total Capacity',
      dataIndex: 'totalCapacity',
      key: 'totalCapacity',
    },
    {
      title: 'COD',
      dataIndex: 'cod',
      key: 'cod',
    },
    {
      title: 'Per Unit Cost',
      dataIndex: 'perUnitCost',
      key: 'perUnitCost',
    },
  ];

  // Handle row click
  const handleRowClick = (record) => {
    setSelectedRow(record); // Set the selected row data
    setIsModalVisible(true); // Open the modal
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleQuotationModalCancel = () => {
    // setIsQuotationModalVisible(false);
    setIsModalVisible(false);


  };

  return (
    <div>
      <Table
        dataSource={data}
        columns={columns}
        bordered
        rowKey="key"
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Row click event
        })}
      />
      {isModalVisible && (
        <RequestForQuotationModal
          visible={isModalVisible}
         
          onCancel={handleQuotationModalCancel}
          data={selectedRow} // Pass selected row data to the modal
          type="generator"

        />
      )}
    </div>
  );
};

export default OptimizeCombination;
