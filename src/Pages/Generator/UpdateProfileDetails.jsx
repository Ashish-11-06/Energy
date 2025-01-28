import React, { useEffect, useState } from 'react';
import { Typography, Table, Button, Modal, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getAllProjectsById } from '../../Redux/Slices/Generator/portfolioSlice';
import UpdateProfileForm from '../../Components/Modals/Registration/UpdateProfileForm';
// import { render } from 'less';
import { useLocation } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const UpdateProfileDetails = () => {
  const user = (JSON.parse(localStorage.getItem('user'))).user;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [Structuredprojects, setStructuredProjects] = useState([]);  // Local state for flattened projects
  const [form] = Form.useForm();
  const location = useLocation();
  const { selectedConsumer } = location.state || {};
  // Fetching projects from Redux store
  const { projects, status } = useSelector(state => state.portfolio);
  // const location = useLocation();
  const selectedDemandId = location.state?.selectedConsumer;
  
  useEffect(() => {
    console.log('Selected demand:', selectedDemandId);
  }, [selectedDemandId]);
  
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
      render: (text) => {
        // Check if the value is 'ESS' or not and render accordingly
        if (text === 'ESS') {
          return `${text} MWh`;
        } else {
          return `${text} MW`;
        }
      },
    },
    
    {
      title: 'Updated',
      dataIndex: 'updated',
      key: 'updated',
      render: (text) => (
        <div style={{ textAlign: 'center' }}>
       {console.log(`${text}`)
       }
          
          {text ? (
            <CheckCircleOutlined style={{ color: 'green', fontSize: '18px'}} />
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
        text ? (
          <Button type="primary" onClick={() => handleUpdate(record)} style={{ width: '120px' }}>
            Update
          </Button>
        ) : (
          <Button type="primary" onClick={() => handleUpdate(record)} style={{ width: '120px' }}>
            Edit
          </Button>
        )
      ),
    }
    
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

  const allUpdated = Structuredprojects.every(item => item.updated);

  const handleProceed = () => {
    navigate('/generator/combination-pattern', { state: { selectedDemandId } });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Inter, sans-serif" }}>
      <Title level={2} >Look For Additional Details</Title>
      <Paragraph>
      Please Update all profile details of your projects to optimize the capacity.
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
        width={700}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <UpdateProfileForm 
        project = {selectedRecord}
        form={form} 
        onCancel={handleCancel}/>
      </Modal>
    </div>
  );
};

export default UpdateProfileDetails;
