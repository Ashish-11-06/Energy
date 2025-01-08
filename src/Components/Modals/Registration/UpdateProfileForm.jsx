import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Row, Col, Select, Button, Upload, message, Typography, Progress } from 'antd';
import * as XLSX from 'xlsx'; // Import xlsx
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { updateProject } from '../../../Redux/Slices/Generator/portfolioSlice';

const { Option } = Select;
const { Title, Text } = Typography;

const UpdateProfileForm = ({ form, project, onCancel }) => {
  const dispatch = useDispatch();
  const user = (JSON.parse(localStorage.getItem('user'))).user;

  const selectedProject = JSON.parse(JSON.stringify(project, null, 2));
  console.log('Selected Project:', selectedProject);
  const [fileData, setFileData] = useState(null);
  const [file, setFile] = useState(null); // Store the selected file
  const [uploading, setUploading] = useState(false); // Track upload status
  const [progress, setProgress] = useState(0); // Track progress
  const [type, setType] = useState(selectedProject.type || 'Solar'); // Track selected type

  // Function to generate and download the blank Excel sheet
  const downloadExcelTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["Hourly Data", "Annual Generation Potential (MWh)"]]); // Add headers as per your requirement
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template.xlsx");
  };

  // Function to handle file upload
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileData(reader.result); // Store the base64 string
      setFile(file); // Store the file object
    };
    reader.readAsDataURL(file); // Read the file as a base64 string
  };

  useEffect(() => {
    if (selectedProject) {
      form.setFieldsValue({
        ...selectedProject,
        cod: selectedProject.cod ? dayjs(selectedProject.cod) : null, // Ensure date is formatted properly
        yearOfCommissioning: selectedProject.yearOfCommissioning ? dayjs(selectedProject.yearOfCommissioning) : null,
        type: selectedProject.type || 'Solar', // Default to 'Solar' if no type is selected
      });
    }

    // Reset form and file on unmount or form close
    return () => {
      form.resetFields(); // Reset form fields
      setFile(null); // Clear selected file
      setProgress(0); // Reset progress bar
      setUploading(false); // Reset uploading state
    };
  }, []);

  useEffect(() => {
    setFile(null); // Clear selected file
    setFileData(null); // Clear file data
  }, []);

  const onSubmit = () => {
    form.validateFields()
      .then((values) => {
        const updatedValues = {
          ...values,
          id: selectedProject.id, // Add the ID from the selected project
          energy_type: values.type, // Add the energy type
          user: user.id,
          cod: values.cod.format('YYYY-MM-DD'), // Format the date
          hourly_data: fileData ? fileData.split(',')[1] : null, // Add the base64 string here (remove the prefix)
          state: values.state || selectedProject.state,
          available_capacity: values.available_capacity || selectedProject.available_capacity,
        };

        console.log('Updated Form Values:', updatedValues);

        // Dispatch the updateProject action with the updated values
        dispatch(updateProject(updatedValues));

        message.success('Form submitted successfully!');
      })
      .catch((error) => {
        console.error('Validation Failed:', error);
      });
      onCancel();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        cod: selectedProject.cod ? dayjs(selectedProject.cod) : null, // Prefill COD field
        type: selectedProject.type || 'Solar', // Set initial value of type
      }}
      onFinish={onSubmit}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="type"
            label="Technology"
            rules={[{ required: true, message: 'Please select the type!' }]} >
            <Select
              placeholder="Select type"
              value={type} // Use state to manage selected value
              onChange={(value) => {
                setType(value); // Update the type state when selection changes
                form.setFieldsValue({ type: value }); // Update form value directly
                console.log('Selected type:', value); // Log the selected type
              }}
            >
              <Option value="Solar">Solar</Option>
              <Option value="Wind">Wind</Option>
              <Option value="ESS">ESS</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: 'Please input the state!' }]} >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Available Capacity"
            name="available_capacity"
            rules={[{ required: true, message: 'Please input the capacity!' }]} >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="total_install_capacity"
            label="Total install capacity"
            rules={[{ required: true, message: 'Please input the total install capacity!' }]} >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="capital_cost"
            label="Capital Cost"
            rules={[{ required: type === 'ESS', message: 'Please input the capital cost!' }]} >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="marginal_cost"
            label="Marginal Cost"
            rules={[{ required: type === 'ESS', message: 'Please input the marginal cost!' }]} >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="cod"
            label="COD"
            rules={[{ required: true, message: 'Please input the COD!' }]} >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {type !== 'ESS' && (
          <Col span={12}>
            <Form.Item
              name="annual_generation_potential"
              label="Annual Generation Potential (MWh)"
              rules={[{ required: type !== 'ESS', message: 'Please input the annual generation potential!' }]} >
              <Input />
            </Form.Item>
          </Col>
        )}
      </Row>

      {/* Show these fields only for 'ESS' */}
      {type === 'ESS' && (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="efficiencyOfStorage"
              label="Efficiency of Storage"
              rules={[{ required: true, message: 'Please input the efficiency of storage!' }]} >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="efficiencyOfDispatch"
              label="Efficiency of Dispatch"
              rules={[{ required: true, message: 'Please input the efficiency of dispatch!' }]} >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      )}

      {/* Upload and download section is hidden for ESS */}
      {type !== 'ESS' && (
        <>
          <Row gutter={16}>
            <Col span={24}>
              <h3>Upload Hourly Generation Data</h3>
              <Text type="secondary">Please download the template, fill it with the hourly generation data, and then upload it here.</Text>
            </Col>
          </Row>

          <Row gutter={16} align="middle">
            {/* Download Excel Template Icon */}
            <Col span={6}>
              <Button onClick={downloadExcelTemplate} icon={<DownloadOutlined />} type="primary" style={{ width: '100%' }} />
            </Col>

            {/* Upload Excel File Icon */}
            <Col span={8}>
              <Upload
                showUploadList={false} // Disable showing the default file list
                accept=".xlsx,.xls"
                beforeUpload={(file) => {
                  if (file) {
                    handleFileUpload(file); // Handle file upload
                  } else {
                    message.error("Please select a valid file."); // Show error message
                  }
                  return false; // Prevent automatic upload
                }}
              >
                <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
                  Upload Excel Sheet
                </Button>
              </Upload>
            </Col>

            {/* File Preview */}
            <Col span={10}>
              {file && (
                <Text type="secondary">Selected file: {file.name}</Text>
              )}
            </Col>
          </Row>

          {/* Show progress */}
          {uploading && (
            <Row gutter={16}>
              <Col span={24}>
                <Progress
                  percent={progress}
                  status="active"
                  strokeColor="#4CAF50" // Custom color for the progress bar
                />
              </Col>
            </Row>
          )}
        </>
      )}

      {/* Submit button */}
      <Row gutter={24} style={{ textAlign: 'right' }}>
        <Col span={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UpdateProfileForm;
