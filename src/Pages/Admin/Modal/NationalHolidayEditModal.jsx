import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, message, Row, Col } from 'antd';
import nationalHolidayApi from '../../../Redux/Admin/api/nationalHolidayApi';
import moment from 'moment';

const NationalHolidayEditModal = ({ visible, onClose, record, onUpdate, mode = 'edit' }) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && record) {
            form.setFieldsValue({
                ...record,
                date: record.date ? moment(record.date) : null,
            });
        } else if (mode === 'add') {
            form.resetFields();
        }
    }, [record, mode, visible]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setConfirmLoading(true);

            // Format date to YYYY-MM-DD
            const payload = {
                ...values,
                date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
            };

            let res;
            if (mode === 'edit') {
                res = await nationalHolidayApi.editData({ data: payload, id: record.id });
            } else {
                res = await nationalHolidayApi.addData(payload);
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

    return (
        <Modal
            title={mode === 'edit' ? 'Edit National Holiday' : 'Add National Holiday'}
            open={visible}
            onOk={handleSubmit}
            onCancel={onClose}
            okText={mode === 'edit' ? 'Update' : 'Add'}
            confirmLoading={confirmLoading}
            width={500}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="date"
                            label="Date"
                            rules={[{ required: true, message: 'Date is required' }]}
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label="Holiday Name"
                            rules={[{ required: true, message: 'Holiday name is required' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default NationalHolidayEditModal;
