import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, message, Row, Col, Select } from 'antd';
import gridTraiffApi from '../../../Redux/Admin/api/gridTraiffApi';
import stateApi from '../../../Redux/api/consumer/stateApi';

const GridTariffEditModal = ({ visible, onClose, record, onUpdate, mode = 'edit' }) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [states, setStates] = useState([]);

    useEffect(() => {
        if (mode === 'edit' && record) {
            form.setFieldsValue(record);
        } else if (mode === 'add') {
            form.resetFields();
        }
    }, [record, mode, visible]);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await stateApi.states();
                if (response.status === 200 && Array.isArray(response.data)) {
                    // console.log('Fetched states:', response.data);
                    setStates(response.data);
                }
            } catch (error) {
                message.error('Failed to fetch states');
            }
        };

        fetchStates();
    }, []);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setConfirmLoading(true);

            let res;
            if (mode === 'edit') {
                res = await gridTraiffApi.editData({ data: values, id: record.id });
            } else {
                // Fix: addData is missing in your API, so add it in gridTraiffApi.js
                if (typeof gridTraiffApi.addData !== 'function') {
                    message.error('Add API not implemented');
                    setConfirmLoading(false);
                    return;
                }
                res = await gridTraiffApi.addData(values);
            }

            if (res.status === 200 || res.status === 201) {
                message.success(mode === 'edit' ? 'Updated successfully' : 'Added successfully');
                onUpdate();
                onClose();
            }
        } catch (error) {
            message.error(error?.response?.data?.message || 'Operation failed');
        } finally {
            setConfirmLoading(false);
        }
    };

    const numberValidationRule = {
        type: 'number',
        min: 0,
        message: 'Value must be non-negative',
    };

    return (
        <Modal
            title={mode === 'edit' ? 'Edit Grid Tariff Data' : 'Add Grid Tariff Data'}
            open={visible}
            onOk={handleSubmit}
            onCancel={onClose}
            okText={mode === 'edit' ? 'Update' : 'Add'}
            confirmLoading={confirmLoading}
            width={600}
        >
            
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="state"
                            label="State"
                            rules={[{ required: true, message: 'State is required' }]}
                        >
                            <Select
                                placeholder="Select State"
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option?.children?.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {states.map((state) => (
                                    <Select.Option key={state} value={state}>
                                        {state}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="tariff_category"
                            label="Tariff Category"
                            rules={[{ required: true, message: 'Tariff Category is required' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="cost"
                            label="Cost"
                            rules={[numberValidationRule, { required: true, message: 'Cost is required' }]}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default GridTariffEditModal;
