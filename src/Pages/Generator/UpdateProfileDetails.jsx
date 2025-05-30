/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Typography, Table, Button, Modal, Form, Progress } from 'antd';
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
  const [lastUploadedFiles, setLastUploadedFiles] = useState({}); // State to track last uploaded files

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
  title: 'Site Name',
  dataIndex: 'site_name',
  key: 'site_name',
  render: (text) => text ? text : 'NA',
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
      title: 'Profile Updated',
      dataIndex: 'updated',
      key: 'updated',
      render: (text) => {
        const progressValue = text ? 100 : 50;
    
        return (
          <div style={{ textAlign: 'center' }}>
        {/* <p>Updated: {text.toString()}</p> */}
            <Progress
              percent={progressValue}
              status={progressValue === 100 ? 'active' : 50}
              strokeColor={progressValue === 100 ? 'green' : 'red'}
            />
          </div>
        );
      },
    }
,    
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

  const handleErrorCloseModal = () => {
    setIsModalVisible(false);
  };

  const allUpdated = structuredProjects.some(item => item.updated);

  const handleProceed = () => {
    navigate('/generator/combination-pattern', { state: { selectedConsumer } });
  };

  // Update the last uploaded file for a specific project
  const updateLastUploadedFile = (projectId, fileName) => {
    setLastUploadedFiles((prev) => ({
      ...prev,
      [projectId]: fileName,
    }));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Inter, sans-serif" }}>
      <h2>Provide Additional Details</h2>
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
            Optimize Capacity for Consumer Demand
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
          onErrorCloseModal={handleErrorCloseModal}
          lastUploadedFile={lastUploadedFiles[selectedRecord?.id]} // Pass the last uploaded file
          updateLastUploadedFile={updateLastUploadedFile} // Pass the update function
        />
      </Modal>
    </div>
  );
};

export default UpdateProfileDetails;