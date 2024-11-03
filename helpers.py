import os
import shutil
import atexit
from functools import partial
import requests
# Ensure the directory is removed when the app exits
valid_extensions = ['md', 'py', 'js', 'java', 'html', 'css']
def cleanup_repo_dir(folder_path):
    if os.path.exists(folder_path):
        shutil.rmtree(folder_path)

# Recursive function to build a nested dictionary structure for files and folders
def build_directory_dict(folder_path):
    # Register cleanup_repo_dir to run on exit, with folder_path as the argument
    atexit.register(partial(cleanup_repo_dir, folder_path))

    directory_dict = {}
    for item in os.listdir(folder_path):
        item_path = os.path.join(folder_path, item)

        if os.path.isfile(item_path):
            # If it's a file, add it as ("filename", "contents")
            try:
                if any(ext in item for ext in valid_extensions):
                    with open(item_path, 'r', encoding='utf-8') as file:
                        directory_dict[item] = file.read()
            except UnicodeDecodeError:
                # Skip unreadable files like images
                continue
        elif os.path.isdir(item_path):
            if item[0] != '.':
                directory_dict[item] = build_directory_dict(item_path)
            # If it's a folder, recursively build its dictionary


    return directory_dict
