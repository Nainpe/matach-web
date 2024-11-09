import React from 'react';
import styles from './ApprovalMessage.module.css';

interface Message {
  id: number;
  text: string;
}

interface ApprovalMessageProps {
  messages: Message[];
  onRemove: (id: number) => void;
}

const ApprovalMessage: React.FC<ApprovalMessageProps> = ({ messages, onRemove }) => {
  return (
    <div className={styles.approvalMessagesContainer}>
      {messages.map((message) => (
        <div key={message.id} className={styles.approvalMessageContainer}>
          <div className={styles.approvalMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.approvalIcon}>
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l5 5l10 -10" />
            </svg>
            <span>{message.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApprovalMessage;