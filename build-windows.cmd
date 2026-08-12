@echo off
setlocal
call "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat" -arch=x64 -host_arch=x64
if errorlevel 1 exit /b %errorlevel%
where link
if errorlevel 1 exit /b %errorlevel%
call npm run tauri -- build --no-bundle
exit /b %errorlevel%
