import React, { useState, useEffect } from 'react';
import { Table, Select, Tag, Space, message, Card, Tooltip, Modal, Button, Descriptions } from 'antd';
import helpApi from '../../Redux/Admin/api/helpApi';
import { EyeOutlined } from '@ant-design/icons';

const { Option } = Select;

const Help = () => {
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [status, setStatus] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await helpApi.getData();
      if (response.status === 200) {
        const updatedData = response.data.map((item, index) => ({
          ...item,
          id: item.id || item._id || index,
        }));
        setData(updatedData);
      } else {
        message.error('Failed to fetch data');
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async () => {
    if (!selectedQuery || !status) return;

    setLoading(true);
    try {
      const response = await helpApi.editData({ data: { status }, id: selectedQuery.id });
      if (response.status === 200) {
        message.success('Status updated successfully');
        fetchData(); // Refresh the data
        setIsModalOpen(false);
      } else if (response.data?.detail) {
        message.error(response.data.detail);
      } else {
        message.error('Failed to update status');
      }
    } catch (error) {
      // Show backend error detail if present
      if (error?.response?.data?.detail) {
        message.error(error.response.data.detail);
      } else {
        message.error(error?.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) => {
    const userMatch = userTypeFilter ? item.userType === userTypeFilter : true;
    const statusMatch = statusFilter ? item.status === statusFilter : true;
    return userMatch && statusMatch;
  });

  const columns = [
    {
      title: 'Sr. No.',
      dataIndex: 'srNo',
      key: 'srNo',
      render: (_, __, index) => index + 1,
      align: 'center',
    },
    { title: 'User Category', dataIndex: 'user_category', key: 'user_category' },
    { title: 'Name', dataIndex: 'company_representative', key: 'company_representative' },
    { title: 'Company Name', dataIndex: 'company', key: 'company' },
    {
      title: 'Query',
      dataIndex: 'query',
      key: 'query',
      render: (query) => <div>{query}</div>,
    },
    {
      title: 'Query Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Pending') color = 'volcano';
        else if (status === 'Resolved') color = 'green';
        else if (status === 'In Progress') color = 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Review',
      dataIndex: 'review',
      key: 'review',
      render: (review, record) => (
        <Tooltip title={review ? 'View review and update status' : 'No Review'}>
          <EyeOutlined
            style={{
              fontSize: '16px',
              color: review ? '#722ed1' : '#3a3a3aff',
              cursor: 'pointer',
            }}
            onClick={() => {
              setSelectedQuery(record);
              setStatus(record.status);
              setIsModalOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <h2>Help Desk Queries</h2>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by User Category"
          style={{ width: 200 }}
          allowClear
          value={userTypeFilter || undefined}
          onChange={(value) => setUserTypeFilter(value)}
        >
          <Option value="Consumer">Consumer</Option>
          <Option value="Generator">Generator</Option>
        </Select>
        <Select
          placeholder="Filter by Query Status"
          style={{ width: 200 }}
          allowClear
          value={statusFilter || undefined}
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Resolved">Resolved</Option>
          <Option value="In Progress">In Progress</Option>
        </Select>
      </Space>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={true}
          bordered
          scroll={{ x: 'max-content' }}
          style={{ backgroundColor: 'white' }}
          rowClassName={() => 'white-row'}
          loading={loading}
          rowKey={(record) => record.id}
        />
      </Card>

      {/* Query Detail Modal */}
     <Modal
        title={`Query Details - ${selectedQuery?.company_representative || 'Unnamed User'}`}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedQuery(null);
        }}
        width={800}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loading}
            onClick={handleStatusChange}
          >
            Update Status
          </Button>,
        ]}
      >
        {selectedQuery && (
          <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0 8px' }}>
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Company Name">
                {selectedQuery.company || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="User Category">
                {selectedQuery.user_category || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Current Status">
                <Tag color={
                  selectedQuery.status === 'Pending' ? 'volcano' : 
                  selectedQuery.status === 'Resolved' ? 'green' : 'blue'
                }>
                  {selectedQuery.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Query">
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f9f9f9', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedQuery.query || 'N/A'}
                </div>
              </Descriptions.Item>
              {/* <Descriptions.Item label="Review">
                {selectedQuery.review ? (
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#f0f7ff', 
                    borderRadius: '4px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedQuery.review}
                  </div>
                ) : (
                  <div style={{ color: '#999', fontStyle: 'italic' }}>No review available</div>
                )}
              </Descriptions.Item> */}
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h4 style={{ marginBottom: 8 }}>Update Query Status</h4>
              <Select
                style={{ width: '100%' }}
                value={status}
                onChange={async (value) => {
                  setStatus(value);
                  if (selectedQuery) {
                    try {
                      await helpApi.editData({ data: { status: value }, id: selectedQuery.id });
                      message.success('Status updated successfully');
                      fetchData();
                      setIsModalOpen(false);
                    } catch (error) {
                      message.error(error?.response?.data?.message || 'Failed to update status');
                    }
                  }
                }}
              >
                <Option value="Pending">Pending</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Resolved">Resolved</Option>
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Help;