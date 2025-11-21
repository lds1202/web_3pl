import CryptoJS from 'crypto-js';

/**
 * 비밀번호를 SHA-256으로 해싱
 * @param {string} password - 평문 비밀번호
 * @returns {string} - 해싱된 비밀번호
 */
export const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

/**
 * 입력된 비밀번호와 저장된 해싱된 비밀번호 비교
 * 기존 평문 비밀번호와의 호환성도 지원
 * @param {string} inputPassword - 사용자가 입력한 평문 비밀번호
 * @param {string} storedPassword - 저장된 비밀번호 (해싱된 값 또는 평문)
 * @returns {boolean} - 일치 여부
 */
export const comparePassword = (inputPassword, storedPassword) => {
  if (!storedPassword) return false;
  
  // 해싱된 비밀번호와 비교
  const hashedInput = hashPassword(inputPassword);
  if (hashedInput === storedPassword) {
    return true;
  }
  
  // 기존 평문 비밀번호와의 호환성 (마이그레이션용)
  // 해싱된 비밀번호는 64자리 16진수 문자열이므로, 그렇지 않으면 평문으로 간주
  if (storedPassword.length !== 64 || !/^[a-f0-9]+$/i.test(storedPassword)) {
    return inputPassword === storedPassword;
  }
  
  return false;
};

