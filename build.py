#!/usr/bin/env python3
"""
PDF 书签添加器 - 打包脚本
"""
import PyInstaller.__main__
import os
import shutil

# 确保目录存在
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, 'dist')
BUILD_DIR = os.path.join(BASE_DIR, 'build')

# 清理旧文件
if os.path.exists(DIST_DIR):
    shutil.rmtree(DIST_DIR)
if os.path.exists(BUILD_DIR):
    shutil.rmtree(BUILD_DIR)

# PyInstaller 参数
args = [
    'app.py',                          # 主程序
    '--name=PDF书签添加器',              # exe 名称
    '--onefile',                       # 单文件模式
    '--windowed',                      # 无控制台窗口
    '--icon=NONE',                     # 无图标
    '--add-data=index.html:.',         # 包含 HTML 文件
    '--clean',                         # 清理缓存
    '--noconfirm',                     # 不确认覆盖
]

print("开始打包...")
PyInstaller.__main__.run(args)
print("\n打包完成！")
print(f"输出文件: {os.path.join(DIST_DIR, 'PDF书签添加器.exe')}")
