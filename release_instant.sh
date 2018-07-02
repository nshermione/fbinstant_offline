/Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path . --build "platform=web-mobile;startScene=13a260be-b36b-4faa-98e6-7653eb3e4f00;title=swappy;inlineSpriteFrames=true;mergeStartScene=true;debug=false;md5Cache=true;"
cd tools
python build_instant.py -env instant
cd ..

rm -rf build/instant_game.zip
cd build/web-mobile
zip -r ../instant_game.zip *



