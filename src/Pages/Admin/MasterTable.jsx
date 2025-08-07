// components/MasterTable.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, Popconfirm, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import masterTableApi from '../../Redux/Admin/api/masterTableApi';
import MasterTableEditModal from './Modal/MasterTableEditModal';

const { Title } = Typography;

const MasterTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [modalMode, setModalMode] = useState('edit');
    const [searchText, setSearchText] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await masterTableApi.getData();
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
            const res = await masterTableApi.deleteData(record.id);
            if (res.status === 200) {
                message.success('Deleted successfully');
                fetchData();
            }
        } catch (error) {
            message.error(error?.response?.data?.message || 'Delete failed');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data.filter((item) => {
        const lowerSearch = searchText.toLowerCase();
        return (
            (item.state?.toLowerCase().includes(lowerSearch) || '') 
        );
    });

    const columns = [
        { title: 'State', dataIndex: 'state', key: 'state', render: (v) => v || 'N/A' },
        { title: 'ISTS Charges', dataIndex: 'ISTS_charges', key: 'ISTS_charges',
            render: (v) => (v !== undefined && v !== null ? v : 'N/A') 
        },
        { title: 'State Charges', dataIndex: 'state_charges', key: 'state_charges', 
            render: (v) => (v !== undefined && v !== null ? v : 'N/A') 
        },
        { title: 'Banking Charges', dataIndex: 'banking_charges', key: 'banking_charges', 
            render: (v) => (v !== undefined && v !== null ? v : 'N/A') 
        },
        { title: 'Rooftop Price', dataIndex: 'rooftop_price', key: 'rooftop_price', 
            render: (v) => (v !== undefined && v !== null ? v : 'N/A') 
        },
        { title: 'Max Capacity', dataIndex: 'max_capacity', key: 'max_capacity', 
            render: (v) => (v !== undefined && v !== null ? v : 'N/A') 
        },
        { title: 'Transmission Charge', dataIndex: 'transmission_charge', key: 'transmission_charge', 
            render: (v) => (v !== undefined && v !== null ? v : 'N/A') 
        },
        { title: 'Transmission Loss (%)', dataIndex: 'transmission_loss', key: 'transmission_loss', 
            render: (v) => (v !== undefined && v !== null ? v : 'N/A') 
        },
        { title: 'Wheeling Charges', dataIndex: 'wheeling_charges', key: 'wheeling_charges', 
            render: (v) => (v !== undefined && v !== null ? v : 'N/A') 
        },
        { title: 'Wheeling Losses (%)', dataIndex: 'wheeling_losses', key: 'wheeling_losses', 
            render: (v) => (v !== undefined && v !== null ? v : 'N/A') 
        },
        { title: 'Avg Replacement PLF (%)', dataIndex: 'combined_average_replacement_PLF', key: 'combined_average_replacement_PLF', 
            render: (v) => (v !== undefined && v !== null ? v : 'N/A') 
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
                <Title level={4} style={{ margin: 0 }}>State-wise Transmission Details</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Data
                </Button>
            </div>
            <Input
                placeholder='Search by State'
                value={searchText}
                style={{ width: 300, marginBottom: 16 }}
                onChange={(e) => setSearchText(e.target.value)}
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

            {/* Edit Modal */}
            <MasterTableEditModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                record={selectedRecord}
                onUpdate={fetchData}
                mode={modalMode}
            />
        </div>
    );
};

export default MasterTable;
