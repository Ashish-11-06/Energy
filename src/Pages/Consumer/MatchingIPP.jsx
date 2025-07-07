/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, Spin, Alert, Row, Button, Radio, Modal, Tooltip, message, Select, Typography, Col } from "antd";
import { fetchMatchingIPPById } from "../../Redux/Slices/Consumer/matchingIPPSlice";
import { CheckCircleTwoTone, CloseCircleTwoTone, QuestionCircleOutlined } from '@ant-design/icons';
import { fetchRequirements } from "../../Redux/Slices/Consumer/consumerRequirementSlice";

const MatchingIPP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedRow, setSelectedRow] = useState(null); // Ensure only one selection
  const { matchingIPP, status, error } = useSelector(
    (state) => state.matchingIPP
  );
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State for info modal
  const [isMatching, setIsMatching] = useState(false); // Add state for isMatching
  const requirements = useSelector((state) => state.consumerRequirement.requirements || []);
  const [selectedRequirement, setSelectedRequirement] = useState(null); // State for selected requirement
  const [showIPPModal, setShowIPPModal] = useState(false); // State for showing IPP modal
  const [solarArray, setSolarArray] = useState([]);
  const [windArray, setWindArray] = useState([]);
  const [essArray, setEssArray] = useState([]);
const selectedRequirements = location.state?.selectedRequirements || [];
  const selectedRequirementId = location.state?.selectedRequirement?.id || null; // Get selected requirement ID from location state
  const requirementId = localStorage.getItem('selectedRequirementId');

  const getFromLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : '';
  };
  const userData = JSON.parse(localStorage.getItem('user')).user;
