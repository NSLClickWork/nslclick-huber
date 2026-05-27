@echo off
title NSL Click - Host Mode
color 0A
cls

echo ====================================================================
echo           NSL CLICK - MAY BAN LA HOST (Thay cho Vercel)
echo ====================================================================
echo.

:: Get local IP
set LOCAL_IP=127.0.0.1
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set LOCAL_IP=%%a
    goto :found
)
:found
set LOCAL_IP=%LOCAL_IP: =%

echo [1/2] Khoi dong server...
start /MIN "NSL-Server" cmd /c "npm run dev"
timeout /t 3 >nul

echo [2/2] Dang tao link chia se HTTPS co dinh...
echo.
echo ====================================================================
echo   LINK NOI BO (chung Wi-Fi):  http://%LOCAL_IP%:3000
echo   LINK CO DINH (cho nguoi khac): https://finale-chute-prism.ngrok-free.dev
echo ====================================================================
echo.
echo   Link nay co dinh vinh vien, ban kia co the bookmark dung mai mai!
echo   Luu y: phai luon mo cua so CMD nay de ban kia truy cap duoc.
echo.
echo --------------------------------------------------------------------

npx ngrok http 3000 --url https://finale-chute-prism.ngrok-free.dev
