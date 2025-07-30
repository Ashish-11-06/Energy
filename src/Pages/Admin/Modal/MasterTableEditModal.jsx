import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, message, Row, Col } from 'antd';
import masterTableApi from '../../../Redux/Admin/api/masterTableApi';

const MasterTableEditModal = ({ visible, onClose, record, onUpdate, mode = 'edit' }) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && record) {
            form.setFieldsValue(record);
        } else if (mode === 'add') {
            form.resetFields();
        }
    }, [record, mode, visible]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setConfirmLoading(true);

            let res;
            if (mode === 'edit') {
                res = await masterTableApi.editData({ data: values, id: record.id });
            } else {
                res = await masterTableApi.addData(values);
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
            title={mode === 'edit' ? 'Edit Transmission Data' : 'Add Transmission Data'}
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
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="ISTS_charges" label="ISTS Charges" rules={[numberValidationRule]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="state_charges" label="State Charges" rules={[numberValidationRule]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="banking_charges" label="Banking Charges" rules={[numberValidationRule]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="rooftop_price" label="Rooftop Price" rules={[numberValidationRule]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="max_capacity" label="Max Capacity" rules={[numberValidationRule]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="transmission_charge" label="Transmission Charge" rules={[numberValidationRule]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="transmission_loss" label="Transmission Loss (%)" rules={[numberValidationRule]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="wheeling_charges" label="Wheeling Charges" rules={[numberValidationRule]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="wheeling_losses" label="Wheeling Losses (%)" rules={[numberValidationRule]}>
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="combined_average_replacement_PLF"
                            label="Avg Replacement PLF (%)"
                            rules={[numberValidationRule]}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default MasterTableEditModal;
