from flask import Flask, request, jsonify

app = Flask(__name__)

# Store latest location of each device
location_data = {}

@app.route('/update_location', methods=['POST'])
def update_location():
    data = request.get_json()
    phone_id = str(data['id']).strip()
    location_data[phone_id] = {
        'lat': data['latitude'],
        'lng': data['longitude']
}

    return jsonify({"message": "Location updated successfully"})

@app.route('/get_location/<phone_id>', methods=['GET'])
def get_location(phone_id):
    phone_id = str(phone_id).strip()
    if phone_id in location_data:
       return jsonify(location_data[phone_id])
    else:
       return jsonify({"error": "Phone ID not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

