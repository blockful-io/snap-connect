import React, { useState } from "react";
import "./Select.css";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  defaultValue?: Option;
  onChange?: (option: Option) => void;
}

export const Select: React.FC<SelectProps> = ({
  options,
  defaultValue,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option>(
    defaultValue || options[0]
  );

  const handleOptionChange = (option: Option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className="custom-select">
      <select
        value={selectedOption.value}
        onChange={(event) =>
          handleOptionChange(
            options.find((option) => option.value === event.target.value)!
          )
        }
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="arrow"></span>
    </div>
  );
};
