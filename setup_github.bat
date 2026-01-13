@echo off
echo ==========================================
echo      GitHub Setup: Meditation App
echo ==========================================

:: Check if git is available
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/downloads and try again.
    pause
    exit /b
)

echo.
echo First, we need to configure your Git identity.
echo (This is required by Git to track who made the changes)
echo.

set /p EMAIL="Enter your email address: "
set /p NAME="Enter your name: "

echo.
echo Configuring Git...
git config user.email "%EMAIL%"
git config user.name "%NAME%"

echo.
echo [1/5] Initializing Git...
git init

echo [2/5] Cleaning up previous remote (if any)...
git remote remove origin 2>nul

echo [3/5] Adding remote origin...
git remote add origin https://github.com/investmentmanagement137/meditation-app.git

echo [4/5] Committing files...
git add .
git commit -m "Initial commit: React Meditation App"

echo [5/5] Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ==========================================
echo                 DONE!
echo ==========================================
pause
