import atexit
import os
from crypt import methods

from flask import Flask, request, jsonify
from git import Repo
from gpt4all import GPT4All
from helpers import build_directory_dict, cleanup_repo_dir

app = Flask(__name__)


@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    link = data.get('github-link')
    repo_name = link.rstrip('/').split('/')[-1].replace('.git', '')
    repo_dir = os.getcwd() + "/repos/" + repo_name

    # Clone the repository into the specified directory
    if not os.path.exists(os.getcwd() + "/repos/"):
        os.mkdir("repos")
    Repo.clone_from(link, repo_dir)

    # Build the nested dictionary structure for the cloned repository
    #folder_structure = build_directory_dict(repo_dir)
    #send('generate_docs',repo_dir)
    return jsonify({'status': '200'})

@app.route('/generate_docs', methods=['GET'])
def generate_docs():
    repo_path = request.args.get('link').split('/')[-1]
    llm = GPT4All('orca-mini-3b-gguf2-q4_0.gguf')
    responses = build_directory_dict(os.getcwd() + '/repos/' + repo_path)
    with llm.chat_session():
        def replace_file_contents(file_structure):
            for key, value in file_structure.items():
                if isinstance(value, dict):
                    # It's a folder; recurse into it
                    replace_file_contents(value)
                else:
                    # It's a file; replace its content with 'hello'
                    file_structure[key] = llm.generate(
                        'Pretend you are writing documentation for the following code. Give a description of each function, such as the inputs and outputs and data types: ' +
                        file_structure[key])
        replace_file_contents(responses)
    return jsonify({'responses': responses, 'status': "200"})

if __name__ == '__main__':
    # Ensure the repo directory is cleared before starting the app
    app.run(debug=True)
