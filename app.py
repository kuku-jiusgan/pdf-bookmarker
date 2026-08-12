#!/usr/bin/env python3
"""
PDF 书签添加器 - Windows 桌面应用
"""
import os
import sys
import threading
import webview
from http.server import HTTPServer, SimpleHTTPRequestHandler

# 获取程序所在目录
if getattr(sys, 'frozen', False):
    # 打包后的 exe 运行
    BASE_DIR = sys._MEIPASS
else:
    # 直接运行 py 文件
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

HTML_FILE = os.path.join(BASE_DIR, 'index.html')
PORT = 7881


class CustomHandler(SimpleHTTPRequestHandler):
    """自定义 HTTP 处理器"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)
    
    def log_message(self, format, *args):
        # 静默日志
        pass


def start_server():
    """启动本地 HTTP 服务器"""
    server = HTTPServer(('127.0.0.1', PORT), CustomHandler)
    server.serve_forever()


def main():
    """主函数"""
    # 检查 HTML 文件是否存在
    if not os.path.exists(HTML_FILE):
        print(f"错误: 找不到 {HTML_FILE}")
        input("按回车键退出...")
        sys.exit(1)
    
    # 启动 HTTP 服务器线程
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # 创建 WebView 窗口
    window = webview.create_window(
        title='PDF 书签添加器',
        url=f'http://127.0.0.1:{PORT}/index.html',
        width=600,
        height=800,
        resizable=True,
        min_size=(500, 600)
    )
    
    # 启动应用
    webview.start(debug=False)


if __name__ == '__main__':
    main()
