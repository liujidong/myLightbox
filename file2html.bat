@echo off
setlocal enabledelayedexpansion
rem dir /b images > images.txt
for /f %%i in ('dir /b images') do (
	echo ^<img class="js-lightbox" 
	echo 	data-role="lightbox"
	echo 	data-source="images/%%i"
	echo 	src="images/%%i"
	set img=%%i
	rem echo !img!
	echo 	data-group="group-!img:~0,1!"
	echo 	data-id="%%~ni"
	echo 	data-caption="%%i"
	echo 	width="100" height="100"^>
)
endlocal
rem pause