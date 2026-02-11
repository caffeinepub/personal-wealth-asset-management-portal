# ============================================================================
# Personal Wealth & Asset Management Portal - Windows Launcher (PowerShell)
# Version 11
# ============================================================================
# This script starts a local web server to run the app on Windows.
# It checks for Node.js or Python and starts an appropriate server.
# ============================================================================

Write-Host ""
Write-Host "========================================================================"
Write-Host "  Personal Wealth & Asset Management Portal - Windows Launcher"
Write-Host "  Version 11"
Write-Host "========================================================================"
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Check if app folder exists
if (-not (Test-Path "app")) {
    Write-Host "[ERROR] App folder not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please make sure you extracted the ZIP file completely."
    Write-Host "The 'app' folder should be in the same directory as this script."
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] App folder found" -ForegroundColor Green
Write-Host ""

# Try Node.js first (recommended)
if (Test-Command "node") {
    Write-Host "[OK] Node.js detected" -ForegroundColor Green
    
    if (Test-Command "npx") {
        Write-Host "[OK] npx detected" -ForegroundColor Green
        Write-Host ""
        Write-Host "========================================================================"
        Write-Host "  Starting local web server with Node.js..."
        Write-Host "========================================================================"
        Write-Host ""
        Write-Host "The app will be available at: http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "IMPORTANT:" -ForegroundColor Yellow
        Write-Host "  - Keep this window open while using the app"
        Write-Host "  - Press Ctrl+C to stop the server"
        Write-Host "  - Open http://localhost:3000 in your browser"
        Write-Host ""
        Write-Host "========================================================================"
        Write-Host ""
        
        # Start the server with SPA routing support
        npx serve app -l 3000 -s
        
        Write-Host ""
        Write-Host "========================================================================"
        Write-Host "  Server stopped"
        Write-Host "========================================================================"
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 0
    }
    else {
        Write-Host "[WARNING] npx not found" -ForegroundColor Yellow
        Write-Host "Please reinstall Node.js from: https://nodejs.org/"
        Write-Host ""
    }
}

# Try Python as fallback
if (Test-Command "python") {
    Write-Host "[OK] Python detected" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================================================"
    Write-Host "  Starting local web server with Python..."
    Write-Host "========================================================================"
    Write-Host ""
    Write-Host "The app will be available at: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "IMPORTANT:" -ForegroundColor Yellow
    Write-Host "  - Keep this window open while using the app"
    Write-Host "  - Press Ctrl+C to stop the server"
    Write-Host "  - Open http://localhost:3000 in your browser"
    Write-Host ""
    Write-Host "NOTE: Python's server doesn't support SPA routing." -ForegroundColor Yellow
    Write-Host "      You may need to refresh if navigation doesn't work."
    Write-Host "      For best experience, install Node.js from https://nodejs.org/"
    Write-Host ""
    Write-Host "========================================================================"
    Write-Host ""
    
    # Change to app directory and start Python server
    Set-Location app
    python -m http.server 3000
    Set-Location ..
    
    Write-Host ""
    Write-Host "========================================================================"
    Write-Host "  Server stopped"
    Write-Host "========================================================================"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 0
}

# No suitable runtime found
Write-Host "[ERROR] No suitable runtime found!" -ForegroundColor Red
Write-Host ""
Write-Host "This launcher requires either Node.js or Python to run the local server."
Write-Host ""
Write-Host "Please install one of the following:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  RECOMMENDED: Node.js" -ForegroundColor Cyan
Write-Host "    Download from: https://nodejs.org/"
Write-Host "    Provides the best experience with SPA routing support"
Write-Host ""
Write-Host "  ALTERNATIVE: Python 3" -ForegroundColor Cyan
Write-Host "    Download from: https://www.python.org/"
Write-Host "    Basic server without SPA routing"
Write-Host ""
Write-Host "After installation:" -ForegroundColor Yellow
Write-Host "  1. Restart this script"
Write-Host "  2. Or follow manual instructions in WINDOWS_RUN_INSTRUCTIONS.txt"
Write-Host ""
Write-Host "========================================================================"
Write-Host ""
Read-Host "Press Enter to exit"
exit 1

