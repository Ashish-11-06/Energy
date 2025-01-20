import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Col, Row, Typography, Select, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import { requestedIPPs } from '../../Redux/Slices/Consumer/RequestedIPPSlice';

const { Title } = Typography;
const { Option } = Select;

const OfferRecievedFromCons = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [ippData, setIppData] = useState([]);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user')).user;

  useEffect(() => {
    const fetchIPPData = async () => {
      try {
        const data ={
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
          View
        </Button>
      ),
      width: '150px',
    },
  ];

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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OfferRecievedFromCons;
