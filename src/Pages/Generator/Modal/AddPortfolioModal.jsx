/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Button, DatePicker, Row, Col, Select, message, Tooltip, Input } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { addProject, updateProject } from '../../../Redux/Slices/Generator/portfolioSlice';
import { InfoCircleOutlined } from '@ant-design/icons';
import { fetchState } from '../../../Redux/Slices/Consumer/stateSlice';

const AddPortfolioModal = ({ visible, onClose, user, data, isEditMode }) => {
  const [form] = Form.useForm();
  const [unit, setUnit] = useState('MW');
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.portfolio);
  const [loading, setLoading] = useState(false);
  const [isState, setIsState] = useState([]); // Ensure it's initialized as an array

  useEffect(() => {
    if (status === 'failed' && error) {
      message.error(error);
    }
  }, [status, error]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
   // console.log('values:', values);    
      if (values.cod) {
        values.cod = dayjs(values.cod).format('YYYY-MM-DD');
      }
      values.user = user.id;
      setLoading(true);
      if (data) {
        const id = data?.id;
        const updatedValues = { ...values, id }; // Add data.id to values
    
        dispatch(updateProject(updatedValues))
            .unwrap()
            .then(() => {
                setLoading(false);
                form.resetFields();
                onClose();
                message.success('Project updated successfully!');
            })
            .catch((err) => {
                setLoading(false);
                message.error(err.message || 'Failed to update project. Please try again.');
            });
    }
            else {
          dispatch(addProject(values))
          .unwrap()
          .then(() => {
            setLoading(false);
            form.resetFields();
            onClose();
            message.success('Project added successfully!');
          })
          .catch((err) => {
            setLoading(false);
            message.error(err.message || 'Failed to add project. Please try again.');
          });
      }
      
    }).catch((info) => {
      // console.log('Validate Failed:', info);
    });
  };

  useEffect(() => {
    dispatch(fetchState())
      .then(response => {
        setIsState(Array.isArray(response.payload) ? response.payload : []); // Ensure payload is an array
      })
      .catch(error => {
        console.error("Error fetching states:", error);
        setIsState([]); // Fallback to an empty array on error
      });
  }, [dispatch]);

  useEffect(() => {
    if (visible) {
      if (isEditMode && data) {
        form.setFieldsValue({
          energy_type: data?.type,
          state: data.state,
          connectivity: data.connectivity,
          site_name: data.site_name,
          total_install_capacity: data.total_install_capacity,
          available_capacity: data.available_capacity,
          cod: data.cod ? dayjs(data.cod) : null,
        });
        setUnit(data.energy_type === 'ESS' ? 'MWh' : 'MW'); // Set unit based on energy type
      } else {
        form.resetFields(); // Reset fields for adding a new portfolio
        setUnit('MW'); // Reset unit to default
      }
    }
  }, [visible, isEditMode, data, form]);

  const disablePastDates = (current) => {
    return false; // Allow all dates, including past dates
  };

  const handleTechnologyChange = (value) => {
    if (value === 'ESS') {
      setUnit('MWh');
    } else {
      setUnit('MW');
    }
  };

  return (
    <Modal
    title={!data ? 'Add New Project Entry' : 'Update Project Entry'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form form={form} layout="vertical" name="addPortfolioForm">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
            
              label={
                <span>
                  Technology&nbsp;
                  <Tooltip title="Select the type of energy technology used for the project.">
                    <InfoCircleOutlined style={{ color: "#999", marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
              name="energy_type"
              rules={[{ required: true, message: 'Please select type!' }]} >
              <Select placeholder="Select Type" onChange={handleTechnologyChange} >
                <Select.Option value="Solar">Solar</Select.Option>
                <Select.Option value="Wind">Wind</Select.Option>
                <Select.Option value="ESS">ESS (Energy Storage System)</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <span>
                  State&nbsp;
                  <Tooltip title="State where the consumption unit is located or operates">
                    <InfoCircleOutlined style={{ color: "#999", marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
              name="state"
              
              rules={[{ required: true, message: "Please select your state!" }]}
              
            >
              <Select placeholder="Select your state" showSearch >
                {Array.isArray(isState) && isState.map((state, index) => ( // Add a check before map
                  <Select.Option key={index} value={state}>
                    {state}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Connectivity&nbsp;
                  <Tooltip title="Select the type of connectivity for the project.">
                    <InfoCircleOutlined style={{ color: "#999", marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
              name="connectivity"
              rules={[{ required: true, message: 'Please select connectivity type!' }]} >
              <Select placeholder="Select Connectivity">
                <Select.Option value="CTU">CTU</Select.Option>
                <Select.Option value="STU">STU</Select.Option>
                <Select.Option value="Discom">Discom</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item
              label={
                <span>
                  Site Name&nbsp;
                  <Tooltip title="Name of the site  where the electricity is being generated.">
                    <InfoCircleOutlined style={{ color: "#999", marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
              name="site_name"
              rules={[{ required: true, message: 'Please enter site name!' }]} >
              <Input
                type="text"
                placeholder="Enter site name"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                AC Install Capacity (in {unit})&nbsp;
                  <Tooltip title="The total installed AC capacity of the project in Megawats.">
                    <InfoCircleOutlined style={{ color: "#999", marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
              name="total_install_capacity"
              rules={[{ required: true, message: 'Please input energy capacity!' }, { type: 'number', message: 'Please enter a valid number!' }]} >
              <InputNumber
                style={{ width: '100%' }}
                placeholder={`Energy Capacity in ${unit}`}
                min={1}
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <span>
                  Total Available Capacity (in {unit})&nbsp;
                  <Tooltip title="Enter the total available capacity of the project in megawatts.">
                    <InfoCircleOutlined style={{ color: "#999", marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
              name="available_capacity"
              rules={[{ required: true, message: 'Please input energy capacity!' }, { type: 'number', message: 'Please enter a valid number!' }]} >
              <InputNumber
                style={{ width: '100%' }}
                placeholder={`Energy Capacity in ${unit}`}
                min={1}
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={
                <span>
                  COD (Commercial Operation Date)&nbsp;
                  <Tooltip title="Select the date when the project will start commercial operations.">
                    <InfoCircleOutlined style={{ color: "#999", marginLeft: 4 }} />
                  </Tooltip>
                </span>
              }
              name="cod"
              rules={[{ required: true, message: 'Please select COD!' }]} >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={disablePastDates}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <p style={{color:'GrayText'}}>(Note : All * fields are mandatory)</p>
  <Button
    type="primary"
    onClick={handleSubmit}
    style={{ width: '100%' }}
    loading={loading}
  >
    {!data ? 'Add Entry' : 'Update Entry'}
  </Button>
</Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPortfolioModal;