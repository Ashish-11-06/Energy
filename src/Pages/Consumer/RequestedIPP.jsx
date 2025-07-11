/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Col, Row, Typography, Select, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import { getOffers } from '../../Redux/Slices/Consumer/offersSlice';
import { addStatus } from '../../Redux/Slices/Generator/TermsAndConditionsSlice';
import TermSheet from '../../Components/Modals/TermSheet';
import ProgressBar from '../ProgressBar';

const { Title } = Typography;
const { Option } = Select;

const RequestedIPP = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [ippData, setIppData] = useState([]);
  const [error, setError] = useState(null);
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false); // Add this state to control visibility of TermSheet

  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user')).user;



  useEffect(() => {
    const fetchIPPData = async () => {
      try {
        const response = await dispatch(getOffers(user));
        if (response?.payload?.length > 0) {
          setIppData(response.payload);
        } else {
          setIppData([]);
          message.info('No data found');
        }
      } catch (error) {
        setError('Error fetching IPP data');
        message.error('Error fetching IPP data');
      }
    };

    fetchIPPData();
  }, []);

  const showModal = (record) => {
    setModalContent(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCounterOffer = (modalContent) => {
    // Implement the function if needed
    setModalContent(modalContent);
    setIsQuotationModalVisible(true);
  };

  const handleStatusUpdate = async (action) => {
    try {
      const statusData = {
        action: action,
      };
      await dispatch(addStatus({ user_id: user.id, term_id: modalContent.id, statusData }));
      message.success(`Status updated to ${action}`);
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to update status');
    }
  };
  const [progress, setProgress] = useState(20);
  const breakpoints = [
    { value: 20, title: "Step 1" },
    { value: 40, title: "Step 2" },
    { value: 60, title: "Step 3" },
    { value: 80, title: "Step 4" },
    { value: 100, title: "Complete" },
  ];

  // Function to update progress when clicking breakpoints
  const handleProgressChange = (newProgress) => {
    setProgress(newProgress);
  };

  // Function to increase progress using the button
  const handleProgress = () => {
    // console.log("clicked");
    if (progress < 100) {
      setProgress(progress + 20); // Increase progress
    }
  };

  const filteredData = ippData.filter((record) => {
    const statusMatch = statusFilter ? record.consumer_status === statusFilter : true;
    const searchMatch =
      record.id.toString().includes(searchText) ||
      record.requirement[0].rq_state.toLowerCase().includes(searchText.toLowerCase()) ||
      record.requirement[0].rq_industry.toLowerCase().includes(searchText.toLowerCase()) ||
      record.requirement[0].rq_contracted_demand.toString().includes(searchText) ||
      record.requirement[0].rq_tariff_category.toLowerCase().includes(searchText.toLowerCase());
    return statusMatch && searchMatch;
  });

  const columns = [
    {
      title: 'Requirement ID',
      dataIndex: 'id',
      key: 'id',
      width: '100px',
    },
    {
      title: 'State',
      dataIndex: 'requirement',
      key: 'requirement',
      render: (text) => text[0]?.rq_state,
      width: '150px',
    },
    {
      title: 'Industry',
      dataIndex: 'requirement',
      key: 'industry',
      render: (text) => text[0]?.rq_industry,
      width: '150px',
    },
    {
      title: 'Site Name',
      dataIndex: 'site',
      key: 'site',
      width: '100px',
    },
    {
      title: 'Contracted Demand',
      dataIndex: 'requirement',
      key: 'contractedDemand',
      render: (text) => text[0]?.rq_contracted_demand,
      width: '150px',
    },
    {
      title: 'Tariff Category',
      dataIndex: 'requirement',
      key: 'tariffCategory',
      render: (text) => text[0]?.rq_tariff_category,
      width: '150px',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Button type="primary" onClick={() => showModal(record)}>
          View Status
        </Button>
      ),
      width: '150px',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
       <div>
      <ProgressBar
        progress={progress}
        breakpoints={breakpoints}
        onProgressChange={handleProgressChange}
      />
      <button onClick={handleProgress}>Increase Progress</button>
    </div>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Title level={3} style={{ color: '#001529' }}>
          Your Requested IPPs
        </Title>
      </Col>

      <Row gutter={16} style={{ marginBottom: '20px', justifyContent: 'center' }}>
        <Col style={{ marginRight: '40%' }}>
          <Input
            placeholder="Search"
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: 200 }}
          />
        </Col>
        <Col>
          <Select
            placeholder="Filter by Status"
            onChange={handleStatusChange}
            style={{ width: 200 }}
            allowClear
          >
            <Option value="Pending">Pending</Option>
            <Option value="Accepted">Accepted</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
        </Col>
      </Row>

      {error ? (
        <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
      ) : ippData.length === 0 ? (
        <div style={{ textAlign: 'center' }}>No Data Found</div>
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '80%',
            margin: '0 auto',
          }}
        />
      )}

      <Modal
        title="IPP Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {modalContent && (
          <div>
            <p><strong>IPP ID:</strong> {modalContent.id}</p>
            <p><strong>State:</strong> {modalContent.requirement[0].rq_state}</p>
            <p><strong>Industry:</strong> {modalContent.requirement[0].rq_industry}</p>
            <p><strong>Contracted Demand:</strong> {modalContent.requirement[0].rq_contracted_demand}</p>
            <p><strong>Tariff Category:</strong> {modalContent.requirement[0].rq_tariff_category}</p>
            <p><strong>Status:</strong> {modalContent.consumer_status}</p>
            <Row>
              <Col span={12}>
                <p><strong>Term of PPA (years):</strong> {modalContent.term_of_ppa}</p>
              </Col>
              <Col span={12}>
                <p><strong>Lock-in Period (years):</strong> {modalContent.lock_in_period}</p>
              </Col>
              <Col span={12}>
                <p><strong>Commencement of Supply:</strong> {modalContent.commencement_of_supply}</p>
              </Col>
              <Col span={12}>
                <p><strong>Contracted Energy (million units):</strong> {modalContent.contracted_energy}</p>
              </Col>
              <Col span={12}>
                <p><strong>Minimum Supply Obligation (million units):</strong> {modalContent.minimum_supply_obligation}</p>
              </Col>
              <Col span={12}>
                <p><strong>Payment Security (days):</strong> {modalContent.payment_security}</p>
              </Col>
              <Col span={12}>
                <p><strong>Payment Security Type:</strong> {modalContent.payment_security_type}</p>
              </Col>
            </Row>
            {/* {console.log('ipp', modalContent)} */}

            {modalContent?.generator_status !== 'Rejected' && modalContent?.generator_status !== 'Accepted' && (
              <>
                {/* {console.log('ippju')} */}
                {modalContent?.from_whom === 'Consumer' && modalContent?.count % 2 === 0 && modalContent?.count < 4 && (
                  <>
                    <Button onClick={() => handleStatusUpdate('Rejected')}>Reject</Button>
                    <Button style={{ marginLeft: '10px' }} onClick={() => handleStatusUpdate('Accepted')}>Accept</Button>
                    <Button style={{ marginLeft: '10px' }} onClick={() => handleCounterOffer(modalContent)}>Counter Offer</Button>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
      {/* TermSheet component */}
     
{modalContent&& (<TermSheet
        visible={isQuotationModalVisible}
        onCancel={() => setIsQuotationModalVisible(false)} // Close the modal
        data={modalContent} // Pass the modalContent directly to the modal
      />
)
}
    </div>
  );
};

export default RequestedIPP;
