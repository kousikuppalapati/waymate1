@echo off
setlocal
start "Waymate Backend" cmd /k "cd /d %~dp0backend && npm install && npm run dev"
start "Waymate Frontend" cmd /k "cd /d %~dp0 && npm install && npm run dev"
endlocal
