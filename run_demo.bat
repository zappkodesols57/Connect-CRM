@echo off
title Connect CRM Live Demo Launcher
echo ===================================================
echo     Launching Connect CRM (Django + React Live)
echo ===================================================
echo.

echo [1/3] Starting Django Backend on port 8001 via UV...
start "Connect CRM Backend (Django 8001)" cmd /k "cd /d F:\zkconnect\backend && uv run python manage.py runserver 127.0.0.1:8001 --noreload"

timeout /t 2 /nobreak >nul

echo [2/3] Starting React + TypeScript Frontend on port 5174...
start "Connect CRM Frontend (Vite 5174)" cmd /k "cd /d F:\zkconnect\frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening browser at http://localhost:5174 ...
start http://localhost:5174

echo.
echo ===================================================
echo   Connect CRM is now LIVE at http://localhost:5174
echo   Close the two opened command windows to stop.
echo ===================================================
