import React, { useState } from "react";
import { Modal, Button, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";

const TermsAndConditionModal = ({ visible, onCancel, user_category }) => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleContinue = () => {
    if (isChecked) {
      user_category === 'Consumer'? navigate("/consumer/requirement") : navigate("/generator/portfolio");
    }
  };
  return (
    <Modal
      title="Terms and Conditions"
      open={visible}
      onCancel={onCancel}
      cancelButtonProps={false}
      footer={[
       
      ]}
      width={800}
    >
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <h3>Introduction</h3>
        <p>
          <p>Terms of Use</p>
          <br />
          <p>
            This eProcurement Portal is designed, developed, and hosted by EXT,
            in consultation with [Relevant Organization/Department], to ensure a
            seamless and efficient procurement process{" "}
          </p>
          <br />
          <p>
            Though all efforts have been made to ensure the accuracy and
            correctness of the content on this Portal, the same should not be
            construed as a statement of law or used for any legal purposes. EXT
            accepts no responsibility in relation to the accuracy, completeness,
            usefulness, or otherwise of the contents. Users are advised to
            verify/check any information with the relevant authorities and/or
            other sources and to obtain appropriate professional advice before
            acting on the information provided in the Portal.
          </p>
          <p>Users are hereby</p>
          Users are informed not to use, display, upload, modify, publish,
          transmit, update, share, or store any information that: Belongs to
          another person. Is harmful, threatening, abusive, harassing,
          blasphemous, objectionable, defamatory, vulgar, obscene, pornographic,
          pedophilic, libelous, invasive of another’s privacy, hateful, or
          racially, ethnically, or otherwise objectionable. Encourages money
          laundering, gambling, or is otherwise unlawful in any manner. Harms
          minors in any way. Infringes any patent, trademark, copyright, or
          other proprietary rights. Violates any law in force. Discloses
          sensitive personal information without authorization. Causes
          annoyance, inconvenience, or misleads users about the origin of
          messages. Contains software viruses or any other computer code
          designed to disrupt or limit the functionality of any system.
          Threatens the unity, integrity, defense, security, or sovereignty of
          any country or public order. If any user violates these terms, EXT
          Energy reserves the right to immediately block access without notice
          upon verification of the violation. Disclaimer All efforts have been
          made to ensure the accuracy and correctness of the content on this
          portal. However, EXG Global does not guarantee the completeness or
          reliability of the information. Users should verify details with the
          relevant authorities before acting upon them. EXG Global is not
          responsible for any loss or damage resulting from the use of this
          portal. Copyright Policy The content published on this portal is
          primarily owned by EXG Global. Users may reproduce material only with
          prior permission and must acknowledge the source. However, any
          third-party content is subject to copyright, and permission must be
          obtained from the respective copyright holders. Privacy Policy EXT
          Energy does not collect personal information without user consent. Any
          personal data provided will be securely stored and not shared with
          third parties. The company logs visitor data such as IP addresses,
          browser type, and visit duration but does not link this information to
          individual users. Hyperlinking Policy External links on this portal
          are provided for user convenience. EXG Global is not responsible for
          the content of linked websites and does not endorse any views
          expressed on them. 
        </p>
        <div>
         
        </div>
        
      </div>
      <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <span style={{ marginRight: "10px",color:'rgb(154, 132, 6)' }}>
              {" "}
              Accept terms and conditions
            </span>
          </label>
      <Tooltip title={!isChecked ? "Please accept terms and condition" : ""}>
        <Button onClick={handleContinue} disabled={!isChecked} type="primary">
          Continue
        </Button>
      </Tooltip>
    </Modal>
  );
};

export default TermsAndConditionModal;
