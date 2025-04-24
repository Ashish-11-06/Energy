/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Typography, Modal, Form, message, Progress, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import UpdateProfileForm from '../../Components/Modals/Registration/UpdateProfileForm';

import AddPortfolioModal from './Modal/AddPortfolioModal';
import { getAllProjectsById } from '../../Redux/Slices/Generator/portfolioSlice';
import moment from 'moment'; // Import moment
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const GenerationPortfolio = () => {
  const user = JSON.parse(localStorage.getItem('user')).user;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewUserModalVisible, setIsNewUserModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [Structuredprojects, setStructuredProjects] = useState([]); // Ensure default is an empty array
  const [form] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editData, setEditData] = useState(selectedRecord);
  const editModeRef = useRef(false); // Track whether the modal is in edit mode

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const subscribed = JSON.parse(localStorage.getItem('subscriptionPlanValidity'));
  const alreadysubscribed = subscribed?.status;

  const { status, projects } = useSelector((state) => state.portfolio);
  const is_new_user=user.is_new_user;
  // console.log(is_new_user);
  const userDataa= JSON.parse(localStorage.getItem('user'));
  const use=localStorage.getItem('user');
  // console.log('localStorage',use);
  
  // console.log('user',userDataa);
  

  const handleOptimize = () => {
    navigate('/generator/combination-pattern');
  };

  useEffect(() => {
    if (is_new_user) {
      setIsNewUserModalVisible(true); // Show modal for new users
    // localStorage.setItem('user', JSON.stringify({ ...user, user: { ...user.user, is_new_user: false } }));
  //  console.log('res',res);
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser).user;
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
    }
  };

  const showInfoModal = () => {
    setIsNewUserModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditData(record);
    editModeRef.current = true; // Set edit mode to true
    setIsModalVisible(true);
  };

  const handleAddNewPortfolio = () => {
    setEditData(null); // Clear edit data
    editModeRef.current = false; // Set edit mode to false
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsUpdateModalVisible(false);
    form.resetFields();
  };

  if (status === 'idle') {
    dispatch(getAllProjectsById(user.id)); // Fetch projects
  }

  useEffect(() => {
    if (projects.Solar || projects.Wind || projects.ESS) {
      const flatProjects = [
        ...(projects.Solar || []).map((project) => ({ ...project, type: 'Solar' })),
        ...(projects.Wind || []).map((project) => ({ ...project, type: 'Wind' })),
        ...(projects.ESS || []).map((project) => ({ ...project, type: 'ESS' })),
      ];
      setStructuredProjects(flatProjects); // Ensure this is always an array
    } else {
      setStructuredProjects([]); // Fallback to an empty array if no projects exist
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
        if (text === 'ESS') {
          return `${text} MWh`;
        } else {
          return `${text} MW`;
        }
      },
    },
    {
      title: 'Connectivity',
      dataIndex: 'connectivity',
      key: 'connectivity',
    },
    {
      title: 'COD (Commercial Operation Date)',
      dataIndex: 'cod',
      key: 'cod',
      render: (text) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (text, record) => (
        <div>
          {alreadysubscribed ? (
            <Button
              type="primary"
              onClick={() => handleUpdate(record)}
              style={{ width: '120px' }}
            >
              {record.updated ? 'Edit' : 'Update'}
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => handleEdit(record)}
              style={{ width: '120px' }}
            >
              Edit Details
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (alreadysubscribed) {
    columns.splice(columns.length - 1, 0, // Insert before the last column (Action)
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

  const allUpdated = Structuredprojects.every((project) => project.updated);

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
        <h2 >Available Generation Portfolio</h2>

 <Tooltip title="Help">
          <Button
            shape="circle"
            icon={<QuestionCircleOutlined />}
            onClick={showInfoModal}
            style={{ position: 'absolute', top: 100, right: 50, zIndex: 1000 }}
          />
        </Tooltip>
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
          isEditMode={editModeRef.current} // Pass edit mode flag
        />

        <Button
          type="primary"
          style={{ marginTop: '20px' }}
          onClick={handleAddNewPortfolio} // Use the new handler
        >
          Add New Entry +
        </Button>

        <Button
              type="default"
              style={{ marginTop: '20px', float: 'right' }}
              onClick={handleFindConsumer}
            >
              Find Consumer
            </Button>
        {/* {allUpdated ? (
          <Button
            type="primary"
            style={{ marginTop: '20px', float: 'right' }}
            onClick={handleOptimize}
          >
            Optimize
          </Button>
        ) : (
          Structuredprojects.length > 0 && (
            <Button
              type="default"
              style={{ marginTop: '20px', float: 'right' }}
              onClick={handleFindConsumer}
            >
              Find Consumer
            </Button>
          )
        )} */}
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
