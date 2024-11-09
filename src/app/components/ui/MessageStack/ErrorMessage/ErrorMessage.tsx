import React from 'react';
import styles from './ErrorMessage.module.css';

interface Message {
  id: number;
  text: string;
}

interface ErrorMessageProps {
  messages: Message[];
  onRemove: (id: number) => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ messages, onRemove }) => {
  return (
    <div className={styles.errorMessagesContainer}>
      {messages.map((message) => (
        <div key={message.id} className={styles.errorMessageContainer}>
          <div className={styles.errorMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.errorIcon}>
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 9v4" />
              <path d="M12 16v.01" />
            </svg>
            <span>{message.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ErrorMessage;