import React, { useState, useEffect } from 'react';
import { Table, Button, Typography, Modal,Form, message, Progress } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import UpdateProfileForm from '../../Components/Modals/Registration/UpdateProfileForm';

import AddPortfolioModal from './Modal/AddPortfolioModal';
import { getAllProjectsById } from '../../Redux/Slices/Generator/portfolioSlice';
import moment from 'moment';  // Import moment
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const GenerationPortfolio = () => {
  const user = (JSON.parse(localStorage.getItem('user'))).user;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewUserModalVisible, setIsNewUserModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [Structuredprojects, setStructuredProjects] = useState([]);  // Local state for flattened projects
  const [form] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
const [editData,setEditData]=useState(selectedRecord);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
const subscribed=JSON.parse(localStorage.getItem('subscriptionPlanValidity'));
const alreadysubscribed=subscribed?.status;

  const { status, projects } = useSelector((state) => state.portfolio);

  useEffect(() => {
    if (location.state?.isNewUser) {
      setIsNewUserModalVisible(true); // Show modal for new users
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = (JSON.parse(storedUser)).user;
      setUserName(user.company_representative || 'User');
    } else {
      setUserName('Guest');
    }
  }, []);

  const handleUpdate = (record) => {
    try {
      setSelectedRecord(record);
      form.setFieldsValue({
        ...record,
        cod: dayjs(record.cod), // Ensure the date is in a valid format
      });
      setIsUpdateModalVisible(true);
    } catch (error) {
      message.error(error);
      // console.log(error);
    }
   
  };

  const handleEdit=(record)=>{

    // console.log(record);
    setEditData(record);
    setIsModalVisible(true);
  }
// console.log(editData);

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsUpdateModalVisible(false);
    form.resetFields();
  };

  // useEffect(() => {
    if (status === 'idle') {
      dispatch(getAllProjectsById(user.id));  // Fetch projects
    }
  // }, [status]);

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

  const columns = [
    {
      title: 'Sr. No',
      key: 'serialNumber',
      render: (text, record, index) => index + 1,
    },
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
      key: 'available_capacity',
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
      title: 'COD (Commercial Operation Date)',
      dataIndex: 'cod',
      key: 'cod',
      render: (text) => moment(text).format('DD-MM-YYYY'),  // Format date to DD-MM-YYYY
    },
       {
          title:'Edit Project',
          key:'edit',
          render:(text,record)=>(
            <Button type="primary" onClick={()=>handleEdit(record)}>Edit</Button>
          )
        }
  ];

  if (alreadysubscribed) {
    columns.push(
      {
        title: 'Portfolio Updated',
        dataIndex: 'updated',
        key: 'updated',
        render: (text) => (
          <div style={{ textAlign: 'center' }}>
            <Progress
            percent={text ? 100 : 50}
            status={text ? 'active' : 50}
            strokeColor={text ? 'green' : 'red'}
          />
            {/* {text ? (
              <CheckCircleOutlined style={{ color: 'green', fontSize: '18px' }} />
            ) : (
              <CloseCircleOutlined style={{ color: 'red', fontSize: '18px' }} />
            )} */}
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
    );
  }

  const handleAddEntry = (newEntry) => {
    // Handle adding new entries by dispatching an action
  };

  const handleFindConsumer = () => {
    navigate('/generator/matching-consumer');
  };

  const handleNewUserModalClose = () => {
    setIsNewUserModalVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 level={2} >
          Available Generation Portfolio
        </h2>

        <Table
          dataSource={Structuredprojects.map((project, index) => ({ ...project, key: index }))}
          columns={columns}
          pagination={false}
          bordered
          loading={status === 'loading'}
        />


        <AddPortfolioModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAdd={handleAddEntry}
          data={editData}
          user={user}
        />

        <Button
          type="primary"
          style={{ marginTop: '20px' }}
          onClick={() => setIsModalVisible(true)}
        >
          Add New Entry +
        </Button>

        {Structuredprojects.length > 0 && (
          <Button
            type="default"
            style={{ marginTop: '20px', float: 'right' }}
            onClick={handleFindConsumer}
          >
            Find Consumer
          </Button>
        )}
      </div>

      <Modal
        title={`Welcome, ${userName}!`}
        open={isNewUserModalVisible}
        onOk={handleNewUserModalClose}
        onCancel={handleNewUserModalClose}
        okText="Got it"
      >
        <p>Here’s how to get started:</p>
        <ol>
          <li>Add a new entry to your generation portfolio.</li>
          <li>Find matching consumers for your portfolio.</li>
          <li>Select a consumer and optimize your best combination for the selected consumer.</li>
          <li>Track your progress in the dashboard.</li>
        </ol>
      </Modal>
           <Modal
              title="Update Profile"
              open={isUpdateModalVisible}
              onCancel={handleCancel}
              width={700}
              okButtonProps={{ style: { display: 'none' } }}
              cancelButtonProps={{ style: { display: 'none' } }}
            >
              <UpdateProfileForm 
          project={selectedRecord}
          form={form} 
          fromPortfolio={true}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default GenerationPortfolio;
