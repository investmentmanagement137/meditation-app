@echo off
echo [INFO] Committing and Pushing to GitHub...

:: Fix for missing Git path
set "PATH=%PATH%;C:\Program Files\Git\cmd"
git add .
git commit -m "Fix: Force fixed positioning for Bottom Navigation on Android PWA"
git push origin main
echo [INFO] Done! GitHub Action should trigger now.
pause
