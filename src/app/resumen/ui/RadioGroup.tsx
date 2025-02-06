'use client';

import React from 'react';
import styles from './RadioGroup.module.css';

interface RadioGroupProps<T extends string> {
  title: string;
  options: { 
    value: T; 
    label: string; 
    info?: string;
    price?: string;
  }[];
  selectedValue: T;
  onChange: (value: T) => void;
}

const RadioGroup = <T extends string>({ 
  title, 
  options, 
  selectedValue, 
  onChange 
}: RadioGroupProps<T>) => {
  return (
    <div className={styles.radioGroup}>
      <h4 className={styles.title}>{title}</h4>
      {options.map((option) => (
        <div className={styles.radioContainer} key={option.value}>
          <label className={styles.label}>
            <input
              type="radio"
              name={title}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className={styles.input}
            />
            <div className={styles.labelContent}>
              <div className={styles.labelHeader}>
                <span className={styles.labelTitle}>{option.label}</span>
                {option.price && (
                  <span className={styles.price}>{option.price}</span>
                )}
              </div>
              {option.info && (
                <p className={styles.info}>{option.info}</p>
              )}
            </div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;
