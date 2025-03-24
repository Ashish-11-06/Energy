import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Row, Col, Spin, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchTransactions } from '../../Redux/Slices/Transaction/transactionWindowSlice';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import CounterOffer from '../../Components/Modals/CounterOffer';
import DemandModal from './Modal/DemandModal';

const { Title } = Typography;

const TransactionMainPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [RequirementContent, setRequirementContent] = useState(null);
  const [isRequirementModalVisible, setIsRequirementModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')).user;
  const userId = user.id;

  const showRequirementModal = (record) => {
    setRequirementContent(record);
    // console.log(RequirementContent);

    setIsRequirementModalVisible(true);
  };
  const handleRequirementModalClose = () => {
    setIsRequirementModalVisible(false);
    setRequirementContent(null);
  };

  const handleTermSheet=(record) => {
    // console.log(record);
    const modalContent={
      term_of_ppa:record.t_term_of_ppa,
      lock_in_period:record.t_lock_in_period,
      commencement_of_supply:record.t_commencement_of_supply,
      contracted_energy:record.t_contracted_energy,
      minimum_supply_obligation:record.t_minimum_supply_obligation,
      payment_security_type:record.t_payment_security_type,
      payment_security_day:record.t_payment_security_day,
      offer_tariff:record.offer_tariff,
    }
    setModalContent(modalContent);
    setIsModalVisible(true);
  }

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await dispatch(fetchTransactions(userId)).unwrap();
        setTransactions(response);
        console.log("Transactions fetched successfully:", response);
        if (response.some((transaction) => transaction.tariff_status === "reject")) {
          setIsRejected(true);}
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [dispatch, userId]);

// console.log(RequirementContent);


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
      render: (text,record) =>
        <Typography.Link onClick={() => showRequirementModal(record)}>
          {/* {console.log(record)} */}
          
          {text}
        </Typography.Link>,
    },
    {
      title: 'Date of Transaction',
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
  {/* <Button 
    type="primary" 
    style={{ backgroundColor: "#669800", borderColor: "#669800", width: "150px" }} 
    onClick={() => {
      const user = JSON.parse(localStorage.getItem("user")).user;
      const path = user.user_category === "Generator"
        ? "/generator/transaction-window"
        : "/consumer/transaction-window";
    
      navigate(path, { state: record });
    }}
  >
  Open Window
  </Button> */}
  <Button 
  type="primary" 
  style={{ 
    backgroundColor: isRejected ? "#ccc" : "#669800", 
    borderColor: isRejected ? "#ccc" : "#669800", 
    width: "150px",
    cursor: isRejected ? "not-allowed" : "pointer"
  }} 
  onClick={() => {
    if (isRejected) return; // Prevent navigation if rejected

    const user = JSON.parse(localStorage.getItem("user")).user;
    const path = user.user_category === "Generator"
      ? "/generator/transaction-window"
      : "/consumer/transaction-window";
  
    navigate(path, { state: record });
  }}
  disabled={isRejected}
>
  Open Window
</Button>

{isRejected && <p style={{ color: "red", marginTop: "10px" }}>You have rejected this window.</p>}

  <br /><br />

  <Button 
    type="primary" 
    style={{ backgroundColor: "#88B04B", borderColor: "#88B04B", width: "150px" }} 
    onClick={() => {
      // console.log('Navigating with state:', record);
      handleTermSheet(record)
    }}
  >
    View Termsheet
  </Button>
  <br /><br />

  {/* <Button 
    type="primary" 
    style={{ backgroundColor: "#A7C957", borderColor: "#A7C957", width: "150px" }} 
    onClick={() => navigate(/consumer/transaction-window/${record.key})}
  >
     View Demand  
  </Button> */}

      </>
      
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    }
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

      {modalContent && (
        <CounterOffer
          visible={isModalVisible}
          data={modalContent}
          onCancel={handleCloseModal}
          fromTransaction={true}
        />
      )}

<DemandModal
        title="Demand Details"
        open={isRequirementModalVisible}
        onCancel={handleRequirementModalClose}
        requirementContent={RequirementContent}
        footer={null}
      />
    </div>
  );
};

export default TransactionMainPage;