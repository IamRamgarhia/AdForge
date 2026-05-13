@echo off
REM AdForge start — launches the local-sync sidecar + Next.js dev server.
REM Double-click this file. Two console windows will open. Close them or run
REM stop.bat to shut down.

setlocal
cd /d "%~dp0"

REM Make sure node_modules exists
if not exist node_modules (
    echo node_modules missing. Running install first...
    call install.bat
    if errorlevel 1 exit /b 1
)

REM Make sure data folder exists
if not exist data mkdir data

REM Record PIDs for stop.bat
del .ados-pids.txt >nul 2>&1

echo Starting AdForge...
echo.
echo Sidecar:    http://127.0.0.1:3006  (local data sync to data\snapshot.json)
echo Web app:    http://localhost:3005   (open this in your browser)
echo.

REM Launch sidecar in a new window
start "adforge sync" cmd /c "node scripts\local-sync.cjs"

REM Brief pause so sidecar is up before the app probes it
ping -n 2 127.0.0.1 >nul

REM Launch the Next.js dev server in this window
echo Press Ctrl+C in this window or run stop.bat to shut down.
echo.
call npx next dev -p 3005
