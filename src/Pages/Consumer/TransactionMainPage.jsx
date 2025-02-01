import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Row, Col, Spin, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchTransactions } from '../../Redux/Slices/Transaction/transactionWindowSlice';
import { useDispatch } from 'react-redux';
import moment from 'moment';

const { Title } = Typography;

const TransactionMainPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [RequirementContent, setRequirementContent] = useState(null);
    const [isRequirementModalVisible, setIsRequirementModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')).user;
  const userId = user.id;

  const showRequirementModal = (record) => {
    setRequirementContent(record);
    setIsRequirementModalVisible(true);
  };
  const handleRequirementModalClose = () => {
    setIsRequirementModalVisible(false);
    setRequirementContent(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await dispatch(fetchTransactions(userId)).unwrap();
        setTransactions(response);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [dispatch, userId]);

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "srNo",
      key: "srNo",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Transaction ID',
      dataIndex: 'window_name',
      key: 'window_name',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Contracted Demand (MW)',
      dataIndex: 'rq_contracted_demand',
      key: 'rq_contracted_demand',
      width: 150,
      render: (text) =>
        <Typography.Link onClick={() => showRequirementModal(text)}>
          {text}
        </Typography.Link>,
    },
    {
      title: 'Date',
      dataIndex: 'start_time',
      key: 'date',
      render: (text) => moment(text).format('DD-MM-YYYY'),
      width: 150,
    },
    {
      title: 'Start Time',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (text) => moment(text).format('hh:mm A'),
    },
    {
      title: 'End Time',
      dataIndex: 'end_time',
      key: 'end_time',
      render: (text) => moment(text).format('hh:mm A'),
    },
    {
      title: 'Action (open)',
      key: 'action',
      width: 200,
      render: (_, record) => (
        
        <>
  <Button 
    type="primary" 
    style={{ backgroundColor: "#669800", borderColor: "#669800", width: "150px" }} 
    onClick={() => {
      console.log('Navigating with state:', record);
      navigate(`/consumer/transaction-window`, { state: record     });
    }}
  >
  Open Window
  </Button>
  <br /><br />

  <Button 
    type="primary" 
    style={{ backgroundColor: "#88B04B", borderColor: "#88B04B", width: "150px" }} 
    onClick={() => navigate(`/consumer/transaction-window/${record.key}`)}
  >
    View Termsheet
  </Button>
  <br /><br />

  <Button 
    type="primary" 
    style={{ backgroundColor: "#A7C957", borderColor: "#A7C957", width: "150px" }} 
    onClick={() => navigate(`/consumer/transaction-window/${record.key}`)}
  >
     View Demand  
  </Button>

      </>
      
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row justify="left" style={{ marginBottom: '20px' }}>
        <Col>
          <Title level={3} style={{ textAlign: 'left', color: '#001529' }}>
            Transactions :
          </Title>
        </Col>
      </Row>

      {loading ? (
        <Row justify="center" style={{ marginTop: 50 }}>
          <Spin size="large" />
        </Row>
      ) : (
        <Table
          dataSource={transactions}
          columns={columns}
          bordered
          // size='small' 
          pagination={false}
          loading={loading}
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "95%",
            margin: "0 auto",
          }}
        />
      )}
       <Modal
        title="Demand Details"
        open={isRequirementModalVisible}
        onCancel={handleRequirementModalClose}
        footer={null}
      >
        {RequirementContent && (
          <div>
            <p><strong>Demand ID:</strong> {RequirementContent.rq_id}</p>
            <p><strong>Industry:</strong> {RequirementContent.rq_industry}</p><p>
  <strong>Procurement Date:</strong>{" "}
  {moment(RequirementContent.rq_procurement_date).format("DD-MM-YYYY")}
</p>
            <p><strong>Site Name:</strong> {RequirementContent.rq_site}</p>
            <p><strong>State:</strong> {RequirementContent.rq_state}</p>
            <p><strong>Tarrif Category:</strong> {RequirementContent.rq_tariff_category}</p>
            <p><strong>Voltage Level:</strong> {RequirementContent.rq_voltage_level}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransactionMainPage;
