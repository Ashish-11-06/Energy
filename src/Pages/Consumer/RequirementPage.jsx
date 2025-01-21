import React, { useState, useEffect } from 'react';
import { Table, Button, message, Row, Col, Modal, Tooltip,Radio } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { QuestionCircleOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequirements } from '../../Redux/Slices/Consumer/consumerRequirementSlice';
import { addNewRequirement } from '../../Redux/Slices/Consumer/consumerRequirementSlice';

import moment from 'moment';
import RequirementForm from './Modal/RequirenmentForm'; // Import the RequirementForm component

const RequirementsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState(null); // State to hold the selected requirement
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State for info modal
  const [username, setUsername] = useState(''); // State for info modal
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const newUser = location.state?.new_user; // Get new_user from location state
  const dispatch = useDispatch();
  const requirements = useSelector((state) => state.consumerRequirement.requirements || []);

  const getFromLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    // console.log('item', item);
    return item ? JSON.parse(item) : '';
  };

  const setToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Define columns for the table (Remove selection column)
  const columns = [
    {
      title: 'Sr No',
      dataIndex: 'srNo',
      key: 'srNo',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Consumption Unit(Site Name)',
      dataIndex: 'consumption_unit',
      key: 'consumption_unit',
      render: (text) => text || "NA",
    },
    {
      title: 'Industry',
      dataIndex: 'industry',
      key: 'industry',
    },
  
    {
      title: 'Contracted Demand (MW)',
      dataIndex: 'contracted_demand',
      key: 'ContractedDemand',
    },
    {
      title: 'Tarriff Category',
      dataIndex: 'tariff_category',
      key: 'tariffCategory',
    },
    {
      title: 'Voltage Level',
      dataIndex: 'voltage_level',
      key: 'voltageLevel',
    },
    {
      title: 'Procurement Date',
      dataIndex: 'procurement_date',
      key: 'procurement',
      render: (date) => (date ? moment(date).format('DD-MM-YYYY') : ''),
    },
    {
      title: "Select",
      key: "select",
      render: (text, record) => (
        <Radio
          checked={selectedRequirement?.id === record.id} // Ensure only one record is selected
          onChange={() => handleRowSelect(record)} // Pass the entire record
        />
      ),
    },
  ];

  const handleRowSelect = (record) => {
    setSelectedRowKeys([record.key]); // Only allow single selection
    setSelectedRequirement(record); // Store the selected record
    setToLocalStorage('selectedRequirementId', record.id); // Store the selected requirement ID in localStorage
    message.success(`You selected record of state '${record.state}'`);
    // console.log('record', record);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    try {
      console.log('values',values);
      
      // Call the API to add the requirement
      // const response = await consumerrequirementA.addNewRequirement(values);
      // Dispatch the action to update Redux state
      dispatch(addNewRequirement(values));
      setIsModalVisible(false);
      message.success('Requirement added successfully!');
    } catch (error) {
      console.log(error);
      message.error('Failed to add requirement');
      setIsInfoModalVisible(false);
    }
  };

  const handleClearAll = () => {
    setSelectedRowKeys([]); // Clear the selected row when clearing all requirements
    message.success('All requirements have been cleared!');
  };

  const handleContinue = () => {
    if (selectedRequirement) {
      navigate('/consumer/matching-ipp', { state: { selectedRequirement } }); // Pass the selected requirement to the next page
    } else {
      message.error('Please select a single requirement before continuing.');
    }
  };

  useEffect(() => {
    // Fetch username from local storage
    const user = getFromLocalStorage('user');
    if (user && user.user.company_representative) {
      setUsername(user.user.company_representative);
    }

    // Show info modal based on new_user value
    if (newUser) {
      setIsInfoModalVisible(true);
    }

    // Fetch requirements if not present in the state
    if (requirements.length === 0) {
      const id = user.user.id;
      dispatch(fetchRequirements(id));
    }
  }, [dispatch, requirements.length, newUser]);

  const handleInfoModalOk = () => {
    setIsInfoModalVisible(false);
  };

  const showInfoModal = () => {
    setIsInfoModalVisible(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Consumption Unit</h2>

      <Tooltip title="Help">
        <Button
          shape="circle"
          icon={<QuestionCircleOutlined />}
          onClick={showInfoModal}
          style={{ position: 'absolute', top: 120, right: 30 }}
        />
      </Tooltip>

      <Modal
        title="Welcome"
        open={isInfoModalVisible}
        onOk={handleInfoModalOk}
        onCancel={() => setIsInfoModalVisible(false)} // Add onCancel handler
        okText="Got it"
        footer={[
          <Button key="submit" type="primary" onClick={handleInfoModalOk}>
            Got it
          </Button>,
        ]}
      >
        <p>Hi {username},</p>
       
        <p>Welcome to the EXG. Please follow these steps to proceed:</p>
        <ol>
          <li>Add your requirements by clicking the "Add Requirement +" button.</li>
          <li>Fill in the details shown in the form.</li>
          <li>Use the tooltip option for each field for more information.</li>
          <li>You can add multiple requirements (demands).</li>
          <li>To continue, select a requirement and click the "Continue" button.</li>
        </ol>
        <p>Thank you!</p>
      </Modal>

      <Table
        columns={columns}
        dataSource={requirements}
        pagination={false}
        bordered
        // onRow={(record) => ({
        //   onClick: () => handleRowSelect(record), // Make entire row clickable
        // })}
        rowClassName={(record) =>
          selectedRequirement && record.id === selectedRequirement.id ? 'selected-row' : ''
        }
      />

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }} justify="center">
        <Col>
          <Button type="primary" onClick={showModal} style={{ width: 160 }}>
            Add Requirement +
          </Button>
        </Col>
        <Col>
          <Tooltip title={!selectedRequirement ? 'Please select a consumption unit first' : ''}>
            <Button
              type="default"
              onClick={handleContinue}
              style={{ width: 160 }}
              disabled={!selectedRequirement} // Disable "Continue" if no row is selected
            >
              Continue
            </Button>
          </Tooltip>
        </Col>
      </Row>

      {/* Modal for adding new requirement */}
      <RequirementForm
        isVisible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
     
    </div>
  );
};

export default RequirementsPage;