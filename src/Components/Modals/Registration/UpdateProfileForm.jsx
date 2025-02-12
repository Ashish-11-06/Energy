import React, { useState, useEffect } from "react";
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
  Tooltip,
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

const UpdateProfileForm = ({ form, project, onCancel, fromPortfolio }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user")).user;
  console.log(fromPortfolio);

  const project_type = project.type;
  const solar_template_downloaded = user.solar_template_downloaded;
  const wind_template_downloaded = user.wind_template_downloaded;

  const selectedProject = JSON.parse(JSON.stringify(project, null, 2));
  const [fileData, setFileData] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [type, setType] = useState(selectedProject.type || "Solar");
  const [isTemplateDownloaded, setIsTemplateDownloaded] = useState(false);
  const [isState, setIsState] = useState([]);

  useEffect(() => {
  if(user.solar_template_downloaded){
    setIsTemplateDownloaded(true);
  }
  if(user.wind_template_downloaded){
    setIsTemplateDownloaded(true);
  }
});

  // Function to download Excel template
  const downloadExcelTemplate = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["Hourly Data", "Annual Generation Potential (MWh)"],
    ]); // Template Headers
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template.xlsx");

    setIsTemplateDownloaded(true);
    message.success("Template downloaded successfully!");
    // let user = JSON.parse(localStorage.getItem("user")).user;

    // user.user = {
    //   id: 6,
    //   user_category: "Consumer",
    //   email: "newemail@example.com",
    //   mobile: "9876543210",
    //   company: "NewCompany",
    //   company_representative: "John Doe",
    //   cin_number: "ABC12345",
    //   designation: "Manager",
    //   verified_at: "2025-02-01T10:00:00+05:30",
    //   is_new_user: true,
    //   solar_template_downloaded: true,
    //   wind_template_downloaded: false
    // };
    // Update template download status
    const templateData = {
      user_id: user.id,
    };

    // Add solar_template_downloaded only if the project_type is 'solar'
    if (project_type === "Solar") {
      templateData.solar_template_downloaded = true;
    }

    // Add wind_template_downloaded only if the project_type is 'wind'
    if (project_type === "Wind") {
      templateData.wind_template_downloaded = true;
    }

    dispatch(templateDownload(templateData))
      .unwrap()
      .then((response) => {
        console.log("Template download info:", response);

        // Retrieve user data from localStorage
        let userData = JSON.parse(localStorage.getItem("user"));

        // Ensure userData and userData.user exist
        if (userData && userData.user) {
          // Check if the project_type is 'Solar' and update the solar_template_downloaded
          if (project_type === "Solar") {
            userData.user.solar_template_downloaded = true;
          }

          // Check if the project_type is 'Wind' and update the wind_template_downloaded
          if (project_type === "Wind") {
            userData.user.wind_template_downloaded = true;
          }

          // Save the updated user data back to localStorage
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
        // console.log(response.payload);

        setIsState(response.payload);
        //console.log(isState);
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
  }, [dispatch]);

  // Handle file upload
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileData(reader.result);
      setFile(file);
    };
    reader.readAsDataURL(file);
  };

  const isUploadButtonDisabled =
    (project_type === "solar" && !solar_template_downloaded) ||
    (project_type === "wind" && !wind_template_downloaded);

  // useEffect(() => {
  // if (!user?.id) return;

  // const downloadTemplate = async () => {
  //   const templateData = {
  //     user_id: user.id,
  //    solar_template_downloaded: project_type === 'solar',
  //     wind_template_downloaded: project_type === 'wind',
  //   };

  //   try {
  //     const response = await dispatch(templateDownload(templateData)).unwrap();
  //     console.log("Response:", response);
  //     setIsTemplateDownloaded(true);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     message.error("Failed to download the template.");
  //   }
  // };

  // }, [dispatch, user?.id]);

  useEffect(() => {
    setFile(null);
    setFileData(null);
  }, []);

  const onSubmit = (values) => {
    console.log("Form Values:", values);

    const updatedValues = {
      ...values,
      id: selectedProject.id,
      energy_type: values.type,
      user: user.id,
      cod: values.cod.format("YYYY-MM-DD"),
      hourly_data: fileData ? fileData.split(",")[1] : null,
      state: values.state,
    };

    console.log("Updated Form Values:", updatedValues);

    dispatch(updateProject(updatedValues));
    message.success("Form submitted successfully!");
    localStorage.removeItem("matchingConsumerId");
    onCancel();
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
              onChange={(value) => {
                setType(value);
                form.setFieldsValue({ type: value });
                console.log("Selected type:", value);
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
            <Select
              placeholder="Select your state"
              showSearch
              disabled={!fromPortfolio}
            >
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
            label="Available Capacity"
            name="available_capacity"
            rules={[{ required: true, message: "Please input the capacity!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="total_install_capacity"
            label="Total Install Capacity"
            rules={[
              {
                required: true,
                message: "Please input the total install capacity!",
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
            name="capital_cost"
            label="Capital Cost"
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
            label="Marginal Cost (INR/MW)"
            rules={[
              {
                required: type === "ESS",
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
        {type !== "ESS" && (
          <Col span={12}>
            <Form.Item
              name="annual_generation_potential"
              label="Annual Generation Potential (MWh)"
              rules={[
                {
                  required: type !== "ESS",
                  message: "Please input the annual generation potential!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        )}
      </Row>

      {type === "ESS" && (
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
              label="Efficiency of Dispatch"
              rules={[
                {
                  required: true,
                  message: "Please input the efficiency of dispatch!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      )}

      {type !== "ESS" && (
        <>
          <Row gutter={16} style={{ marginBottom: "3%" }}>
            <Col span={24}>
              <h3>Upload Hourly Generation Data</h3>
              <Text type="secondary" style={{ marginBottom: "40px" }}>
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
                  <Button
                    icon={<UploadOutlined />}
                    style={{ width: "100%" }}
                   
                  >
                    Upload Excel Sheet
                  </Button>
                )}
              </Upload>
            </Col>

            <Col span={10}>
              {file && <Text type="secondary">Selected file: {file.name}</Text>}
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

      <Row gutter={24} style={{ textAlign: "right" }}>
        <Col span={24}>
          <Form.Item>
            {!fileData && type != "ESS" ? (
              <Tooltip title="Please fill all the details and upload the file in given format">
                <Button type="primary" htmlType="submit" disabled>
                  Submit
                </Button>
              </Tooltip>
            ) : (
              // <>
              // {!fileData && type==='ESS'? (
              //     <Tooltip title="Please fill all the details">
              // <Button type="primary" htmlType="submit" disabled>
              //   Submlplplpplplit
              // </Button>
              // </Tooltip>
              // ):(
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              // )}
              // </>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UpdateProfileForm;
