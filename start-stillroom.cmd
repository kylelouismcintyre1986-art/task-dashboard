@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing Stillroom dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Starting Stillroom at http://localhost:3000
start "" http://localhost:3000
call npm start
