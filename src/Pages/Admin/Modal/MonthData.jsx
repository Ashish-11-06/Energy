import React from 'react';
import { Modal, Table, Button } from 'antd';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MonthData = ({ open, onCancel, userData }) => {
  const demandData = userData?.demand_data || [
    { month: 'Jan', monthly_consumption: '10', peak_consumption: '6', off_peak_consumption: '4', bill_amount: '1.2' },
    { month: 'Feb', monthly_consumption: '11', peak_consumption: '7', off_peak_consumption: '4', bill_amount: '1.3' },
    { month: 'Mar', monthly_consumption: '12', peak_consumption: '7.5', off_peak_consumption: '4.5', bill_amount: '1.4' },
    { month: 'Apr', monthly_consumption: '13', peak_consumption: '8', off_peak_consumption: '5', bill_amount: '1.5' },
    { month: 'May', monthly_consumption: '14', peak_consumption: '9', off_peak_consumption: '5', bill_amount: '1.7' },
    { month: 'Jun', monthly_consumption: '15', peak_consumption: '9.5', off_peak_consumption: '5.5', bill_amount: '1.8' },
    { month: 'Jul', monthly_consumption: '16', peak_consumption: '10', off_peak_consumption: '6', bill_amount: '2.0' },
    { month: 'Aug', monthly_consumption: '15.5', peak_consumption: '9.7', off_peak_consumption: '5.8', bill_amount: '1.9' },
    { month: 'Sep', monthly_consumption: '14.5', peak_consumption: '8.5', off_peak_consumption: '6', bill_amount: '1.8' },
    { month: 'Oct', monthly_consumption: '13.5', peak_consumption: '8', off_peak_consumption: '5.5', bill_amount: '1.6' },
    { month: 'Nov', monthly_consumption: '12.5', peak_consumption: '7.2', off_peak_consumption: '5.3', bill_amount: '1.5' },
    { month: 'Dec', monthly_consumption: '11.5', peak_consumption: '6.5', off_peak_consumption: '5', bill_amount: '1.4' },
  ];

  const columns = [
    { title: 'Month', dataIndex: 'month', key: 'month', align: 'center' },
    { title: 'Monthly Consumption (MWh)', dataIndex: 'monthly_consumption', key: 'monthly_consumption', align: 'center' },
    { title: 'Peak Consumption (MWh)', dataIndex: 'peak_consumption', key: 'peak_consumption', align: 'center' },
    { title: 'Off Peak Consumption (MWh)', dataIndex: 'off_peak_consumption', key: 'off_peak_consumption', align: 'center' },
    { title: 'Monthly Bill Amount (INR cr)', dataIndex: 'bill_amount', key: 'bill_amount', align: 'center' },
  ];

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`12 Month Demand Data for ${userData?.site_name}`, 14, 15);

    const tableColumn = [
      'Month',
      'Monthly Consumption (MWh)',
      'Peak Consumption (MWh)',
      'Off Peak Consumption (MWh)',
      'Bill Amount (INR cr)',
    ];

    const tableRows = demandData.map(item => [
      item.month,
      item.monthly_consumption,
      item.peak_consumption,
      item.off_peak_consumption,
      item.bill_amount,
    ]);

    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`${userData?.site_name}_12_Month_Data.pdf`);
  };

  return (
    <Modal
      open={open}
      title={`12 Month Demand Data for: ${userData?.site_name}`}
      onCancel={onCancel}
      footer={null}
      width={900}

    >
     
   <Table
  columns={columns}
  dataSource={demandData}
  rowKey="month"
  pagination={false}
  bordered
  scroll={{ y: 300 }} // 👈 Set fixed height and enable vertical scroll
  size='small'
/>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16,marginTop: 16 }}>
  <Button
    type="primary"
    style={{
      backgroundColor: '#669800',
      borderColor: '#669800'
    }}
    onClick={handleDownloadPDF}
  >
    Download PDF
  </Button>
</div>

    </Modal>
  );
};

export default MonthData;
