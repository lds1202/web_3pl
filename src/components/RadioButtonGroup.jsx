import React from 'react';

const RadioButtonGroup = ({ label, options, value, onChange, name }) => {
  return (
    <div className="mt-3">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors bg-white"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonGroup;
