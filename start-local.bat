@echo off
cd /d "%~dp0"
where php >nul 2>&1
if errorlevel 1 (
    echo PHP is not installed on this PC.
    echo.
    echo Install XAMPP: https://www.apachefriends.org/
    echo Then copy this project folder into C:\xampp\htdocs\
    echo and open: http://localhost/Vanced-solutions/
    echo.
    pause
    exit /b 1
)
echo.
echo  Local site: http://127.0.0.1:8000
echo  Press Ctrl+C to stop.
echo.
start http://127.0.0.1:8000
php -S 127.0.0.1:8000
