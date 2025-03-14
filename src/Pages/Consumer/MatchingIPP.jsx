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

  useEffect(() => {
    // const requirementId = location.state?.selectedRequirement?.id;
    const requirementId = localStorage.getItem('selectedRequirementId');
    if (requirementId) {
      dispatch(fetchMatchingIPPById(requirementId));
    } else {
      console.error("Requirement ID not found in location state.");
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
    console.log("hhj");
    
    console.log(record);
    setSelectedRow(id); // Set the selected record, replacing previous selection
    
  };
  
  const handleRowSelect = (record) => {
    console.log('ss',record);
    
    setSelectedRow(record); // Only allow single selection
  }
  // console.log('selectedRow',selectedRow); 
  const handleContinue = () => {
    if (selectedRow) {
      const requirementId = location.state?.selectedRequirement?.id;
      navigate("/consumer/annual-saving", { state: { requirementId } });
    } else {
      message.error('Please select a single matching IPP before continuing.');
    }
  };

  const columns = [
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
    },
      {
         title: "Select",
         key: "select",
         render:(text, record) => (
         <Radio
             checked={selectedRow === record}
             onChange={() => handleRowSelect(record)} 
           />
         ),
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
        <div style={{ position: 'relative' }}>
        <Spin size="large" tip="Loading IPP details..." spinning={true} />
        {/* <Spin size="large" tip="Loading IPP details..." /> */}
        </div>
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
