import React, { useState } from 'react';
import { Typography, Table, Button, Modal, Form } from 'antd';
import dayjs from 'dayjs';
import UpdateProfileForm from '../../Components/Modals/Registration/UpdateProfileForm';

const { Title, Paragraph } = Typography;

const UpdateProfileDetails = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  // Table columns
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'COD',
      dataIndex: 'cod',
      key: 'cod',
    },
    {
      title: 'Action',
      key: 'action',
      width: 100, // Minimize the width of the Action column
      render: (text, record) => (
        <Button type="primary" onClick={() => handleUpdate(record)} style={{ width: '120px' }}>
          Update Profile
        </Button>
      ),
    },
  ];

  // Table data
  const dataSource = [
    {
      key: '1',
      type: 'Solar',
      state: 'Karnataka',
      capacity: '50 MW',
      cod: '2023-12-01',
    },
    {
      key: '2',
      type: 'Wind',
      state: 'Maharashtra',
      capacity: '30 MW',
      cod: '2024-06-15',
    },
    {
      key: '3',
      type: 'ESS',
      state: 'Rajasthan',
      capacity: '20 MWH',
      cod: '2025-03-10',
    },
  ];

  const handleUpdate = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      ...record,
      cod: dayjs(record.cod), // Ensure the date is in a valid format
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      console.log('Updated values:', values);
      setIsModalVisible(false);
      form.resetFields();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Inter, sans-serif" }}>
      <Title level={2} style={{ color: "#669800" }}>Update Profile Details(underConstruction)</Title>
      <Paragraph>
        This is a page for updating profile details. You can add more content and functionality here as needed.
      </Paragraph>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        style={{ marginTop: "20px" }}
      />

      <Modal
        title="Update Profile"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSave}
        width={600}
      >
        <UpdateProfileForm form={form} />
      </Modal>
    </div>
  );
};

export default UpdateProfileDetails;
