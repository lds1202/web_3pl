import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">3PL Platform</h3>
            <p className="text-gray-300 mb-4">
              화주사와 물류 창고업체를 연결하는 물류대행 매칭 플랫폼입니다.
            </p>
            <div className="text-gray-300">
              <p>대표: 홍길동</p>
              <p>사업자등록번호: 123-45-67890</p>
              <p>주소: 서울특별시 강남구 테헤란로 123</p>
              <p>전화: 02-1234-5678</p>
              <p>이메일: info@3plplatform.com</p>
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">서비스</h4>
            <ul className="space-y-2">
              <li><a href="/warehouse-search" className="text-gray-300 hover:text-white">창고 찾기</a></li>
              <li><a href="/customer-search" className="text-gray-300 hover:text-white">고객사 찾기</a></li>
              <li><a href="/warehouse-register" className="text-gray-300 hover:text-white">창고 등록</a></li>
              <li><a href="/customer-register" className="text-gray-300 hover:text-white">고객사 등록</a></li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2">
              <li><a href="/faq" className="text-gray-300 hover:text-white">자주 묻는 질문</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">문의하기</a></li>
              <li><a href="/support" className="text-gray-300 hover:text-white">고객지원</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              <a href="/terms" className="hover:text-white mr-4">이용약관</a>
              <a href="/privacy" className="hover:text-white mr-4">개인정보처리방침</a>
              <a href="/refund" className="hover:text-white">환불정책</a>
            </div>
            <div className="text-gray-300 text-sm mt-4 md:mt-0">
              © 2024 3PL Platform. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



