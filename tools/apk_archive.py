import os
import datetime
import shutil

now = datetime.datetime.now()

filename = "slots_%s_%s_%s.apk" % (now.day, now.month, now.year)

shutil.move('../build/jsb-default/frameworks/runtime-src/proj.android-studio/app/build/outputs/apk/Slot-debug.apk', '../build/jsb-default/frameworks/runtime-src/proj.android-studio/app/build/outputs/apk/%s' % filename)


