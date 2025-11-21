// 면적 변환 유틸리티 함수
export const convertToPyeong = (squareMeters) => {
  const pyeong = Math.round(squareMeters * 0.3025);
  return pyeong;
};

export const formatArea = (squareMeters) => {
  const pyeong = convertToPyeong(squareMeters);
  return `${squareMeters.toLocaleString()}㎡(${pyeong}평)`;
};

export const formatAreaShort = (squareMeters) => {
  const pyeong = convertToPyeong(squareMeters);
  return `${squareMeters.toLocaleString()}㎡(${pyeong}평)`;
};
