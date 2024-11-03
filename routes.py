import atexit
import os
# from crypt import methods

from flask import Flask, request, jsonify
from git import Repo
from gpt4all import GPT4All
from helpers import build_directory_dict, cleanup_repo_dir

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    # print('lakjsdf;ja;lskdjf;lkajs;dlfkj',data)
    link = data.get('github-link')
    repo_name = link.rstrip('/').split('/')[-1].replace('.git', '')
    repo_dir = os.path.join(os.getcwd(), "repos", repo_name)

    # Clone the repository into the specified directory
    repos_path = os.path.join(os.getcwd(), "repos")
    if not os.path.exists(repos_path):
        os.mkdir(repos_path)
    
    try:
        Repo.clone_from(link, repo_dir)
    except Exception as e:
        return jsonify({'status': '500', 'error': str(e)})

    return jsonify({'status': '200'})

@app.route('/generate_docs', methods=['GET'])
def generate_docs():
    repo_path = request.args.get('link').split('/')[-1].replace('.git', '')
    full_repo_path = os.path.join(os.getcwd(), 'repos', repo_path)

    if not os.path.exists(full_repo_path):
        return jsonify({'status': '404', 'error': 'Repository not found.'})

    # llm = GPT4All('orca-mini-3b-gguf2-q4_0.gguf')
    # responses = build_directory_dict(full_repo_path)

    # with llm.chat_session():
    #     def replace_file_contents(file_structure):
    #         for key, value in file_structure.items():
    #             if isinstance(value, dict):
    #                 replace_file_contents(value)
    #             else:
    #                 file_structure[key] = llm.generate(
    #                     'Pretend you are writing documentation for the following code. Give a description of each function, such as the inputs and outputs and data types: ' +
    #                     file_structure[key]
    #                 )
    #     replace_file_contents(responses)

    # print('response from ai', responses)

    return jsonify({"responses": {"README.md": " The `gitHub-Interpreter` is a Python script that uses the `subprocess` module to execute commands on GitHub. It takes two arguments: the command to be executed and the path to the GitHub API endpoint. \n\nThe `command` argument is a string containing the shell command to be executed, for example `\"ls\"`. The `path` argument is also a string, but it specifies the URL of the GitHub API endpoint that will be used to execute the command. For example, if you want to execute the command \"ls\", the path should be `\"https://github.com/username/project-name.gitignore\"`.\n\nThe script returns the output of the command as a string, which is then printed to the console. The data type of the output is determined by the type of the command executed. For example, if you execute \"ls\", it will return an array of file names in the current directory.",

    "text.txt": "something_"}, "status": "200"
})


if __name__ == '__main__':
    # Ensure the repo directory is cleared before starting the app
    app.run(debug=True, port=5000)
