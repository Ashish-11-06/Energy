/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Select,
  Button,
  Upload,
  message,
  Typography,
  Progress,
  Tooltip,                                                                                                                                               Modal,
} from "antd";
import * as XLSX from "xlsx";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { updateProject } from "../../../Redux/Slices/Generator/portfolioSlice";
import { templateDownload } from "../../../Redux/Slices/Generator/templateDownloadSlice";
import { fetchState } from "../../../Redux/Slices/Consumer/stateSlice";

const { Option } = Select;
const { Title, Text } = Typography;

const UpdateProfileForm = ({ form, project, onCancel, fromPortfolio, onErrorCloseModal, lastUploadedFile, updateLastUploadedFile }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user")).user;

  const project_type = project.type;
  const solar_template_downloaded = user.solar_template_downloaded;
  const wind_template_downloaded = user.wind_template_downloaded;

  const selectedProject = JSON.parse(JSON.stringify(project, null, 2));
  const [fileData, setFileData] = useState(null);
  const [file, setFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [type, setType] = useState(selectedProject.type);
  const [isTemplateDownloaded, setIsTemplateDownloaded] = useState(false);
  const [isState, setIsState] = useState([]);
  const [solarFile, setSolarFile] = useState("");
  const [windFile, setWindFile] = useState("");
  const continueButtonRef = useRef(false); // Ref to track the state of the "Continue" button
const [warningModal, setWarningModal] = useState(false); // State to control tupdatehe warning modal
  useEffect(() => {
    if (user.solar_template_downloaded) {
      setIsTemplateDownloaded(true);
    }
    if (user.wind_template_downloaded) {
      setIsTemplateDownloaded(true);
    }
  });

  useEffect(() => {
    // Update the ref value based on the project type and form state
    if (selectedProject.type === "ESS") {
      continueButtonRef.current = true;
    } else if (fileData || file) {
      continueButtonRef.current = true;
    } else {
      continueButtonRef.current = false;
    }
  }, [selectedProject.type, fileData, file]);

  // Function to download Excel template
  const downloadExcelTemplate = () => {
    const wb = XLSX.utils.book_new();
    const hours = Array.from({ length: 8760 }, (_, i) => [i + 1, ""]); // Generate 8760 rows for Hour column
    const ws = XLSX.utils.aoa_to_sheet([
      ["Hour", "Expected Generation(MWh)"], // Template Headers
      ...hours, // Add 8760 rows
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template.xlsx");

    setIsTemplateDownloaded(true);
    message.success("Template downloaded successfully!");

    const templateData = {
      user_id: user.id,
    };

    if (project_type === "Solar") {
      templateData.solar_template_downloaded = true;
    }

    if (project_type === "Wind") {
      templateData.wind_template_downloaded = true;
    }

    dispatch(templateDownload(templateData))
      .unwrap()
      .then((response) => {
        let userData = JSON.parse(localStorage.getItem("user"));

        if (userData && userData.user) {
          if (project_type === "Solar") {
            userData.user.solar_template_downloaded = true;
          }

          if (project_type === "Wind") {
            userData.user.wind_template_downloaded = true;
          }

          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          console.error("User data is missing or corrupted in localStorage");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Failed to update template status.");
      });
  };

  useEffect(() => {
    dispatch(fetchState())
      .then((response) => {
        setIsState(response.payload);
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
  }, [dispatch]);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileData(reader.result);
      setFile(file);

      // Update the continueButtonRef state after file upload
      continueButtonRef.current = true;

      // Reset the file input state
      document.querySelector('input[type="file"]').value = null;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (lastUploadedFile) {
      setFile({ name: lastUploadedFile });
    }
  }, [lastUploadedFile]);

const handleCloseWarningModal = () => {
  setWarningModal(false);
    oncancel();
  };

  const isUploadButtonDisabled =
    (project_type === "solar" && !solar_template_downloaded) ||
    (project_type === "wind" && !wind_template_downloaded);

  useEffect(() => {
    setFile(null);
    setFileData(null);
  }, []);

  useEffect(() => {
    // Reset file and fileData when the project changes
    setFile(null);
    setFileData(null);
    continueButtonRef.current = selectedProject.type === "ESS"; // Reset submit button state
  }, [project]);

  const onSubmit = async (values) => {
    const updatedValues = {
      ...values,
      id: selectedProject.id,
      energy_type: values.type,
      user: user.id,
      cod: values.cod.format("YYYY-MM-DD"),
      hourly_data: fileData ? fileData.split(",")[1] : null,
      state: values.state,
    };

    try {
      const response = await dispatch(updateProject(updatedValues)).unwrap();
      console.log('res',response);
      if(response.message !== null ) {
        message.warning(response.message || "Please fill all the details and upload the file in given format");
        setWarningModal(true);
        return;
      }
      message.success("Form submitted successfully!");
      form.resetFields();
      setFileData(null);
      setFile('');
      // localStorage.removeItem("matchingConsumerId");
      onCancel();
    } catch (error) {
      message.error(error);
      onErrorCloseModal();
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        cod: selectedProject.cod ? dayjs(selectedProject.cod) : null,
        type: selectedProject.type || "Solar",
      }}
      onFinish={onSubmit}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="type"
            label="Technology"
            rules={[{ required: true, message: "Please select the type!" }]}
          >
            <Select
              placeholder="Select type"
              value={type}
              disabled
              onChange={(value) => {
                setType(value);
                form.setFieldsValue({ type: value });
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
            rules={[{ required: true, message: "Please select the state!" }]}
          >
            <Select placeholder="Select your state" showSearch disabled>
              {isState &&
                isState.map((state, index) => (
                  <Select.Option key={index} value={state}>
                    {state}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
        <Form.Item
          label="Available Capacity (MW)"
          name="available_capacity"
          rules={[
            { required: true, message: "Please input the capacity!" },
            {
              validator: (_, value) =>
                value > 1
                  ? Promise.resolve()
                  : Promise.reject(new Error("Capacity must be greater than 1 MW")),
            },
          ]}
        >

            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="total_install_capacity"
            label="Total Install Capacity (MW)"
            rules={[
              {
                required: true,
                message: "Please input the total install capacity!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value >= getFieldValue("available_capacity")) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Total Install Capacity must be greater than or equal toAvailable Capacity!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="capital_cost"
            label="Capital Cost (INR/MWh)"
            rules={[
              {
                required: type === "ESS",
                message: "Please input the capital cost!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="marginal_cost"
            label="Marginal Cost (INR/MWh)"
            rules={[
              {
                // required: type === "ESS" || true,
                required: true,
                message: "Please input the marginal cost!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="cod"
            label="COD"
            rules={[{ required: true, message: "Please input the COD!" }]}
          >
            <DatePicker
              format={"DD/MM/YYYY"}
              style={{ width: "100%" }}
              disabled={!fromPortfolio}
            />
          </Form.Item>
        </Col>
        {selectedProject.type !== "ESS" && (
          <Col span={12}>
            <Form.Item
              name="annual_generation_potential"
              label="Annual Generation Potential (MWh)"
              rules={[
                {
                  required: selectedProject.type !== "ESS",
                  message: "Please input the annual generation potential!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        )}
      </Row>

      {selectedProject.type === "ESS" && (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="efficiency_of_storage"
              label="Efficiency of Storage"
              rules={[
                {
                  required: true,
                  message: "Please input the efficiency of storage!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="efficiency_of_dispatch"
              label="Depth of Discharge"
              rules={[
                {
                  required: true,
                  message: "Please input the depth of discharge!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      )}

      {selectedProject.type !== "ESS" && (
        <>
          <Row gutter={16} style={{ marginBottom: "3%" }}>
            <Col span={24}>
              <h3>Upload Hourly Generation Data</h3>
              <Text type="secondary" style={{ marginBottom: "40px" }}>
              Hourly generation data to be provided for available capacity.
              </Text>
             <br/>
              <Text type="secondary" style={{ marginBottom: "40px"}}>
                Please download the template, fill it with the hourly generation
                data, and then upload it here.
              </Text>
            </Col>
          </Row>

          <Row gutter={16} align="middle">
            <Col span={6}>
              <Button
                onClick={downloadExcelTemplate}
                icon={<DownloadOutlined />}
                type="primary"
                style={{ width: "100%" }}
              ></Button>
            </Col>

            <Col span={8}>
              <Upload
                showUploadList={false}
                accept=".xlsx,.xls"
                beforeUpload={(file) => {
                  if (!isTemplateDownloaded) {
                    message.error(
                      "Please download the template before uploading."
                    );
                    return false;
                  }
                  handleFileUpload(file);
                  return false;
                }}
              >
                {!isTemplateDownloaded ? (
                  <Tooltip title="Please download the template before uploading">
                    <Button
                      icon={<UploadOutlined />}
                      style={{ width: "100%" }}
                      disabled
                    >
                      Upload Excel Sheet
                    </Button>
                  </Tooltip>
                ) : (
                  <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                    Upload Excel Sheet
                  </Button>
                )}
              </Upload>
            </Col>

            <Col span={10}>
              {file && (
                <Text type="secondary">
                  Last uploaded file: {file.name}
                </Text>
              )}
            </Col>
          </Row>

          {uploading && (
            <Row gutter={16}>
              <Col span={24}>
                <Progress
                  percent={progress}
                  status="active"
                  strokeColor="#4CAF50"
                />
              </Col>
            </Row>
          )}
        </>
      )}
          <p style={{color:'GrayText',marginTop:'10px'}}>(Note : All * fields are mandatory)</p>

      <Row gutter={24} style={{ textAlign: "right" }}>
        <Col span={24}>
          <Form.Item>
            {!continueButtonRef.current ? (
              <Tooltip title="Please fill all the details and upload the file in given format">
                <Button type="primary" htmlType="submit" disabled>
                  Submit
                </Button>
              </Tooltip>
            ) : (
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            )}
          </Form.Item>
        </Col>
      </Row>

      <Modal open={warningModal} onCancel={() => setWarningModal(false)} footer={null}>
        <Title level={4}>Warning</Title>
        <Text type="danger">
          Please fill all the details and upload the file in the given format.
        </Text>
        <br />
        <Button
          onClick={() => {
            setWarningModal(false);
            onCancel(); // Close the parent modal
          }}
        >
          Proceed
        </Button>
        <Button type="primary" onClick={() => setWarningModal(false)} style={{ marginTop: "16px",marginLeft: "10px" }}>
          Resubmit
        </Button>

      </Modal>
    </Form>
  );
};

export default UpdateProfileForm;
