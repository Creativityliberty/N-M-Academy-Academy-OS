@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
if "%~1"=="" goto menu
if /I "%~1"=="up" goto up
if /I "%~1"=="down" goto down
if /I "%~1"=="restart" goto restart
if /I "%~1"=="status" goto status
if /I "%~1"=="logs" goto logs
if /I "%~1"=="doctor" goto doctor
if /I "%~1"=="open" goto open
if /I "%~1"=="help" goto help
goto help

:run
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0num-academy.ps1" %*
exit /b %ERRORLEVEL%

:up
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0num-academy.ps1" up
goto end
:down
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0num-academy.ps1" down
goto end
:restart
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0num-academy.ps1" restart
goto end
:status
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0num-academy.ps1" status
goto end
:logs
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0num-academy.ps1" logs
goto end
:doctor
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0num-academy.ps1" doctor
goto end
:open
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0num-academy.ps1" open
goto end
:help
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0num-academy.ps1" help
goto end

:menu
cls
echo NÜM Academy OS
echo --------------------------
echo 1. Lancer Academy
echo 2. Arreter Academy
echo 3. Redemarrer
echo 4. Voir le statut
echo 5. Voir les logs
echo 6. Diagnostic
echo 7. Ouvrir dans le navigateur
echo 0. Quitter
set /p choice=^> 
if "%choice%"=="1" goto up
if "%choice%"=="2" goto down
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto status
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto doctor
if "%choice%"=="7" goto open
if "%choice%"=="0" goto end
goto menu

:end
endlocal
