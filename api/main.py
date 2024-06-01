
from flask import Flask, request
from flask import jsonify
import requests
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def generate_description(profile):
    templates = [
        "{name} is {age} years old from {city}.",
        "Meet {name}, a {age}-year-old individual living in {city}.",
        "{name}, {age}, is from {city} and looking to meet new people."
    ]
    description = templates[random.randint(0, len(templates) - 1)].format(
        name=profile['name']['first'],
        age=profile['dob']['age'],
        city=profile['location']['city']
    )
    return description

@app.route("/profiles", methods=['GET'])
def get_profiles():
    num_profiles = request.args.get('num', default=10, type=int)
    response = requests.get(f'https://randomuser.me/api/?results={num_profiles}')
    profiles = response.json()['results']
    data = []

    for profile in profiles:
        user = {
            "id": profile['login']['uuid'],
            "firstname": profile['name']['first'],
            "lastname": profile['name']['last'],
            "age": profile['dob']['age'],
            "picture": profile['picture']['large'],  # URL of the profile picture
            "location": {
                "city": profile['location']['city'],
                "state": profile['location']['state'],
                "country": profile['location']['country']
            },
            "description": generate_description(profile)
        }
        data.append(user)
    
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
