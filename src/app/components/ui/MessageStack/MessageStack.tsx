import React from 'react';
import styles from './MessageStack.module.css';

interface Message {
  id: number;
  text: string;
}

interface MessageStackProps {
  errorMessages: Message[];
  approvalMessages: Message[];
  onRemoveError: (id: number) => void;
  onRemoveApproval: (id: number) => void;
}

const MessageStack: React.FC<MessageStackProps> = ({
  errorMessages,
  approvalMessages,
  onRemoveError,
  onRemoveApproval
}) => {
  const combinedMessages = [...errorMessages, ...approvalMessages].sort((a, b) => a.id - b.id); // Combina y ordena los mensajes

  return (
    <div className={styles.messageStack}>
      {combinedMessages.map((message) => {
        const isError = errorMessages.some((error) => error.id === message.id);
        return (
          <div key={message.id} className={isError ? styles.errorMessageContainer : styles.approvalMessageContainer}>
            <div className={isError ? styles.errorMessage : styles.approvalMessage}>
              <span>{message.text}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageStack;
