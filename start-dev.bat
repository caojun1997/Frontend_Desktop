@echo off
title Chat App Development Server
echo 正在启动聊天应用开发服务器...
echo.
echo 启动后端代理服务器 (端口 3001)...
start "Backend Server" cmd /k "npm run server"
timeout /t 3 /nobreak > nul
echo.
echo 启动前端开发服务器 (端口 5173)...
start "Frontend Server" cmd /k "npm run dev"
echo.
echo 服务器启动完成！
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:3001
echo.
pause
