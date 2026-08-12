#!/bin/bash
# 启动前强制释放 7883 端口

PORT=7883

# 查找占用端口的进程并杀掉
PID=$(lsof -t -i:$PORT 2>/dev/null || ss -tlnp | grep ":$PORT " | grep -oP 'pid=\K[0-9]+' | head -1)

if [ -n "$PID" ]; then
    echo "Killing process $PID using port $PORT"
    kill -9 $PID 2>/dev/null || true
    sleep 1
fi

# 确保端口已释放
for i in {1..5}; do
    if ! lsof -i:$PORT >/dev/null 2>&1 && ! ss -tlnp | grep -q ":$PORT "; then
        echo "Port $PORT is now free"
        exit 0
    fi
    sleep 1
done

echo "Warning: Port $PORT may still be in use"
exit 0
