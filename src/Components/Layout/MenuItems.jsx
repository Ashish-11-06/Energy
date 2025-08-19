import React from 'react';
import { Link } from 'react-router-dom';
import dash from '../../assets/dashboard.png';
import transaction from '../../assets/transaction.png';
import subscription from '../../assets/subscription.png';
import consumption from '../../assets/consumption.png';
import invoice from '../../assets/invoice.png';
import profile from '../../assets/profile.png';
import offerSend from '../../assets/offerSend.png';
import portfolio from '../../assets/portfolio.png';
import findConsumer from '../../assets/findConsumer.png';




// Define menu items for consumer and generator with icons
export const consumerMenuItems = [
  { key: '1', icon: <img src={dash} alt="" style={{ width: '20px', height: '20px' }} />, label: <Link to="/consumer/dashboard">Dashboard</Link> },
  { key: '2', icon: <img src={consumption} alt="" style={{ width: '20px', height: '20px' }} />, label: <Link to="/consumer/requirement">Consumption Unit</Link> },
  { key: '3', icon: <img src={findConsumer} alt="" style={{ width: '20px', height: '20px' }} />, label: <Link to="/consumer/matching-ipp">Matching IPP</Link> },
  { key: '4', icon: <img src={findConsumer} alt="" style={{ width: '20px', height: '20px' }} />, label: <Link to="/consumer/rooftop">Onsite RE options</Link> },
  { key: '5', icon: <img src={transaction} alt="" style={{ width: '20px', height: '20px' }}/> , label: <Link to="/transaction-page">Transaction Window</Link> },
  { key: '6', icon: <img src={offerSend} alt="" style={{ width: '20px', height: '20px' }}/> , label: <Link to="/offers">Offers</Link> },
  // { key: '6', icon: <img src={subscription} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/subscription-plan">Subscription Plan</Link> },
  // { key: '7', icon: <img src={invoice} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/invoice">Invoice</Link> },
  { key: '8', icon: <img src={profile} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/consumer/profile">Profile</Link> },
  // { key: '10', icon: <img src={track} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/consumer/status">Track Status</Link> }
];

export const generatorMenuItems = [
  { key: '9', icon: <img src={dash} alt="" style={{ width: '20px', height: '20px' }} />, label: <Link to="/generator/dashboard">Dashboard</Link> },
  { key: '10', icon: <img src={portfolio} alt="" style={{ width: '20px', height: '20px' }} />, label: <Link to="/generator/portfolio">Portfolio</Link> },
  { key: '18', icon: <img src={findConsumer} alt="" style={{ width: '20px', height: '20px' }} />, label: <Link to="/generator/matching-consumer">Find Consumer</Link> },
  { key: '19', icon: <img src={invoice} alt="" style={{ width: '20px', height: '20px' }} />, label: <Link to="/generator/GeneratorInput">Capacity Sizing</Link> },
  
  { key: '11', icon: <img src={transaction} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/transaction-page">Transaction Window</Link> },
  { key: '12', icon: <img src={offerSend} alt="" style={{ width: '20px', height: '20px' }}/> , label: <Link to="/offers">Offers</Link> },
  // { key: '13', icon: <img src={subscription} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/subscription-plan">Subscription Plan</Link> },
  // { key: '14', icon: <img src={invoice} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/invoice">Invoice</Link> },
  { key: '16', icon: <img src={profile} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/generator/profile">Profile</Link> },
  // { key: '17', icon: <img src={track} alt="" style={{ width: '20px', height: '20px' }}/>, label: <Link to="/generator/status">Track Status</Link> }
];
