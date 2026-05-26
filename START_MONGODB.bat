@echo off
echo Starting MongoDB...
echo.
echo If MongoDB is installed, this will attempt to start it.
echo Make sure MongoDB is installed first!
echo.
echo Common MongoDB installation paths:
echo C:\Program Files\MongoDB\Server\[version]\bin\mongod.exe
echo.
pause
echo.
echo Trying to start MongoDB...
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
if errorlevel 1 (
    echo.
    echo MongoDB not found at default path.
    echo Please install MongoDB or update the path in this file.
    pause
)

