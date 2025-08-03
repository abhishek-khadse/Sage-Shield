@echo off
setlocal enabledelayedexpansion

echo Starting Sage Shield...

:: Set Anaconda paths
set "ANACONDA_PATH=C:\Users\abhis\anaconda3"
set "CONDA_EXE=%ANACONDA_PATH%\Scripts\conda.exe"
set "ACTIVATE_BAT=%ANACONDA_PATH%\Scripts\activate.bat"

:: Verify Anaconda installation
echo Verifying Anaconda installation...
if not exist "%CONDA_EXE%" (
    echo Error: conda.exe not found at %CONDA_EXE%
    echo Please verify your Anaconda installation.
    pause
    exit /b 1
)

echo Found Anaconda at: %ANACONDA_PATH%

:: Add Anaconda to PATH
set "PATH=%ANACONDA_PATH%;%ANACONDA_PATH%\Scripts;%ANACONDA_PATH%\Library\bin;%PATH%"

:: Create environment if it doesn't exist
echo Checking for sageshield_env...
"%CONDA_EXE%" env list | find "sageshield_env" >nul
if %ERRORLEVEL% NEQ 0 (
    echo Creating sageshield_env...
    "%CONDA_EXE%" create -n sageshield_env python=3.9 -y
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to create environment
        pause
        exit /b 1
    )
)

:: Activate environment
echo Activating sageshield_env...
call "%ACTIVATE_BAT%" sageshield_env
if %ERRORLEVEL% NEQ 0 (
    echo Failed to activate sageshield_env
    pause
    exit /b 1
)

:: Install required packages
echo Installing Python dependencies...
cd backend
call pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install Python dependencies
    pause
    exit /b 1
)

cd ..
echo Environment setup complete!

:: Start backend server
echo Starting backend server...
start "SageShield Backend" cmd /k "call "%ACTIVATE_BAT%" sageshield_env && cd backend && echo Backend directory: %CD% && python --version && pip list && echo Starting server... && python run.py"

:: Wait a moment for backend to start
timeout /t 5 >nul

:: Start frontend server
echo Starting frontend server...
start "SageShield Frontend" cmd /k "cd frontend && echo Frontend directory: %CD% && call npm install && call npm run dev"

echo.
echo ===================================
echo Sage Shield is starting up...
echo.
echo Backend should be running at:  http://localhost:5000
echo Frontend should be running at: http://localhost:3000
echo.
echo If the dashboard is empty, please check:
echo 1. The backend server is running (check the backend console window)
echo 2. There are no errors in the browser's developer console (F12)
echo 3. The API endpoints are accessible (try http://localhost:5000/api/status in your browser)
echo.
echo ===================================
echo Note: This window can be closed.
echo ===================================

timeout /t 5 >nul

echo.
echo Sage Shield is starting up...
echo Backend will be available at http://localhost:5000
echo Frontend will be available at http://localhost:5173
echo.
echo Press any key to close all servers...
pause >nul

:: Kill all node and python processes started by this script
taskkill /F /FI "WINDOWTITLE eq SageShield Backend*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq SageShield Frontend*" >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1