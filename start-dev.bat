@echo off
echo ================================
echo Starting Development Environment
echo ================================

REM Start Server
echo Starting Server...
start "Server" cmd /k "cd /d %~dp0server && node server.js"

REM Wait for server to start
timeout /t 3 /nobreak

REM Start Client
echo Starting Client...
start "Client" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ================================
echo All services started!
echo ================================
echo Server and Client are running in separate windows.
echo Close those windows to stop the services.