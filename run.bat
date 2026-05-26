@echo off
title NSL Click - Startup Control Panel
color 0C
cls

echo ====================================================================
echo             NSL CLICK - HUBER PORTAL STARTUP PANEL
echo ====================================================================
echo.

:: Get local IP address dynamically
set LOCAL_IP=127.0.0.1
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set LOCAL_IP=%%a
    goto :ip_found
)
:ip_found
:: Strip spaces from IP
set LOCAL_IP=%LOCAL_IP: =%

echo [+] Starting Local Server on Port 3000...
start "NSL Server (Port 3000)" cmd /c "npm run dev"
echo [i] Waiting for server to boot...
timeout /t 4 >nul

echo.
echo ====================================================================
echo   CHOOSE SHARING PORTAL METHOD:
echo ====================================================================
echo   [1] Local Wi-Fi Network Only (http://%LOCAL_IP%:3000)
echo   [2] Public HTTPS Tunnel (via Localhost.run - No setup needed)
echo   [3] Public HTTPS Tunnel (via Localtunnel - Requires Node/NPM)
echo ====================================================================
echo.

set /p choice="Enter your option (1-3) and press Enter: "

if "%choice%"=="1" (
    echo.
    echo [OK] Server is running locally!
    echo [i] Share this URL with any device connected to the SAME Wi-Fi network:
    echo     👉 http://%LOCAL_IP%:3000
    echo.
    echo Press any key to exit this panel (server will continue running).
    pause >nul
    exit
)

if "%choice%"=="2" (
    echo.
    echo [OK] Launching Localhost.run HTTPS tunnel...
    start "NSL Tunnel (Localhost.run)" cmd /k "echo Welcome to Localhost.run! && echo Copy the HTTPS url below to share: && ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 nokey@localhost.run"
    exit
)

if "%choice%"=="3" (
    echo.
    echo [OK] Launching Localtunnel HTTPS tunnel...
    start "NSL Tunnel (Localtunnel)" cmd /k "echo Welcome to Localtunnel! && npx -y localtunnel --port 3000"
    exit
)

echo [!] Invalid option. Starting Local Server only.
pause
