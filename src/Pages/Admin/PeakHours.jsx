import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Card, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import peakHoursApi from '../../Redux/Admin/api/peakHoursApi';
import PeakHoursEditModal from './Modal/PeakHoursEditModal';

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

const PeakHours = () => {
    const [data, setData] = useState([]);
    const [hoveredId, setHoveredId] = useState({ edit: null, delete: null });
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [modalMode, setModalMode] = useState('edit');

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await peakHoursApi.getData();
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
            const res = await peakHoursApi.deleteData(record.id);
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
            (item.name?.toLowerCase().includes(lowerSearch) || '')
        );
    });

    const columns = [
        { title: 'State', dataIndex: 'name', key: 'name', render: (v) => v || 'N/A' },
        { title: 'Peak Hours', dataIndex: 'peak_hours', key: 'peak_hours', 
            render: (v) => (v !== undefined && v !== null ? v : 'N/A') 
        },
        { title: 'Off Peak Hours', dataIndex: 'off_peak_hours', key: 'off_peak_hours', 
            render: (v) => (v !== undefined && v !== null ? v : 'N/A') 
        },
        { title: 'Peak Start 1', dataIndex: 'peak_start_1', key: 'peak_start_1', 
            render: (v) => v || 'N/A' 
        },
        { title: 'Peak End 1', dataIndex: 'peak_end_1', key: 'peak_end_1', 
            render: (v) => v || 'N/A' 
        },
        { title: 'Peak Start 2', dataIndex: 'peak_start_2', key: 'peak_start_2', 
            render: (v) => v || 'N/A' 
        },
        { title: 'Peak End 2', dataIndex: 'peak_end_2', key: 'peak_end_2', 
            render: (v) => v || 'N/A' 
        },
        { title: 'Off Peak Start', dataIndex: 'off_peak_start', key: 'off_peak_start', 
            render: (v) => v || 'N/A' 
        },
        { title: 'Off Peak End', dataIndex: 'off_peak_end', key: 'off_peak_end', 
            render: (v) => v || 'N/A' 
        },
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
                <Title level={4} style={{ margin: 0 }}>State-wise Peak/Off-Peak Hours</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Data
                </Button>
            </div>
            <Input
                placeholder="Search by State"
                value={searchText}               
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300, marginBottom: 16 }}
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
            <PeakHoursEditModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                record={selectedRecord}
                onUpdate={fetchData}
                mode={modalMode}
            />
        </div>
    );
};

export default PeakHours;
