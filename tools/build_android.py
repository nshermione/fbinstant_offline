import os
import shutil


localfile = open("../build/jsb-default/frameworks/runtime-src/proj.android-studio/local.properties", "r")
locallines = localfile.readlines()
localfile.close()

ret = ""

for line in locallines:
	newline = line.replace("\\", "\\\\")
	newline = newline.replace("\\\\\\\\", "\\\\")
	ret += newline


wlocalfile = open("../build/jsb-default/frameworks/runtime-src/proj.android-studio/local.properties", "w")
wlocalfile.write(ret)
wlocalfile.close()


shutil.copyfile("../assets/resources/sdkbox_config.json", "../build/jsb-default/res/sdkbox_config.json")