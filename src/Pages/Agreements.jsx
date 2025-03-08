import React, { useState } from 'react';
import { Button } from 'antd';
import AgreementModal from '../Components/Modals/AgreementModal';

const Agreements = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Welcome to the Main Page</h2>
      <Button type="primary" onClick={showModal}>
        Open Term Sheet Agreement
      </Button>
      <AgreementModal visible={modalVisible} onClose={handleCloseModal} />
    </div>
  );
};

export default Agreements;