' PDF书签添加器 - 启动脚本
Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")

' 获取当前目录
strPath = FSO.GetParentFolderName(WScript.ScriptFullName)

' 打开 index.html
WshShell.Run "explorer.exe " & Chr(34) & strPath & "\index.html" & Chr(34), 1, False

Set WshShell = Nothing
Set FSO = Nothing
