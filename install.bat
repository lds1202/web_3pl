@echo off
echo 3PL 물류대행 플랫폼 설치를 시작합니다...

echo.
echo 1. Node.js 버전 확인...
node --version
if %errorlevel% neq 0 (
    echo Node.js가 설치되어 있지 않습니다. https://nodejs.org 에서 설치해주세요.
    pause
    exit /b 1
)

echo.
echo 2. npm 버전 확인...
npm --version
if %errorlevel% neq 0 (
    echo npm이 설치되어 있지 않습니다.
    pause
    exit /b 1
)

echo.
echo 3. 의존성 설치 중...
npm install

if %errorlevel% neq 0 (
    echo 의존성 설치에 실패했습니다.
    pause
    exit /b 1
)

echo.
echo 4. 설치 완료!
echo.
echo 다음 명령어로 개발 서버를 시작할 수 있습니다:
echo npm run dev
echo.
echo 브라우저에서 http://localhost:3000 으로 접속하세요.
echo.
pause




