import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Col, Row, Typography, Select, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import { requestedIPPs } from '../../Redux/Slices/Consumer/RequestedIPPSlice';
import RequestForQuotationModal from '../../Components/Modals/RequestForQuotationModal';

const { Title } = Typography;
const { Option } = Select;

const OfferRecievedFromCons = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [ippData, setIppData] = useState([]);
  const [error, setError] = useState(null);
  const [isQuotationModalVisible, setIsQuotationModalVisible] = useState(false); // Add this state to control visibility of RequestForQuotationModal


  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user')).user;

  useEffect(() => {
    const fetchIPPData = async () => {
      try {
        const data = {
          id: user.id,
          user_category: "Consumer"
        }
        const response = await dispatch(requestedIPPs(data));
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

  // if (ippData.length > 0) {
  //   ippData.forEach(({ contracted_energy, consumer_status, id }) => {
  //     console.log(`IPP ID: ${id}, Contracted Energy: ${contracted_energy}, Status: ${consumer_status}`);
  //   });
  // }

  // if (ippData.length > 0) {
  //   ippData.forEach(({term_of_ppa, lock_in_period, commencement_of_supply,  contracted_energy, minimum_supply_obligation, payment_security_day, payment_security_type, consumer_status, id, }) => {
  //     console.log(`IPP ID: ${id}, Contracted Energy: ${contracted_energy}, Status: ${consumer_status}`);
  //   });
  // }

  // console.log('term of ipp', ippData[0]?.term_of_ppa);
  // console.log('lock in period', ippData[0]?.lock_in_period);

 



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
      title: 'IPP ID',
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

  const handleAccept = (id) => {
    message.success(`Offer with ID ${id} has been accepted.`);
    // Add logic for accept action here
  };
  
  const handleCounterOffer = (modalContent) => {
    // Ensure modalContent is passed correctly and that it has the correct data
    console.log(modalContent);  // Add this to debug the modal content
    setModalContent(modalContent);  // Ensure modalContent is updated correctly
    setIsQuotationModalVisible(true);  // Show the quotation modal
  };
  
  
  const handleReject = (id) => {
    message.error(`Offer with ID ${id} has been rejected.`);
    // Add logic for reject action here
  };
  
const data = modalContent;
useEffect(() => {
  console.log(data);
  }, [modalContent]);

  return (
    <div style={{ padding: '20px' }}>
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
        open={isModalVisible}
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
            <p><strong>Status:</strong> {modalContent.generator_status}</p>
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
                <p><strong>Payment Security (days):</strong> {modalContent.payment_security_day}</p>
              </Col>
              <Col span={12}>
                <p><strong>Payment Security Type:</strong> {modalContent.payment_security_type}</p>
              </Col>
            </Row>

            {/* Conditional Rendering of Buttons */}
            {modalContent.generator_status === "Pending" && modalContent.from_whom === "Consumer" && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Button
                  type="primary"
                  style={{ marginRight: "10px", backgroundColor: "#669800", borderColor: "#669800" }}
                  onClick={() => handleReject(modalContent.id)}
                >
                  Reject
                </Button>
                <Button
                  type="default"
                  style={{ marginRight: "10px", borderColor: "#FF9900" }}
                  onClick={() => handleCounterOffer(modalContent)}
                >
                  Counter Offer
                </Button>
                <Button
                  type="danger"
                  onClick={() => handleAccept(modalContent.id)}
                >
                  Accept
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* RequestForQuotationModal component */}
      <RequestForQuotationModal
        visible={isQuotationModalVisible}
        onCancel={handleCancel}
        // ippId={modalContent} // Pass the IPP ID to the modal
        data={data}
      />

    </div>
  );
};

export default OfferRecievedFromCons;
