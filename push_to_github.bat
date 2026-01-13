@echo off
echo [INFO] Committing and Pushing to GitHub...
git add .
git commit -m "UI Refinements and Gemini Integration"
git push origin main
echo [INFO] Done! GitHub Action should trigger now.
pause
