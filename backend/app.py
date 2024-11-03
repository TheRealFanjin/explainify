from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Define a route for receiving data
@app.route('/api/data', methods=['GET'])
def receive_data():
    # Get the 'link' query parameter from the request
    link = request.args.get('link')

    # Process the data (you can add your own logic here)
    print("Received link:", link)

    # Send a response back to the frontend
    return jsonify({"message": "Data received successfully", "link": link}), 200

if __name__ == '__main__':
    app.run(debug=True)
