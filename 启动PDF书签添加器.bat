@echo off
chcp 65001 >nul
title PDF书签添加器
echo 正在启动 PDF书签添加器...
echo.

:: 获取当前目录
set "CURRENT_DIR=%~dp0"

:: 启动浏览器打开 index.html
start "" "%CURRENT_DIR%index.html"

:: 2秒后退出
timeout /t 2 /nobreak >nul
exit
