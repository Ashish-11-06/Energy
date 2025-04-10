/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Table, Button, message, Row, Col, Modal, Tooltip, Radio, App, Spin, Skeleton } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { QuestionCircleOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequirements, updateRequirements } from '../../Redux/Slices/Consumer/consumerRequirementSlice';
import { addNewRequirement } from '../../Redux/Slices/Consumer/consumerRequirementSlice';

import moment from 'moment';
import RequirementForm from './Modal/RequirenmentForm'; // Import the RequirementForm component

const RequirementsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState(null); // State to hold the selected requirement
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State for info modal
  const [username, setUsername] = useState(''); // State for info modal
  const [isEdit, setEdit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const newUser = location.state?.new_user; // Get new_user from location state
  const dispatch = useDispatch();
  const requirements = useSelector((state) => state.consumerRequirement.requirements || []);
  const [editData, setEditData] = useState(selectedRequirement);
  const [loading, setLoading] = useState(false);

  const subscriptionPlan = JSON.parse(localStorage.getItem('subscriptionPlanValidity'));
  const userData = JSON.parse(localStorage.getItem('user')).user;
  const is_new_user = userData.is_new_user;
// console.log(userData);
const companyName=userData.company;
  const role = userData.role;
  const getFromLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : '';
  };

  const columns = [
    {
      title: 'Sr No',
      dataIndex: 'srNo',
      key: 'srNo',
      render: (text, record, index) => (
        <span key={record.id || index}>{index + 1}</span>
      ),
    },
    {
      title: "Select",
      key: "select",
      render: (text, record) => (
        <Radio
          checked={selectedRequirement?.id === record.id}
          onChange={() => handleRowSelect(record)}
        />
      ),
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Consumption Unit (Site Name)',
      dataIndex: 'consumption_unit',
      key: 'consumption_unit',
      render: (text, record) => (
        <span key={record.id || `${record.key}-${text}`}>{text || "NA"}</span>
      ),
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
      title: 'Voltage Level (kV)',
      dataIndex: 'voltage_level',
      key: 'voltageLevel',
    },
    {
      title: 'Annual Electricity Consumption (MWh)',
      dataIndex: 'annual_electricity_consumption',
      key: 'annual_electricity_consumption',
    },
    {
      title: 'Expected Procurement Date',
      dataIndex: 'procurement_date',
      key: 'procurement',
      render: (date, record) => (
        <span key={record.id || `${record.key}-${date}`}>
          {date ? moment(date).format('DD-MM-YYYY') : ''}</span>
      ),
    },
    {
      title: 'Edit Consumption Unit',
      key: 'edit',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
      )
    },
  ];

  if (subscriptionPlan?.status === 'active' && role != 'view') {
    const addDetailsColumn = {
      title: "Add Consumption Details",
      key: "addDetails",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleAddDetails(record)}>
          Add
        </Button>
      ),
    };
    columns.push(addDetailsColumn);
  }

  const handleEdit = (record) => {
    const matchingRequirement = requirements.find((item) => item.id === record.id);
    const updatedRecord = {
      ...record,
      subIndustry: matchingRequirement ? matchingRequirement.sub_industry : null,
    };
    setEditData(updatedRecord);
    setEdit(true);
    setIsModalVisible(true);
  };

  const handleAddDetails = (record) => {
    localStorage.setItem('selectedRequirementId', record.id);
    navigate('/consumer/energy-consumption-table');
  };

  const handleRowSelect = (record) => {
    setSelectedRowKeys([record.key]);
    setSelectedRequirement(record);
    const data = {
      user_id: userData.id,
      selected_requirement_id: record.id
    };
    message.success(`You selected record of state '${record.state}'`);
  };

  const showModal = () => {
    setIsModalVisible(true);
    setEdit(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRequirement(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        const res = dispatch(updateRequirements({ updatedData: values }));
        setIsModalVisible(false);
        message.success('Requirement updated successfully!');
      } else {
        const res = dispatch(addNewRequirement(values));
        setIsModalVisible(false);
        message.success('Requirement added successfully!');
      }

    // form.resetFields();
    } catch (error) {
      message.error('Failed to add requirement');
      setIsInfoModalVisible(false);
    }
  };

  const handleClearAll = () => {
    setSelectedRowKeys([]);
    message.success('All requirements have been cleared!');
  };

  const handleContinue = () => {
    if (selectedRequirement) {
      navigate('/consumer/matching-ipp');
      localStorage.setItem('selectedRequirementId', selectedRequirement.id);
    } else {
      message.error('Please select a single requirement before continuing.');
    }
  };

  useEffect(() => {
    const user = getFromLocalStorage('user');
    if (user && user.user.company_representative) {
      setUsername(user.user.company_representative);
    }
    if (is_new_user) {
      setIsInfoModalVisible(true);
    }
    if (requirements.length === 0) {
      setLoading(true);
      const id = user.user.id;
      dispatch(fetchRequirements(id)).finally(() => setLoading(false));
    }
  }, [dispatch, requirements.length, newUser]);

  const handleInfoModalOk = () => {
    setIsInfoModalVisible(false);
  };

  const showInfoModal = () => {
    setIsInfoModalVisible(true);
  };

  return (
    <App>
      <div style={{ padding: 20 }}>
      <h2>{companyName.replace("Private Limited", "").trim()}'s Consumption Unit</h2>

        <Tooltip title="Help">
          <Button
            shape="circle"
            icon={<QuestionCircleOutlined />}
            onClick={showInfoModal}
            style={{ position: 'absolute', top: 80, right: 30, zIndex: 1000 }}
          />
        </Tooltip>

        <Modal
          title="Welcome"
          open={isInfoModalVisible}
          onOk={handleInfoModalOk}
          onCancel={() => setIsInfoModalVisible(false)}
          okText="Got it"
          footer={[
            <Button key="submit" type="primary" onClick={handleInfoModalOk}>
              Got it
            </Button>,
          ]}
        >
          <p>Hi {username},</p>
          <p>Welcome to the EXT. Please follow these steps to proceed:</p>
          <ol>
            <li>Add your requirements by clicking the "Add Requirement +" button.</li>
            <li>Fill in the details shown in the form.</li>
            <li>
              Use the tooltip [
              <Tooltip title="More information about this field">
                <QuestionCircleOutlined />
              </Tooltip>
              ] option for each field for more information.
            </li>
            <li>You can add multiple requirements (demands).</li>
            <li>To continue, select a requirement and click the "Continue" button.</li>
          </ol>
          <p>Thank you!</p>
        </Modal>

        <div>
          {loading ? (
            <div style={{ position: 'relative' }}>
              <Spin
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={Array.isArray(requirements) ? requirements : []} // Ensure dataSource is always an array
              pagination={false}
              bordered
              loading={status === 'loading'}
              rowClassName={(record) =>
                selectedRequirement && record.id === selectedRequirement.id ? 'selected-row' : ''
              }
            />
          )}
        </div>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }} justify="center">
          <Col>
            {role != 'view' ? (
              <Button type="primary" onClick={showModal} style={{ width: 160 }}>
                Add Requirement +
              </Button>
            ) : null}
          </Col>
          <Col>
            <Tooltip title={!selectedRequirement ? 'Please select a consumption unit' : ''}>
              <Button
                type="default"
                onClick={handleContinue}
                style={{ width: 160 }}
                disabled={!selectedRequirement}
              >
                Continue
              </Button>
            </Tooltip>
          </Col>
        </Row>

        <RequirementForm
          open={isModalVisible}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          data={editData}
          isEdit={isEdit}
        />
      </div>
    </App>
  );
};

export default RequirementsPage;