/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Table, Button, message, Row, Col, Modal, Tooltip,Radio } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { QuestionCircleOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRequirements, updateRequirements } from '../../Redux/Slices/Consumer/consumerRequirementSlice';
import { addNewRequirement } from '../../Redux/Slices/Consumer/consumerRequirementSlice';

import moment from 'moment';
import RequirementForm from './Modal/RequirenmentForm'; // Import the RequirementForm component
import { lastVisitedPage } from '../../Redux/Slices/Consumer/lastVisitedPageSlice';

const RequirementsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState(null); // State to hold the selected requirement
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State for info modal
  const [username, setUsername] = useState(''); // State for info modal
  const [isEdit,setEdit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const newUser = location.state?.new_user; // Get new_user from location state
  const dispatch = useDispatch();
  const requirements = useSelector((state) => state.consumerRequirement.requirements || []);
const [editData,setEditData]=useState(selectedRequirement);

  const subscriptionPlan = JSON.parse(localStorage.getItem('subscriptionPlanValidity'));
  const userData=JSON.parse(localStorage.getItem('user')).user;
  // console.log(userData.is_new_user);
  const is_new_user=userData.is_new_user;
  
  const role=userData.role;
  const getFromLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    // console.log('item', item);
    return item ? JSON.parse(item) : '';
  };

// useEffect(()=>{
//   const data={
//     user_id:userData.id,
//     selectedRequirementId:selectedRequirement?.id
//   }
// const res=dispatch(lastVisitedPage(data));
// console.log(res);

// },[selectedRequirement])
// console.log(selectedRequirement.id);


  // Define columns for the table (Remove selection column)
  const columns = [
    {
      title: 'Sr No',
      dataIndex: 'srNo',
      key: 'srNo',
      render: (text, record, index) => (
        <span key={record.id || index}>{index + 1}</span> // Wrapping in a span with key
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
        <span key={record.id || `${record.key}-${date}`}>{date ? moment(date).format('DD-MM-YYYY') : ''}</span>
      ),
    },
    {
      title:'Edit Consumption Unit',
      key:'edit',
      render:(text,record)=>(
        <Button type="primary" onClick={()=>handleEdit(record)}>Edit</Button>
      )
    }
    ,
    {
      title: "Select",
      key: "select",
      render: (text, record) => (
        <Radio
          checked={selectedRequirement?.id === record.id}
          onChange={() => handleRowSelect(record)} 
        />
      ),
    }
    ,    
  ];
  
  
  // Insert "Add Details" before the "Select" column if subscription is active
  if (subscriptionPlan?.status === 'active' && role!='view') {
    const addDetailsColumn = {
      title: "Add Consumption Details",
      key: "addDetails",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleAddDetails(record)}>
          Add
        </Button>
      ),
    };
  
    // Find the index of "Select" column and insert before it
    const selectColumnIndex = columns.findIndex(col => col.key === "select");
    if (selectColumnIndex !== -1) {
      columns.splice(selectColumnIndex, 0, addDetailsColumn);
    }
  }
  

  const handleEdit=(record)=>{
    // console.log(record);
    setEditData(record);
    setEdit(true);
    setIsModalVisible(true);
  }

  // console.log(editData);
  

const handleAddDetails =(record) => {
  // console.log('clicked');
  
// setSelectedRequirement(record);
  // console.log(selectedRequirement);
  localStorage.setItem('selectedRequirementId',record.id);
 navigate('/consumer/energy-consumption-table');

}

  const handleRowSelect = (record) => {
    setSelectedRowKeys([record.key]); // Only allow single selection
    setSelectedRequirement(record); // Store the selected record 
    const data={
      user_id:userData.id,
      selected_requirement_id:record.id
    }
  const res=dispatch(lastVisitedPage(data));
    message.success(`You selected record of state '${record.state}'`);
    // console.log(selectedRequirement);  
    // localStorage.setItem('selectedRequirementId', JSON.stringify(record.id));
    // console.log('record', record);
  };



  const showModal = () => {
    setIsModalVisible(true);
    setEdit(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRequirement(null); // Reset selected requirement on cancel
  };

  const handleSubmit = async (values) => {
    try {
      // console.log('values',values);
      // const response = await consumerrequirementA.addNewRequirement(values);
     if(isEdit){
      // console.log('user',id);
      
      
      dispatch(updateRequirements({updatedData:values}));
      setIsModalVisible(false);
       message.success('Requirement updated successfully!');
     } else {
       dispatch(addNewRequirement(values));
       setIsModalVisible(false);
       message.success('Requirement added successfully!');
     }
    } catch (error) {
      // console.log(error);
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
      navigate('/consumer/matching-ipp'); // Pass the selected requirement to the next page
      // console.log(selectedRequirement);
      localStorage.setItem('selectedRequirementId',selectedRequirement.id);

    } else {
      message.error('Please select a single requirement before continuing.');
    }
  };

  useEffect(() => {
    // Fetch username from local storage
    const user = getFromLocalStorage('user');
    // console.log(user);
    
    if (user && user.user.company_representative) {
      setUsername(user.user.company_representative);
    }

    // Show info modal based on new_user value
    if (is_new_user) {
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
      <h2 >Consumption Unit</h2>

      <Tooltip title="Help">
        <Button
          shape="circle"
        
          icon={<QuestionCircleOutlined />}
          onClick={showInfoModal}
          style={{ position: 'absolute', top: 80, right: 30,zIndex:1000 }}
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
       
        <p>Welcome to the EXT. Please follow these steps to proceed:</p>
        <ol>
          <li>Add your requirements by clicking the "Add Requirement +" button.</li>
          <li>Fill in the details shown in the form.</li>
          <li>
  Use the tooltip [
  <Tooltip title="More information about this field">
    <QuestionCircleOutlined />
  </Tooltip> 
  ]
  option for each field for more information.
</li>
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
        loading={status === 'loading'}
        // onRow={(record) => ({
        //   onClick: () => handleRowSelect(record), // Make entire row clickable
        // })}
        rowClassName={(record) =>
          selectedRequirement && record.id === selectedRequirement.id ? 'selected-row' : ''
        }
      />

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }} justify="center">
        <Col>
        {role!='view' ?(
          <Button type="primary" onClick={showModal} style={{ width: 160 }}>
            Add Requirement +
          </Button>
        ):null}
        </Col>
        <Col>
          <Tooltip title={!selectedRequirement ? 'Please select a consumption unit' : ''}>
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
        open={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        data={editData}
      />
     
    </div>
  );
};

export default RequirementsPage;