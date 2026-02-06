@echo off
setlocal
cd /d "%~dp0"
title Labour App Index

echo ===================================================
echo   Starting Labour App...
echo ===================================================

REM Stop any running Node.js processes to avoid port conflicts
taskkill /F /IM node.exe >nul 2>nul

REM Open Chrome in a new window after 4 seconds
echo   Browser will open shortly...
start "" cmd /c "timeout /t 4 >nul && start chrome --new-window http://localhost:3000"

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install it from https://nodejs.org/
    pause
    exit /b 1
)

REM Start the Next.js Server
if exist "node_modules\next\dist\bin\next" (
    echo   Server starting...
    node "node_modules\next\dist\bin\next" dev -H 0.0.0.0
) else (
    echo [WARNING] Dependencies not found. Installing...
    call npm install
    echo   Server starting...
    node "node_modules\next\dist\bin\next" dev -H 0.0.0.0
)

if %errorlevel% neq 0 (
    echo [ERROR] Server stopped with error code %errorlevel%
    pause
)
