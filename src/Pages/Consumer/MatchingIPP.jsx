/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, Spin, Alert, Row, Button, Radio, Modal, Tooltip, message } from "antd";
import { fetchMatchingIPPById } from "../../Redux/Slices/Consumer/matchingIPPSlice";
import { QuestionCircleOutlined } from '@ant-design/icons';


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

  useEffect(() => {
    const requirementId = localStorage.getItem('selectedRequirementId');
    if (requirementId) {
      try {
        dispatch(fetchMatchingIPPById(requirementId)).then((res) => {
          // console.log(res.payload.length);
          
          if (res.payload && res.payload.length > 0) {
            setIsMatching(true); 
          } else {
            setIsMatching(false);
          }
          localStorage.setItem('isMatching', isMatching);

        });
      } catch (error) {
        console.log(error);
      }
    } else {
      // console.error("Requirement ID not found in location state.");
    }
  }, [location, dispatch]);

  const handleRowClick = (record) => {
    setSelectedRow(record); // Set selected row when a row is clicked
  };

  const handleInfoModalOk = () => {
    setIsInfoModalVisible(false);
  };
  const showInfoModal = () => {
    setIsInfoModalVisible(true);
  };

  const handleRadioChange = (id) => {
    setSelectedRow(id); // Set the selected record, replacing previous selection
  };
  
  const handleRowSelect = (record) => {
    setSelectedRow(record); // Only allow single selection
  }

  const handleContinue = () => {
    if (selectedRow) {
      const requirementId = location.state?.selectedRequirement?.id;
      navigate("/consumer/annual-saving", { state: { requirementId } });
    } else {
      message.error('Please select a single matching IPP before continuing.');
    }
  };
// console.log(isMatching);

  const columns = [
    {
      title: "Select",
      key: "select",
      render:(text, record) => (
      <Radio
          checked={selectedRow === record}
          onChange={() => handleRowSelect(record)} 
        />
      ),
    } ,
    {
      title: 'Sr. No',
      dataIndex: 'srNo', // or any unique key you prefer for the row
      render: (text, record, index) => index + 1, // This will display the serial number
      
  },
    {
      title: "IPP ID",
      dataIndex: "user__username",
      key: "user__username",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
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
            style={{ position: 'absolute', top: 120, right: 30,zIndex:1000 }}
          />
        </Tooltip>

        <Table
          columns={columns}
          dataSource={Array.isArray(matchingIPP) ? matchingIPP : []}
          rowKey={(record) => record.user || record.id || Math.random()}
          bordered
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleRowClick(record), // Handle row click to set selected row
          })}
          locale={{
            emptyText: "No Matching IPPs found",
          }}
       
          style={{
            marginTop: "5%",
            width: "60%",
            padding: "5px 5px",
          }}
        />
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
            <Button
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
    </main>
  );
};

export default MatchingIPP;
