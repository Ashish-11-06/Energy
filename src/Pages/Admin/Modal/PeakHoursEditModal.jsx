import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, message, Row, Col, Select } from 'antd';
import peakHoursApi from '../../../Redux/Admin/api/peakHoursApi';
import stateApi from '../../../Redux/api/consumer/stateApi';

const PeakHoursEditModal = ({ visible, onClose, record, onUpdate, mode = 'edit' }) => {
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
                res = await peakHoursApi.editData({ data: values, id: record.id });
            } else {
                res = await peakHoursApi.addData(values);
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
            title={mode === 'edit' ? 'Edit Peak Hours Data' : 'Add Peak Hours Data'}
            open={visible}
            onOk={handleSubmit}
            onCancel={onClose}
            okText={mode === 'edit' ? 'Update' : 'Add'}
            confirmLoading={confirmLoading}
            width={800}
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
                            name="peak_hours"
                            label="Peak Hours"
                            rules={[numberValidationRule, { required: true, message: 'Peak Hours is required' }]}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="off_peak_hours"
                            label="Off Peak Hours"
                            rules={[numberValidationRule]}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="peak_start_1"
                            label="Peak Start 1"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="peak_end_1"
                            label="Peak End 1"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="peak_start_2"
                            label="Peak Start 2"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="peak_end_2"
                            label="Peak End 2"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="off_peak_start"
                            label="Off Peak Start"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="off_peak_end"
                            label="Off Peak End"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default PeakHoursEditModal;
