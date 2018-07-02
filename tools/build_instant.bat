%CC_ROOT%\CocosCreator.exe --path . --build "platform=web-mobile;startScene=13a260be-b36b-4faa-98e6-7653eb3e4f00;title=fbinstant-game;inlineSpriteFrames=true;mergeStartScene=true;debug=false;"

cd %CARO_PROJECT_DIR%\tools
python build_instant.py -env instant
cd %CARO_PROJECT_DIR%