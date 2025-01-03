import React, { useState } from 'react';
import { Typography, Table, Button, Modal, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import UpdateProfileForm from '../../Components/Modals/Registration/UpdateProfileForm';

const { Title, Paragraph } = Typography;

const UpdateProfileDetails = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      type: 'Solar',
      state: 'Karnataka',
      capacity: '50 MW',
      cod: '2023-12-01',
      updated: false,
    },
    {
      key: '2',
      type: 'Wind',
      state: 'Maharashtra',
      capacity: '30 MW',
      cod: '2024-06-15',
      updated: false,
    },
    {
      key: '3',
      type: 'ESS',
      state: 'Rajasthan',
      capacity: '20 MWH',
      cod: '2025-03-10',
      updated: false,
    },
  ]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Table columns
  const columns = [
    {
      title: 'Technology',
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
      title: 'Updated',
      dataIndex: 'updated',
      key: 'updated',
      render: (text) => (text ? 'Yes' : 'No'),
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
      const updatedDataSource = dataSource.map(item => {
        if (item.key === selectedRecord.key) {
          return { ...values, key: item.key, cod: values.cod.format('YYYY-MM-DD'), updated: true };
        }
        return item;
      });
      setDataSource(updatedDataSource);
      setIsModalVisible(false);
      form.resetFields();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const allUpdated = dataSource.every(item => item.updated);

  const handleProceed = () => {
    navigate('/generator/combination');
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Inter, sans-serif" }}>
      <Title level={2} style={{ color: "#669800" }}>Update Profile Details</Title>
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

      {allUpdated && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button type="primary" onClick={handleProceed}>
            Optimize Capacity
          </Button>
        </div>
      )}

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
