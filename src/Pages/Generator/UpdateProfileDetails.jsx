import React, { useEffect, useState } from 'react';
import { Typography, Table, Button, Modal, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getAllProjectsById } from '../../Redux/Slices/Generator/portfolioSlice';
import UpdateProfileForm from '../../Components/Modals/Registration/UpdateProfileForm';
import { useLocation } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const UpdateProfileDetails = () => {
  const user = JSON.parse(localStorage.getItem('user')).user;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [structuredProjects, setStructuredProjects] = useState([]);  // Local state for flattened projects
  const [form] = Form.useForm();
  const [refreshData, setRefreshData] = useState(false); // State to trigger data refresh
  const location = useLocation();
  const { projects } = useSelector(state => state.portfolio);
  const selectedConsumer = localStorage.getItem('matchingConsumerId');

  useEffect(() => {
    const id = user.id; 
    dispatch(getAllProjectsById(id));
  }, [dispatch, user.id, refreshData]); // Add refreshData to the dependency array

  useEffect(() => {
    if (projects.Solar || projects.Wind || projects.ESS) {
      const flatProjects = [
        ...(projects.Solar || []).map(project => ({ ...project, type: 'Solar', key: project.id })),
        ...(projects.Wind || []).map(project => ({ ...project, type: 'Wind', key: project.id })),
        ...(projects.ESS || []).map(project => ({ ...project, type: 'ESS', key: project.id }))
      ];
      setStructuredProjects(flatProjects);  // Update local state with flattened data
    }
  }, [projects.Solar, projects.Wind, projects.ESS]);

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
      render: (text) => {
        return text === 'ESS' ? `${text} MWh` : `${text} MW`;
      },
    },
    {
      title: 'Updated',
      dataIndex: 'updated',
      key: 'updated',
      render: (text) => (
        <div style={{ textAlign: 'center' }}>
          {text ? (
            <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red', fontSize: '18px' }} />
          )}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => handleUpdate(record)}
            style={{ width: '120px' }}
          >
            {record.updated ? 'Edit' : 'Update'}
          </Button>
        </div>
      ),
    }
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
    setRefreshData(prev => !prev); // Toggle refreshData to trigger useEffect
  };

  const allUpdated = structuredProjects.every(item => item.updated);

  const handleProceed = () => {
    navigate('/generator/combination-pattern', { state: { selectedConsumer } });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Inter, sans-serif" }}>
      <h2>Look For Additional Details</h2>
      <Paragraph>
        (Please Update all profile details of your projects to optimize the capacity.)
      </Paragraph>
      <Table
        columns={columns}
        dataSource={structuredProjects}
        pagination={false}
        bordered
        rowKey="key" // Use the unique key for each row
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
        width={700}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <UpdateProfileForm 
          project={selectedRecord}
          form={form} 
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default UpdateProfileDetails;