// console.log("User Data:", userData);
const role=userData?.role;

  // console.log("Matching IPP data:", matchingIPP);
  // if(matchingIPP.message) {
  //   message.error(matchingIPP.message);
  // }


  useEffect(() => {
    const storedRequirement = JSON.parse(localStorage.getItem('selectedRequirement'));
    if (storedRequirement) {
      setSelectedRequirement(storedRequirement); // Set the selected requirement from localStorage
    } else if (requirements.length > 0) {
      setSelectedRequirement(requirements[0]); // Fallback to the first requirement
    }
  }, [requirements]);

  useEffect(() => {
    const fetchMatchingIpp = async () => {
    if (requirementId) {
      try {
       const res=await dispatch(fetchMatchingIPPById(requirementId)).then((res) => {
        // console.log(res);
        
          if (res.payload && res.payload.length > 0) {
            setIsMatching(true); 
          } else {
            setIsMatching(false);
            message.warning(res.payload.message, 10);
          }
          localStorage.setItem('isMatching', isMatching);
        });
      } catch (error) {
        // console.log(error);
      }
    }
  }
    fetchMatchingIpp();
  }, [location, dispatch]);

  useEffect(() => {
    const selectedRequirementId = selectedRequirement?.id;
    localStorage.setItem('selectedRequirementId', selectedRequirementId);
  }, [selectedRequirement]);

  const handleRequirementChange = (value) => {
    const selected = requirements.find((req) => req.id === value);
    setSelectedRequirement(selected);
    localStorage.setItem('selectedRequirementId', selected.id); // Update localStorage
    dispatch(fetchMatchingIPPById(selected.id)); // Fetch matching IPPs for the selected requirement
  };

  const handleRadioChange = (record) => {
    setSelectedRow(record); // Set the selected record when radio button is clicked
    localStorage.setItem('matchingIPP', record.user__username); // Store the selected IPP ID in local storage
  };

  useEffect(() => {
    if (requirements.length === 0) {
    const user = getFromLocalStorage('user');
      if(requirementId === null ) {
        const id = user.user.id;
        dispatch(fetchRequirements(id));
      } 
    } else {
      // message.error('Please select requirement Id first!')
    }
  }, [dispatch, requirements.length]);

  const handleInfoModalOk = () => {
    setIsInfoModalVisible(false);
  };
  const showInfoModal = () => {
    setIsInfoModalVisible(true);
  };

  const handleContinue = () => {
    const subscriptionPlanValidity = getFromLocalStorage('subscriptionPlanValidity');
    const matchingIPP = localStorage.getItem('matchingIPP');
    const selectedRequirementId = localStorage.getItem('selectedRequirementId');
  
    if(role !== 'View') {
      if (selectedRequirementId && matchingIPP && subscriptionPlanValidity?.status === 'active') {
        navigate("/consumer/energy-consumption-table", { state: { requirementId: selectedRequirementId } });
      } else if (selectedRow) {
        const requirementId = location.state?.selectedRequirement?.id;
        navigate("/consumer/annual-saving", { state: { requirementId } });
      }
    } else if(role === 'View' && selectedRequirementId && matchingIPP && subscriptionPlanValidity?.status === 'active') {
     navigate("/consumer/consumption-pattern", { state: { requirementId: selectedRequirementId } });
    }
     else {
      message.error('Please select a single matching IPP before continuing.');
    }
  };

  const handleIPPClick = (record) => {
    setShowIPPModal(true);
    const { solar, wind, ess } = record;
    console.log('record',record);
    
    setSolarArray(solar || []); // Update solarArray with the selected IPP's solar data
    setWindArray(wind || []);  // Update windArray with the selected IPP's wind data
    setEssArray(ess || []);    // Update essArray with the selected IPP's ESS data
  };

  const columns = [
    {
      title: "Select",
      key: "select",
      render: (text, record) => (
        <Radio
          checked={selectedRow === record}
          onChange={() => handleRadioChange(record)} // Use radio button click for selection
        />
      ),
    },
    {
      title: 'Sr. No',
      dataIndex: 'srNo', // or any unique key you prefer for the row
      render: (text, record, index) => index + 1, // This will display the serial number
    },
    {
      title: "IPP ID",
      dataIndex: "user__username",
      key: "user__username",
      render: (text, record) => (
        <Typography.Link onClick={() => handleIPPClick(record)}>
          {text}
        </Typography.Link>
      ),
    },
    // {
    //   title: "State",
    //   dataIndex: "state",
    //   key: "state",
    // },

    {
      title: "Total Install Capacity (MW)",
      dataIndex: "installed_capacity",
      key: "installed_capacity",
    },
    {
      title: "Total Available Capacity (MW)",
      dataIndex: "available_capacity",
      key: "available_capacity",
    }
  ];

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Loading" spinning={true}>
          <div /> {/* Add an empty div to ensure proper nesting */}
        </Spin>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >    
      <Row style={{ width: "100%" }}>
        <h2>Matching IPP Details</h2>
        <Tooltip title="Help">
          <Button
            shape="circle"
            icon={<QuestionCircleOutlined />}
            onClick={showInfoModal}
            style={{ position: 'absolute', top: 120, right: 30, zIndex: 1000 }}
          />
        </Tooltip>
        <Row
          style={{
            width: "100%",
            marginTop: "20px",
            display: "flex",
            flexWrap: "wrap", // Allow wrapping for smaller screens
            alignItems: "center",
            gap: "10px",
          }}
        >
            <p style={{ margin: 0, whiteSpace: "nowrap" }}>Select Requirement</p>
          <Col xs={24} sm={8} md={6} lg={4} style={{ textAlign: "center" }}>
          </Col>
          <Col xs={24} sm={16} md={18} lg={20}>
            <Select
            style={{ width: '100%' }}
            value={selectedRequirement?.id}
            onChange={handleRequirementChange}
            options={
              Array.isArray(requirements)
                ? requirements.map((req) => ({
                    label: (
                      <span>
                        <strong>State:</strong> {req.state},{' '}
                        <strong>Consumption unit:</strong> {req.consumption_unit},{' '}
                        <strong>Industry:</strong> {req.industry},{' '}
                        <strong>Contracted demand:</strong> {req.contracted_demand} MW,{` `}
                        <strong>Tariff Category:</strong> {req.tariff_category},{' '}
                        <strong>Voltage:</strong> {req.voltage_level} kV,{` `}
                        <strong>Annual Consumption:</strong> {req.annual_electricity_consumption} MWh,{` `}
                        <strong>Procurement Date:</strong> {req.procurement_date}
                      </span>
                    ),
                    value: req.id,
                  }))
                : []
            }
          />
          </Col>
        </Row>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <Table
            columns={columns}
            dataSource={Array.isArray(matchingIPP) ? matchingIPP : []}
            rowKey={(record) => record.user || record.id || Math.random()}
            bordered
            pagination={false}
            locale={{
              emptyText: "No Matching IPPs found",
            }}
            style={{
              marginTop: "5%",
              width: "80%",
              padding: "5px 5px",
            }}
          />
        </div>
      </Row>
      <Row
        style={{
          width: "100%",
          marginTop: "20px",
          justifyContent: "center",
        }}
      >
        <Tooltip title={!selectedRow ? 'Please select a matching IPP' : ''} placement="top">
          <div>
           { <Button
              type="primary"
              onClick={handleContinue}
              disabled={!selectedRow} // Disable button until a row is selected
              style={{
                pointerEvents: selectedRow ? "auto" : "none",
                opacity: selectedRow ? 1 : 0.5,
                cursor: selectedRow ? "pointer" : "not-allowed",
              }}
            >
              Continue
            </Button>
}
          </div>
        </Tooltip>
      </Row>
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
        <p></p>
        <p>This is a general estimate of the matched IPPs. To achieve better results, please provide more details.</p>
      </Modal>
      <Modal
        title="IPP Details"
        open={showIPPModal}
        onCancel={() => setShowIPPModal(false)}
        footer={null}
        width={800}
      >
        <Table
      dataSource={[
  ...solarArray.map(item => ({ ...item, technology: "Solar", banking_available: item.banking_available })),
  ...windArray.map(item => ({ ...item, technology: "Wind", banking_available: item.banking_available ?? false })),
  ...essArray.map(item => ({ ...item, technology: "ESS", banking_available: item.banking_available ?? false })),
]}


          columns={[
            { title: "Technology", dataIndex: "technology", key: "technology" },
            { title: "State", dataIndex: "state", key: "state" },
            { title: "Connectivity", dataIndex: "connectivity", key: "connectivity" },
            { title: "Available Capacity (MW)", dataIndex: "available_capacity", key: "available_capacity" },
            { title: "Total Installed Capacity (MW)", dataIndex: "total_install_capacity", key: "total_install_capacity" },
{
      title: "Banking Available",
      dataIndex: "banking_available",
      key: "banking_available",
      width: 300,
      align: 'center',
      render: (value) => (
        <div style={{ textAlign: 'center' }}>
          {value === false ? (
            <CloseCircleTwoTone twoToneColor="#FF0000" />
          ) : (
            <CheckCircleTwoTone twoToneColor="#669800" />
          )}
        </div>
      ),
    }
          ]}
          rowKey={(record, index) => index}
          pagination={false}
          locale={{ emptyText: "No Data Available" }}
        />
        <br />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <Button onClick={() => setShowIPPModal(false)}>Close</Button>
</div>

      </Modal>
    </main>
  );
};

export default MatchingIPP;
