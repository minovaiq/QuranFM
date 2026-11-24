@echo off
cd /d "%~dp0"
where py >nul 2>nul
if errorlevel 1 (echo Install Python 3 first, or use any static web server. & pause & exit /b 1)
start "" http://localhost:8080
py -3 -m http.server 8080 --bind 127.0.0.1
