@echo off
setlocal
cd /d "%~dp0"
title Labour App Runner

echo ===================================================
echo   Starting Labour App...
echo ===================================================

REM Stop any running Node.js processes
taskkill /F /IM node.exe >nul 2>nul

REM Open Chrome
start "" cmd /c "timeout /t 4 >nul && start chrome --new-window http://localhost:3000"

REM Start Server
if exist "node_modules\next\dist\bin\next" (
    node "node_modules\next\dist\bin\next" dev -H 0.0.0.0
) else (
    call npm install
    node "node_modules\next\dist\bin\next" dev -H 0.0.0.0
)

pause
