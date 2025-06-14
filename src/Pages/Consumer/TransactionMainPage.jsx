/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Row, Col, Spin, Modal, Tooltip, message, Calendar, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { changeWindowDate, fetchTransactions } from '../../Redux/Slices/Transaction/transactionWindowSlice';
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
  const [consumerDetails,setConsumerDetails]=useState([]);
  const [changeDateRowKey, setChangeDateRowKey] = useState(null);
  const [changeModal, setChangeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeDateWindowCreated, setChangeDateWindowCreated] = useState(null);
  const [changeDateStartTime, setChangeDateStartTime] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openWindow=new Date();
const openWindowTime = moment(openWindow).format('HH:mm:ss');
const isWithinTimeWindow = moment(openWindowTime, 'HH:mm:ss').isBetween(
  moment('10:00:00', 'HH:mm:ss'),
  moment('11:00:00', 'HH:mm:ss'),
  null,
  '[)'
);
// console.log(openWindowTime, isWithinTimeWindow);
const handleChangeDate = (record) => {
  // record.window_created_date and record.start_time are expected to be ISO strings
  setChangeDateRowKey(record.key ?? record.window_id);
  setChangeModal(true);
  setSelectedDate(null);
  setChangeDateWindowCreated(record.window_created_date);
  setChangeDateStartTime(record.start_time);
}

const handleDateChange = (date) => {
  setSelectedDate(date);
};

const handleChangeConfirm = async () => {
  if (!selectedDate) {
    message.warning("Please select a date.");
    return;
  }
  setChangeLoading(true);
  try {
   const res= await dispatch(
      changeWindowDate({
        user_id: userId,
        window_id: Number(changeDateRowKey),
        date: selectedDate.format('YYYY-MM-DD'),
      })
    ).unwrap();
    console.log('res', res);
   console.log('res payload', res?.payload);
   
    if(res?.message) {
      message.success(res?.message || 'Window date changed successfully');
    }
    
    // message.success("Date changed successfully!");
    setChangeModal(false);
    setChangeDateRowKey(null);
    setSelectedDate(null);
    // Optionally refresh transactions
    const response = await dispatch(fetchTransactions(userId)).unwrap();
    setTransactions(response);
  } catch (error) {
    message.error("Failed to change date.");
  }
  setChangeLoading(false);
};

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
    console.log(record);
    const modalContent={
      term_of_ppa:record.t_term_of_ppa,
      lock_in_period:record.t_lock_in_period,
      commencement_of_supply:record.t_commencement_of_supply,
      contracted_energy:record.t_contracted_energy,
      minimum_supply_obligation:record.t_minimum_supply_obligation,
      payment_security_type:record.t_payment_security_type,
      payment_security_day:record.t_payment_security_day,
      offer_tariff:record.offer_tariff,
      tariff_status:record.tariff_status,
      c_optimal_battery_capacity:record.c_optimal_battery_capacity,
      c_optimal_solar_capacity:record.c_optimal_solar_capacity,
      c_optimal_wind_capacity:record.c_optimal_wind_capacity,
    }
    setModalContent(modalContent);
    setIsModalVisible(true);
  }

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

console.log('set transactions', transactions);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await dispatch(fetchTransactions(userId)).unwrap();
        setTransactions(response);
        // console.log(response.c_optimal_battery_capacity);
        
        const extractedData = response.map((item) => ({
          c_optimal_solar_capacity: item.c_optimal_solar_capacity,
          c_optimal_wind_capacity: item.c_optimal_wind_capacity,
          c_optimal_battery_capacity: item.c_optimal_battery_capacity,
        }));
