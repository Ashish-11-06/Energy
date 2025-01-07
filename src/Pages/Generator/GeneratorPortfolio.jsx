import React, { useState, useEffect } from 'react';
import { Table, Button, Typography, Modal } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AddPortfolioModal from './Modal/AddPortfolioModal';
import { getAllProjectsById } from '../../Redux/Slices/Generator/portfolioSlice';
import moment from 'moment';  // Import moment

const { Title } = Typography;

const GenerationPortfolio = () => {
  const user = (JSON.parse(localStorage.getItem('user'))).user;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewUserModalVisible, setIsNewUserModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [Structuredprojects, setStructuredProjects] = useState([]);  // Local state for flattened projects

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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
      title: 'Available Capacity (MW/MWh)',
      dataIndex: 'available_capacity',
      key: 'available_capacity',
      render: (text) => `${text}`,
    },
    {
      title: 'COD (Commercial Operation Date)',
      dataIndex: 'cod',
      key: 'cod',
      render: (text) => moment(text).format('DD-MM-YYYY'),  // Format date to DD-MM-YYYY
    },
  ];

  const handleAddEntry = (newEntry) => {
    // Handle adding new entries by dispatching an action
  };

  const handleFindConsumer = () => {
    navigate('/generator/matching-consumer');
  };

  const handleNewUserModalClose = () => {
    setIsNewUserModalVisible(false);
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
        <Title level={2} style={{ textAlign: 'center' }}>
          Available Generation Portfolio
        </Title>

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
    </div>
  );
};

export default GenerationPortfolio;
