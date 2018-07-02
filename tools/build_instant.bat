%CC_ROOT%\CocosCreator.exe --path . --build "platform=web-mobile;startScene=46babd51-ca63-46fd-bab0-54471427e96d;title=caro;inlineSpriteFrames=true;mergeStartScene=true;debug=false;"

cd %CARO_PROJECT_DIR%\tools
python build_instant.py -env instant
cd %CARO_PROJECT_DIR%