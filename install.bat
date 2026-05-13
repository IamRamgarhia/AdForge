@echo off
REM AdForge one-click installer for Windows.
REM Double-click this file. It will:
REM   1. Verify Node.js is installed
REM   2. Run `npm install` to fetch dependencies
REM   3. Print next-step instructions

setlocal
cd /d "%~dp0"

echo.
echo ==================================================
echo  AdForge installer
echo  by Dicecodes
echo ==================================================
echo.

REM --- Step 1: Node.js ---
echo Checking for Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed.
    echo.
    echo Download and install Node.js 20 or newer from:
    echo   https://nodejs.org/en/download
    echo.
    echo Then double-click install.bat again.
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo Found Node %NODE_VER%
echo.

REM --- Step 2: Install dependencies ---
echo Installing dependencies (this may take a few minutes the first time)...
echo.
call npm install --no-audit --no-fund
if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed. Read the error above.
    echo.
    pause
    exit /b 1
)

REM --- Step 3: Make sure data folder exists ---
if not exist data mkdir data
echo {} > data\snapshot.json.placeholder
del data\snapshot.json.placeholder >nul 2>&1

echo.
echo ==================================================
echo  Install complete.
echo ==================================================
echo.
echo Next steps:
echo   1. Double-click start.bat to launch AdForge
echo   2. Open http://localhost:3005 in your browser
echo   3. Follow the 5-step onboarding wizard
echo.
echo Your data lives in:
echo   %CD%\data\snapshot.json
echo Zip this folder to move AdForge + your work to another machine.
echo.
pause
