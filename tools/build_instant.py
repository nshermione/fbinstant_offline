# -*- coding: utf-8 -*-

import os
import shutil
import time
import sys
import glob

def getopts(argv):
    opts = {}  # Empty dictionary to store key-value pairs.
    while argv:  # While there are arguments left to parse...
        if argv[0][0] == '-':  # Found a "-name value" pair.
            opts[argv[0]] = argv[1]  # Add key and value to the dictionary.
        argv = argv[1:]  # Reduce the argument list by copying it starting from index 1.
    return opts

def process_index(filepath, mainfile):
	ignore_flag = False
	file_obj = open(filepath, "r")
	main_file = open(mainfile, "r")
	lines = file_obj.readlines()
	main_contents = main_file.read()
	html_doc = ""
	for line in lines:
	    if "</title>" in line:
	        html_doc += '  <title>Find Numbers</title>\n'
	        html_doc += '  <meta name="description" content="Tìm số nhanh theo thứ tự từ nhỏ đến lớn, càng nhanh càng tốt. Người thắng sẽ là người đạt được số kim cương cao nhất.">\n'
	        html_doc += '  <meta name="keywords" content="tim so, find number, game vui, tuoi tho, tim nhanh, game hay, mini game">\n'
	    else:
	        if "</head>" in line:
	            html_doc += '<link rel="stylesheet" type="text/css" href="main.css?v=%s"/>\n' % time.time()
	        elif "src/settings" in line:
	            ignore_flag = False

	        if not ignore_flag:
	            html_doc += line

	        if "<body>" in line:
	            ignore_flag = True
	            html_doc += main_contents
	            html_doc += "\n"

	file_ret = open(filepath, "w")
	file_ret.write(html_doc)


def process_main(filepath):
    file_obj = open(filepath, "r")
    lines = file_obj.readlines()
    indicator = "var percent = 100 * completedCount / totalCount;"
    html_doc = ""
    for line in lines:
        if "boot();" in line:
            html_doc += '''
            FBInstant.initializeAsync()
                .then(function() {
                    boot();
                });
            '''
        elif indicator in line:
            html_doc += indicator + "\n"
            html_doc += '''
            if (FBInstant) {
              FBInstant.setLoadingProgress(percent);
            }
            '''
            html_doc += "\n"
        else:
            html_doc += line
    file_ret = open(filepath, "w")
    file_ret.write(html_doc)


for folder, subfolders, subfiles in os.walk("../build/web-mobile"):
	for filename in subfiles:
		if "index.html" in filename:
			indexfile = os.path.join(folder, filename)
			mainfile = os.path.join(folder, "main_instant.html")
			process_index(indexfile, mainfile)
			print(filename)
		elif "main." in filename and ".js" in filename:
		    mainfile = os.path.join(folder, filename)
		    process_main(mainfile)
		elif "splash." in filename and "splash.png" not in filename:
			print filename
			srcfile = os.path.join(folder, "splash.png")
			dstfile = os.path.join(folder, filename)
			if os.path.isfile(srcfile):
				shutil.move(srcfile, dstfile)


myargs = getopts(sys.argv)
if '-env' in myargs:  # Example usage.
    if 'dev' in myargs['-env']:
        for filename in glob.glob("../build/web-mobile/res/raw-assets/resources/project.*.*.json"):
            os.remove(filename)
    elif 'instant' in myargs['-env']:
        production_file = ""
        dev_file = ""
        project_file_name = ""
        for filename in glob.glob("../build/web-mobile/res/raw-assets/resources/project.*.json"):
            if 'instant' in filename:
                production_file = filename
            else:
                basename = os.path.basename(filename)
                dotcount = basename.count(".")
                if dotcount == 2:
                    project_file_name = basename
                os.remove(filename)

        resource_folder = os.path.dirname(production_file)
        shutil.move(production_file, os.path.join(resource_folder, project_file_name))


