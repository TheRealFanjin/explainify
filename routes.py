import os
from flask import Flask, request, jsonify, render_template
from git import Repo
from gpt4all import GPT4All
from helpers import build_directory_dict
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/submit": {"origins": "*"}, r"/generate_docs": {"origins": "*"}})

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
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

    llm = GPT4All('gpt4all-13b-snoozy-q4_0.gguf')
    responses = build_directory_dict(full_repo_path)

    with llm.chat_session():
        def replace_file_contents(file_structure):
            for key, value in file_structure.items():
                if isinstance(value, dict):
                    replace_file_contents(value)
                else:
                    file_structure[key] = llm.generate(
                        'Pretend you are writing documentation for the following code. Give a description of each function, such as the inputs and outputs and data types. Do not use the word I or refer to yourself in any way, just start with the documentation directly. Here is the code: ' +
                        file_structure[key]
                    )
        replace_file_contents(responses)

    return jsonify({"responses": responses, "status": "200"})


if __name__ == '__main__':
    # Ensure the repo directory is cleared before starting the app
    app.run(debug=True, port=5000)
