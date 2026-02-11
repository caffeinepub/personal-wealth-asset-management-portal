@echo off
REM ============================================================================
REM Personal Wealth & Asset Management Portal - Windows Launcher (Batch)
REM Version 11
REM ============================================================================
REM This script starts a local web server to run the app on Windows.
REM It checks for Node.js and starts the server automatically.
REM ============================================================================

echo.
echo ========================================================================
echo   Personal Wealth ^& Asset Management Portal - Windows Launcher
echo   Version 11
echo ========================================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo.
    echo This launcher requires Node.js to run the local server.
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    echo After installing Node.js:
    echo   1. Restart this script
    echo   2. Or follow the manual instructions in WINDOWS_RUN_INSTRUCTIONS.txt
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detected
echo.

REM Check if npx is available
where npx >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npx is not available.
    echo.
    echo Please reinstall Node.js from: https://nodejs.org/
    echo Make sure to include npm and npx during installation.
    echo.
    pause
    exit /b 1
)

echo [OK] npx detected
echo.

REM Check if app folder exists
if not exist "app" (
    echo [ERROR] App folder not found!
    echo.
    echo Please make sure you extracted the ZIP file completely.
    echo The "app" folder should be in the same directory as this script.
    echo.
    pause
    exit /b 1
)

echo [OK] App folder found
echo.

REM Start the server
echo ========================================================================
echo   Starting local web server...
echo ========================================================================
echo.
echo The app will be available at: http://localhost:3000
echo.
echo IMPORTANT:
echo   - Keep this window open while using the app
echo   - Press Ctrl+C to stop the server
echo   - Open http://localhost:3000 in your browser
echo.
echo ========================================================================
echo.

REM Start the server with SPA routing support
npx serve app -l 3000 -s

REM If server exits, pause to show any error messages
echo.
echo ========================================================================
echo   Server stopped
echo ========================================================================
echo.
pause

