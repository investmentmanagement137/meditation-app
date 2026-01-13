@echo off
echo ==========================================
echo      Deploying to GitHub Pages...
echo ==========================================

:: 0. Commit any pending changes (Fixes)
echo [0/4] Committing changes...
git add .
git commit -m "Auto-commit from deploy script"
:: Ignore commit errors (e.g. nothing to commit)

:: 1. Build the project
echo [1/4] Building project...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed.
    pause
    exit /b
)

:: 2. Deploy using gh-pages tool directly
echo [2/4] Uploading to GitHub...
:: We use the installed gh-pages tool but run it explicitly with node to avoid path issues
:: Adding --dotfiles to ensure everything is uploaded
call npx gh-pages -d dist -u "investmentmanagement137 <investmentmanagement137@users.noreply.github.com>" -r https://github.com/investmentmanagement137/meditation-app.git

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Deployment failed.
    echo Please make sure you are logged into Git.
    pause
    exit /b
)

echo.
echo ==========================================
echo      SUCCESS! Website Deployed.
echo ==========================================
echo.
echo It may take 1-2 minutes for changes to appear.
echo Visit: https://investmentmanagement137.github.io/meditation-app/
echo.
pause
