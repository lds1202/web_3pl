import React, { useState } from 'react';

const TestInput = () => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    setValue(numericValue);
  };

  return (
    <div className="p-4 border-2 border-red-500 rounded-lg bg-yellow-50">
      <h3 className="text-lg font-bold mb-4">독립 테스트 입력</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">테스트 입력:</label>
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            placeholder="숫자만 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-2 text-sm text-gray-600">
            현재 값: <strong>{value || '없음'}</strong>
          </p>
        </div>

        <div className="bg-blue-100 p-3 rounded">
          <p className="text-sm">
            <strong>테스트 방법:</strong><br />
            1. "1234"를 빠르게 연속으로 타이핑해보세요<br />
            2. 모든 숫자가 제대로 입력되는지 확인하세요<br />
            3. 콘솔에서 로그를 확인하세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestInput;
