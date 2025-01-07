import React, { useEffect, useState } from 'react';
import { Typography, Table, Button, Modal, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getAllProjectsById } from '../../Redux/Slices/Generator/portfolioSlice';
import UpdateProfileForm from '../../Components/Modals/Registration/UpdateProfileForm';

const { Title, Paragraph } = Typography;

const UpdateProfileDetails = () => {
  const user = (JSON.parse(localStorage.getItem('user'))).user;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [Structuredprojects, setStructuredProjects] = useState([]);  // Local state for flattened projects
  const [form] = Form.useForm();

  // Fetching projects from Redux store
  const { projects, status } = useSelector(state => state.portfolio);

  useEffect(() => {
    const id = user.id; 
    dispatch(getAllProjectsById(id));
  }, [dispatch]);

  useEffect(() => {
    if (projects.Solar || projects.Wind || projects.ESS) {
      const flatProjects = [
        ...(projects.Solar || []).map(project => ({ ...project, type: 'Solar' })),
        ...(projects.Wind || []).map(project => ({ ...project, type: 'Wind' })),
        ...(projects.ESS || []).map(project => ({ ...project, type: 'ESS' }))
      ];
      setStructuredProjects(flatProjects);  // Update local state with flattened data
    }
  }, [projects.Solar, projects.Wind, projects.ESS]);

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
      title: 'Available Capacity',
      dataIndex: 'available_capacity',
      key: 'capacity',
    },
    {
      title: 'COD',
      dataIndex: 'cod',
      key: 'cod',
      render: (text) => dayjs(text).format('YYYY-MM-DD'), // Format the date for display
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
      width: 100,
      render: (text, record) => (
        <Button type="primary" onClick={() => handleUpdate(record)} style={{ width: '120px' }}>
          Update Profile
        </Button>
      ),
    },
  ];

  const handleUpdate = (record) => {
    console.log('Record:', record);
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
    form.validateFields().then((values) => {
      // Update the data in the Structuredprojects array
      const updatedProjects = Structuredprojects.map((item) => {
        if (item.key === selectedRecord.key) {
          return { ...values, key: item.key, cod: values.cod.format('YYYY-MM-DD'), updated: true };
        }
        return item;
      });
      setStructuredProjects(updatedProjects); // Update the state with new data
      setIsModalVisible(false);
      form.resetFields();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const allUpdated = Structuredprojects.every(item => item.updated);

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
        dataSource={Structuredprojects}
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
        <UpdateProfileForm 
        project = {selectedRecord}
        form={form} />
      </Modal>
    </div>
  );
};

export default UpdateProfileDetails;
