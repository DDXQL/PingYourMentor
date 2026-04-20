 B@echo off
chcp 65001 >nul
title PingYourMentor v1.5

echo.
echo ========================================
echo   PingYourMentor v1.5 启动器
echo ========================================
echo.

cd /d "%~dp0"

REM Kill processes using port 3000 and 3001
echo [1/4] 清理占用端口...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Kill any existing node.exe processes
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

REM Check dependencies
if not exist "node_modules" (
    echo [2/4] 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo 安装依赖失败!
        pause
        exit /b 1
    )
)

REM Clean cache
if exist ".next" (
    echo [3/4] 清理缓存...
    rd /s /q ".next" 2>nul
)

REM Start server
echo [4/4] 启动开发服务器...
echo.
echo 访问地址: http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo.

REM Start dev server
npm run dev
