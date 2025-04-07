/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import '../Pages/TrackStatus.css'; // Import the CSS file for styling
import { Card, Table } from 'antd';
import { fetchTrackStatusData } from '../Redux/slices/consumer/trackStatusSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
const approvals = [
    { text: 'Demand added', status: 'green' },
    { text: 'aa', status: 'yellow' },
    
];

const TrackStatusP = () => {
    const user = JSON.parse(localStorage.getItem('user')).user;
    const dispatch = useDispatch();
    const user_category = user?.user_category;
    const titleText = user_category === 'Consumer' ? 'Demand Status' : 'Generation Status'; // Set title based on user category
    const [trackData, setTrackData] = useState([]); // State to hold fetched data

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user_category === 'Consumer') { // Check if user_category is Consumer
                    const res = await dispatch(fetchTrackStatusData(user?.id)).unwrap(); // Await the dispatched action
                    setTrackData(res); // Store the fetched data in state
                }
            } catch (error) {
                console.error("Error fetching trading data:", error);
            }
        };

        fetchData(); // Call the async function
    }, [dispatch, user?.id, user_category]);

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
            title: 'Demand (MW)',
            dataIndex: 'demand',
        },
        {
            title: 'Demand Date',
            dataIndex: 'demand_date',
        },
        {
            title: 'Consumption Unit Details',
            children: [
                {
                    title: 'State',
                    dataIndex: ['consumption_unit_details', 'state'],
                },
                {
                    title: 'Industry',
                    dataIndex: ['consumption_unit_details', 'industry'],
                },
                {
                    title: 'Consumption Unit',
                    dataIndex: ['consumption_unit_details', 'consumption_unit'],
                },
                {
                    title: 'Contracted Demand (MWh)',
                    dataIndex: ['consumption_unit_details', 'contracted_demand'],
                },
               
            ],
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
    ];

    const columns = user_category === 'Consumer' ? conColumns : genColumns;

    return (

        <div style={{ padding: '3%', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Changed background color and set minHeight */}
           {/* <h1>Status</h1> */}
           <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800',fontWeight:'bold' }}>
       {titleText}
      </h1>
            <Card style={{ boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff', width:'80%' }}>
           <Table dataSource={trackData} columns={columns} style={{textAlign:'center'}}  bordered pagination={false}/>
            </Card>
        </div>
 
    );
};

export default TrackStatusP;