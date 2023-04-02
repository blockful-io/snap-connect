import React, { useState } from 'react';
import './AlertPopover.css';
import { FaTimes } from 'react-icons/fa';

interface AlertProps {
  message: string;
  type: 'success' | 'error';
}

const AlertPopover: React.FC<AlertProps> = ({ message, type }) => {
  const [showPopover, setShowPopover] = useState(true);

  const handlePopoverClose = () => {
    setShowPopover(false);
  };

  const getAlertTypeClassName = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      default:
        return '';
    }
  };

  return (
    <>
      {showPopover && (
        <div className={`alert-popover ${getAlertTypeClassName()}`}>
          <div className="alert-message">{message}</div>
          <div className="alert-close" onClick={handlePopoverClose}>
            <FaTimes />
          </div>
        </div>
      )}
    </>
  );
};

export default AlertPopover;