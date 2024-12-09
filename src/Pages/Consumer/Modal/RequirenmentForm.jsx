import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Row, Col } from 'antd';
import '../../../index.css'
import states from '../../../Data/States';
import industries from '../../../Data/Industry';

const RequirenmentForm = ({ isVisible, onCancel, onSubmit }) => {
    const [form] = Form.useForm();

    // Handle form submission directly within the RequirenmentForm component
    const handleSubmit = (values) => {
        console.log('Form Values: ', values);
        // Handle the form submission logic here
        if (onSubmit) {
            onSubmit(values); // Optionally pass values to parent if needed
        }
        form.resetFields();
    };

    return (
        <Modal
            title="Fill in the details"
            open={isVisible}
            onCancel={onCancel}
            footer={null} // Remove default footer to add custom buttons
            width={600}
        >
            <Form form={form} onFinish={handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="State"
                            name="state"
                            rules={[{ required: true, message: 'Please select your state!' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select your state"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {states.map((state, index) => (
                                    <Select.Option key={index} value={state}>
                                        {state}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Industry"
                            name="industry"
                            rules={[{ required: true, message: 'Please select your industry!' }]}
                        >
                            <Select
                                placeholder="Select your industry"
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {industries.map((industry, index) => (
                                    <Select.Option key={index} value={industry}>
                                        {industry}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>


                    <Col span={12}>
                        <Form.Item
                            label="Capacity"
                            name="capacity"
                            rules={[
                                { required: true, message: 'Please enter the capacity!' },
                            ]}
                        >
                            <Input type="number" placeholder="Enter capacity" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Unit"
                            name="unit"
                            rules={[{ required: true, message: 'Please select the unit!' }]}
                        >
                            <Select placeholder="Select unit">
                                <Select.Option value="mw">Megawatt (MW)</Select.Option>
                                <Select.Option value="kw">Kilowatt (kW)</Select.Option>
                                <Select.Option value="gw">Gigawatt (GW)</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    
                    <Col span={24}>
                        <Form.Item
                            label="Procurement Date"
                            name="procurement"
                            rules={[{ required: true, message: 'Please select a procurement date!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                  
                    </Row>
                    <Col>
                        <Form.Item
                            label="Other Requirements"
                            name="otherRequirements"
                        >
                            <Input.TextArea placeholder="Enter other requirements" />
                        </Form.Item>
                    </Col>
               

                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit" style={{ padding: '10px 20px' }}>
                        Continue
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RequirenmentForm;