// console.log('consumer',extractedData);

       setConsumerDetails(extractedData);
        // console.log("Transactions fetched successfully:", response);
        if (response.some((transaction) => transaction.tariff_status === "reject")) {
          
          setIsRejected(true);}
      } catch (error) {
        message.error(error)
        // console.error("Error fetching transactions:", error);
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
      title: 'Action',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <>
          <Tooltip
            title={
              record.tariff_status !== 'Active'
                ? 'Transaction Window is closed'
                : 'open transaction window'
            }
          >
            <Button
              type="primary"
              style={{
                backgroundColor:
                  record.tariff_status === 'Active' 
                    ? '#669800'
                    : '#ccc',
                borderColor:
                  record.tariff_status === 'Active' 
                    ? '#669800'
                    : '#ccc',
                width: '150px',
                cursor:
                  record.tariff_status === 'Active' 
                    ? 'pointer'
                    : 'not-allowed',
                color:' #fafafa'
              }}
              onClick={() => {
                // if (
                //   record.tariff_status !== 'Active'
                // )
                //   return; // Prevent navigation if not active or outside time window
                const user = JSON.parse(localStorage.getItem('user')).user;
                const path =
                  user.user_category === 'Generator'
                    ? '/generator/transaction-window'
                    : '/consumer/transaction-window';

                navigate(path, { state: record });
              }}
              disabled={
                record.tariff_status !== 'Active'
              } // Ensure correct condition for enabling/disabling
            >
              Open Window
            </Button>
            {/* <Button onClick={() => {
                // if (
                //   record.tariff_status !== 'Active'
                // )
                //   return; // Prevent navigation if not active or outside time window
                const user = JSON.parse(localStorage.getItem('user')).user;
                const path =
                  user.user_category === 'Generator'
                    ? '/generator/transaction-window'
                    : '/consumer/transaction-window';

                navigate(path, { state: record });
              }}>
              Open window
            </Button> */}
          </Tooltip>
          <br />
          <br />
          <Button
            type="primary"
            style={{
              backgroundColor: '#88B04B',
              borderColor: '#88B04B',
              width: '150px',
            }}
            onClick={() => {
              handleTermSheet(record);
            }}
          >
            View Termsheet
          </Button>
          <br />
          <br />
           <Button
            type="primary"
            style={{
              backgroundColor: '#669800',
              borderColor: '#88B04B',
              width: '150px',
            }}
            onClick={() => {
              handleChangeDate(record);
            }}
          >
            Change Date
          </Button>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "tariff_status",
      key: "tariff_status",
    }
  ];


  return (
    <div style={{ padding: '20px' }}>
      <Row justify="left" style={{ marginBottom: '20px' }}>
        <Col>
          <h2 style={{ textAlign: 'left', color: '#001529' }}>
            Transactions :
          </h2>
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

      <Modal
        title="Change Date"
        open={changeModal}
        onCancel={() => {
          setChangeModal(false);
          setChangeDateRowKey(null);
          setSelectedDate(null);
          setChangeDateWindowCreated(null);
          setChangeDateStartTime(null);
        }}
        footer={[
          <Button
            key="change"
            type="primary"
            loading={changeLoading}
            onClick={handleChangeConfirm}
          >
            Change
          </Button>
        ]}
      >
        <DatePicker
          style={{ width: "100%" }}
          format="DD-MM-YYYY"
          autoFocus
          value={selectedDate}
          onChange={handleDateChange}
          disabledDate={current => {
            if (!changeDateWindowCreated || !changeDateStartTime) return true;
            const created = moment(changeDateWindowCreated, moment.ISO_8601).startOf('day');
            const start = moment(changeDateStartTime, moment.ISO_8601).startOf('day');
            const min = created;
            const max = created.clone().add(15, 'days');
            const today = moment().startOf('day');
            // Disable:
            // - before window_created_date
            // - after window_created_date + 15 days
            // - today and before today (passed dates)
            return (
              current < min ||
              current > max ||
              current <= today
            );
          }}
        />
      </Modal>

      {isRejected && (
        <Row justify="center" style={{ marginTop: 20 }}>
          <Col>
            <Typography.Text type="danger">
              Your transaction has been rejected. Please contact support for more details.
            </Typography.Text>
          </Col>
        </Row>
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