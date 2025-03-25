/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Row, Col, InputNumber, Tooltip, DatePicker, Input, notification, message } from 'antd';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addTableMonthData, fetchTableMonthData } from '../../Redux/slices/generator/monthAheadSliceG';
import { getAllProjectsById } from "../../Redux/slices/generator/portfolioSlice";

const { Option } = Select;

const PlanMonthTradePageG = () => {
  const [tableDemandData, setTableDemandData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [demand, setDemand] = useState('');
  const [price, setPrice] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [demandData, setDemandData] = useState([]);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [dataAdded, setDataAdded] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [generatorPortfolio, setGeneratorPortfolio] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (value) => {
    setSelectedMonth(value);
    generateDemandData(value);
  };

  const generateDemandData = (month) => {
    const daysInMonth = new Date(2023, new Date(Date.parse(month + " 1, 2023")).getMonth() + 1, 0).getDate();
    const data = Array.from({ length: daysInMonth }, (_, index) => ({
      key: index + 1,
      date: `${index + 1}`,
      demand: null,
    }));
    setDemandData(data);
  };

  useEffect(() => {
    generateDemandData(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = JSON.parse(localStorage.getItem('user')).user.id;
        const res = await dispatch(getAllProjectsById(id)).unwrap();
        const flattenedPortfolio = [
          ...res.Solar.map(item => ({ id: item.id, type: 'Solar' })),
          ...res.Wind.map(item => ({ id: item.id, type: 'Wind' })),
          ...res.ESS.map(item => ({ id: item.id, type: 'ESS' }))
        ];
        setGeneratorPortfolio(flattenedPortfolio);
        // console.log(flattenedPortfolio);
      } catch (error) {
        message.error(error)
        // console.log("Error fetching portfolio:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleInputChange = (value, key) => {
    const newData = [...demandData];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index].demand = value;
      setDemandData(newData);
    }
  };

  useEffect(() => {
    const allFilled = demandData.every((item) => item.demand !== null);
    setAllFieldsFilled(allFilled);
  }, [demandData]);

  const handleAddData = async () => {
    const data = {
      portfolio_id: selectedPortfolio.id,
      portfolio_type: selectedPortfolio.type.toLowerCase(),
      date: selectedDate ? selectedDate.format('YYYY-MM-DD') : '',
      generation: parseFloat(demand),
      price: parseFloat(price)
    };

    try {
      const res = await dispatch(addTableMonthData(data)).unwrap();
      // console.log('Response from addTableMonthData:', res);
      setDataAdded(true);
      if (res) {
        // console.log('Data added successfully');

        // Show success notification
        notification.success({
          message: 'Success',
          description: 'Your data added successfully. Check in the planning section your planned data.',
        });

        // Fetch the updated table data
        const updatedData = await dispatch(fetchTableMonthData()).unwrap();
        setTableDemandData(updatedData);

        // Navigate to planning page
        navigate('/px/generator/planning');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNextTrade = () => {
    localStorage.setItem("monthTradeData", JSON.stringify(demandData));
    localStorage.setItem("selectedMonth", selectedMonth);
    localStorage.setItem("navigationSource", "PlanMonthTrading");
    navigate('/px/consumer/trading');
  };

  const columnsMonth = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Generation (MWh)",
      dataIndex: "generation",
      key: "generation",
    },
    {
      title: "Price (INR)",
      dataIndex: "price",
      key: "price",
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Plan Your Trade</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px', flexWrap: 'nowrap' }}>
        {/* Portfolio Selection Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1 }}>
          <label htmlFor="" style={{ minWidth: '100px', fontSize: '16px' }}>
            Select Portfolio:
          </label>
          <Select
            style={{ width: "150px", fontSize: '16px' }}
            placeholder="Select Portfolio"
            value={selectedPortfolio ? selectedPortfolio.id : undefined}
            onChange={(value) => {
              const selected = generatorPortfolio.find(item => item.id === value);
              setSelectedPortfolio(selected);
            }}
          >
            {generatorPortfolio.map(item => (
              <Option key={item.id} value={item.id}>
                {`${item.id}: ${item.type}`}
              </Option>
            ))}
          </Select>
        </div>

        {/* Date Picker Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1 }}>
          <label htmlFor="" style={{ minWidth: '100px', fontSize: '16px' }}>
            Select Date:
          </label>
          <DatePicker
            style={{ width: "150px", fontSize: '16px' }}
            format="DD/MM/YYYY"
            disabledDate={(current) => current && current <= new Date()}
            onChange={(date) => setSelectedDate(date)}
          />
        </div>

        {/* Demand Input Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <label style={{ minWidth: '100px', fontSize: '16px' }}>Enter Generation <span style={{fontSize:'12px'}}>(MWh)</span>:</label>
          <input
            type="number"
            placeholder="Enter generation"
            min={0}
            style={{
              width: "150px",
              padding: "5px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
            onChange={(e) => {
              setDemand(e.target.value);
              setAllFieldsFilled(e.target.value !== '' && selectedDate !== null && price !== '' && selectedPortfolio !== null);
            }}
          />
        </div>

        {/* Price Input Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <label style={{ minWidth: '100px', fontSize: '16px' }}>Enter Price <span style={{fontSize:'12px'}}>(INR)</span>:</label>
          <input
            type="number"
            placeholder="Enter price"
            style={{
              width: "150px",
              padding: "5px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
            onChange={(e) => {
              setPrice(e.target.value);
              setAllFieldsFilled(e.target.value !== '' && selectedDate !== null && demand !== '' && selectedPortfolio !== null);
            }}
          />
        </div>
      </div>

      <Col span={12}>
        <Table
          columns={columnsMonth}
          dataSource={tableDemandData}
          pagination={false}
          bordered
          style={{
            width: '100%', // Set width to 100% so it fills the column
            marginLeft:'40%',
            marginTop:'30px',
            overflowY: 'auto', // Makes the table scrollable
          }}
        />
      </Col>

      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col style={{ marginLeft: '80%' }}>
            <Tooltip title={!allFieldsFilled ? "All fields are required" : ""} placement="top">
              <Button onClick={handleAddData} disabled={!allFieldsFilled}>
                Add Data
              </Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title={!dataAdded ? "Add data before continuing" : ""} placement="top">
              <Button onClick={handleNextTrade} disabled={!dataAdded}>
                Continue
              </Button>
            </Tooltip>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PlanMonthTradePageG;
