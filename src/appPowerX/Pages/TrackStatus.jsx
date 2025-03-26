/* eslint-disable no-unused-vars */
import React from 'react';
import '../Pages/TrackStatus.css'; // Import the CSS file for styling
import { Card, Table } from 'antd';

const approvals = [
    { text: 'Demand added', status: 'green' },
    { text: 'aa', status: 'yellow' },
    
];

const TrackStatusP = () => {
    const user = JSON.parse(localStorage.getItem('user')).user;
    const user_category = user?.user_category;

    const genColumns = [
        {
            title:'Generation (MW)',
            dataIndex: 'demand',
        },
        {
            title:'Generation Date',
            dataIndex: 'demand_date',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
    ];

    const conColumns = [
        {
            title:'Demand (MW)',
            dataIndex: 'demand',
        },
        {
            title:'Demand Date',
            dataIndex: 'demand_date',
        },
        {
            title:'Consumption Unit Details',
            dataIndex: 'consumption_unit_details',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
    ];

    const columns = user_category === 'Consumer' ? conColumns : genColumns;

    const trackData=[
        { demand: 200,demand_date:'15-03-2025', status: 'draft ',consumption_unit_details:'State: Maharashtra, Industry: energy, Contracted Demand: 80 MWh, Consumption Unit: ewr' },
        { demand: 300,demand_date:'16-03-2025', status: 'submitted to trader ',consumption_unit_details:'State: Madhya Pradesh, Industry: energy, Contracted Demand: 180 MWh, Consumption Unit: ewr' },
        { demand: 400,demand_date:'17-03-2025', status: 'trade executed  ',consumption_unit_details:'State: Maharashtra, Industry: energy, Contracted Demand: 100 MWh, Consumption Unit: pune' },
        { demand: 100,demand_date:'18-03-2025', status: 'trade failed ' ,consumption_unit_details:'State: Madhya Pradesh, Industry: energy, Contracted Demand: 150 MWh, Consumption Unit: ewr'},
    ];

    return (

        <div style={{ padding: '3%', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Changed background color and set minHeight */}
           {/* <h1>Status</h1> */}
           <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800',fontWeight:'bold' }}>
        Demand Status
      </h1>
            <Card style={{ boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff', width:'80%' }}>
           <Table dataSource={trackData} columns={columns} style={{textAlign:'center'}}  bordered pagination={false}/>
            </Card>
        </div>
 
    );
};

export default TrackStatusP;