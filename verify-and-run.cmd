@echo off
setlocal
call "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat" >nul
dumpbin /headers "src-tauri\target\release\infinite-canvas.exe" | findstr /i subsystem
if errorlevel 1 exit /b %errorlevel%
start "" "src-tauri\target\release\infinite-canvas.exe"
exit /b 0
