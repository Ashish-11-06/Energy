import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, Table, Typography, Space, Switch, Card, Input, Tag } from 'antd';
import AddSubscriptionModal from './Modal/AddSubscriptionModal'; // Optional
import { onlineSubscription } from '../../Redux/Admin/slices/subscriptionSlice';
import { useDispatch } from 'react-redux';

const { Option } = Select;
const { Title } = Typography;

const OnlineSub = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDocModalVisible, setIsDocModalVisible] = useState(false);
  const [documentUrl, setDocumentUrl] = useState('');
  const [onlineUserTypeFilter, setOnlineUserTypeFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const [onlineData, setOnlineData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const onlineData = async () => {
      setLoading(true);
      const res = await dispatch(onlineSubscription());
      console.log('online subscription data', res);
      if (res?.payload) {
        setOnlineData(res?.payload);
        setLoading(false);
      }
    }
    onlineData();
  }, [dispatch])

 

  const toggleStatus = (key) => {
    setOnlineData((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
            ...item,
            status: item.status === 'Active' ? 'Inactive' : 'Active',
          }
          : item
      )
    );
  };


  const showDocumentModal = (url) => {
    setDocumentUrl(url);
    setIsDocModalVisible(true);
  };

  const columns = [
    {
      title: 'Sr. No',
      render: (text, record, index) => index + 1, align: 'center'
    },
    { title: 'User Category', dataIndex: 'user_category', render: (v) => v || 'N/A' },
    { title: 'Name', dataIndex: 'user_name', render: (v) => v || 'N/A' },
    { title: 'Company Name', dataIndex: 'company_name', render: (v) => v || 'N/A' },
    { title: 'Subscription Plan', dataIndex: 'subscription_type', align : 'center',
      render: (plan) => {
        let color = '';
        if (plan?.toLowerCase() === 'lite') color = 'green';
        else if (plan?.toLowerCase() === 'pro') color = 'pink';
        else if (plan?.toLowerCase() === 'free') color = 'yellow';
        else color = 'default';

        return <Tag color={color}>{plan ? plan.charAt(0).toUpperCase() + plan.slice(1).toUpperCase() : 'N/A'}</Tag>;
      },

    },
    { title: 'Start Date', dataIndex: 'start_date', render: (v) => v || 'N/A' },
    { title: 'End Date', dataIndex: 'end_date', render: (v) => v || 'N/A' },
    {
      title: 'Status',
      dataIndex: 'status',
      // render: (status, record) => (
      //   <Switch
      //     checked={status === 'Active'}
      //     onChange={() =>
      //       toggleStatus(record.key ?? record.id)
      //     }
      //     checkedChildren="Active"
      //     unCheckedChildren="Inactive"
      //   />
      // ),
    }
  ];


  const filteredOnlineData = onlineUserTypeFilter
    ? onlineData.filter((item) => item.user_category === onlineUserTypeFilter)
    : onlineData;

  const finalFilterData = filteredOnlineData.filter((item) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      (item.user_name?.toLowerCase().includes(lowerSearch) || '') ||
      (item.company_name?.toLowerCase().includes(lowerSearch) || '') ||
      (item.subscription_type?.toLowerCase().includes(lowerSearch) || '') ||
      (item.user_category?.toLowerCase().includes(lowerSearch) || '')
    );
  });

  return (
    <div style={{ padding: 24 }}>
      {/* Top Right Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
          View Subscription Plans
        </Button>
      </div>

      {/* Online Subscriptions Section */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <Title level={4} style={{ margin: 0 }}>Online Subscriptions</Title>
          <Select
            style={{ width: 240 }}
            placeholder="Filter by User Category"
            allowClear
            value={onlineUserTypeFilter || undefined}
            onChange={setOnlineUserTypeFilter}
          >
            <Option value="Consumer">Consumer</Option>
            <Option value="Generator">Generator</Option>
          </Select>
        </div>
        <Input
          placeholder="Search by name, company name, subscription type, user catagory"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 500, marginBottom: 16 }}
        />
        <Card style={{ borderRadius: 8 }}>
          <Table
            columns={columns}
            dataSource={finalFilterData}
            pagination={{ pageSize: 10 }}
            bordered
            loading={loading}
            scroll={{ x: 'max-content' }}
            size="middle"
          />
        </Card>

      </div>

      {/* Add Subscription Modal */}
      {/* Remove or comment out this block to prevent the modal from showing */}
      {/* 
      <Modal
        title="Add Subscription"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <p>Form goes here...</p>
      </Modal>
      */}

      {/* Document Preview Modal */}
      <Modal
        title="Document Preview"
        open={isDocModalVisible}
        onCancel={() => setIsDocModalVisible(false)}
        footer={null}
        width={500}
        centered
      >
        <img src={documentUrl} alt="Document" style={{ width: '100%', borderRadius: 4 }} />
      </Modal>

      {/* Conditional Custom Modal */}
      {typeof AddSubscriptionModal === 'function' && (
        <AddSubscriptionModal
          visible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
        />
      )}
    </div>
  );
};

export default OnlineSub;

