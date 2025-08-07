import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Card, message, Popconfirm, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import gridTraiffApi from '../../Redux/Admin/api/gridTraiffApi';
import GridTariffEditModal from './Modal/GridTariffEditModal';

const { Title } = Typography;

const buttonStyle = {
    background: '#d4f7d4',
    border: '1px solid #d9d9d9',
    color: '#333',
    transition: 'background 0.3s'
};
const buttonHoverStyle = {
    background: '#fff'
};

const GridTariff = () => {
    const [data, setData] = useState([]);
    const [hoveredId, setHoveredId] = useState({ edit: null, delete: null });
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [modalMode, setModalMode] = useState('edit');

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await gridTraiffApi.getData();
            if (response.status === 200) {
                setData(response.data);
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

    const handleEdit = (record) => {
        setSelectedRecord(record);
        setModalMode('edit');
        setEditModalVisible(true);
    };

    const handleAdd = () => {
        setSelectedRecord(null);
        setModalMode('add');
        setEditModalVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            const res = await gridTraiffApi.deleteData(record.id);
            if (res.status === 200) {
                message.success('Deleted successfully');
                fetchData();
            }
        } catch (error) {
            message.error(error?.response?.data?.message || 'Delete failed');
        }
    };

    const filteredData = data.filter((item) => {
        const lowerSearch = searchText.toLowerCase();
        return (
            (item.state?.toLowerCase().includes(lowerSearch) || '') ||
            (item.tariff_category?.toLowerCase().includes(lowerSearch) || '')
        );  
    });

    const columns = [
        {title: 'Sr.No.', dataIndex: 'sr_no', key: 'sr_no', align: 'center',
            render: (_, __, index) => index + 1
        },
        { title: 'State', dataIndex: 'state', key: 'state', render: (v) => v || 'N/A' },
        { title: 'Tariff Category', dataIndex: 'tariff_category', key: 'tariff_category', render: (v) => v || 'N/A' },
        { title: 'Cost', dataIndex: 'cost', key: 'cost', render: (v) => (v !== undefined && v !== null ? v : 'N/A') },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => handleEdit(record)}
                        style={{ color: '#669800', cursor: 'pointer' }}
                    />
                    <Popconfirm
                        title="Are you sure to delete this record?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>State-wise Grid Tariff Details</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Data
                </Button>
            </div>
            <Input
                placeholder='Search by State or Tariff Category'
                value={searchText}
                style={{ width: 300, marginBottom: 16 }}
                onChange={(e) => {setSearchText(e.target.value)}}
                allowClear
            />
            
            <Card>
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="id"
                    bordered
                    scroll={{ x: 'max-content' }}
                    loading={loading}
                />
            </Card>
            <GridTariffEditModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                record={selectedRecord}
                onUpdate={fetchData}
                mode={modalMode}
            />
        </div>
    );
};

export default GridTariff;

