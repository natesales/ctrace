import requests

locations = [
    "Beginning School",
    "Lower School",
    "Middle School",
    "Gym",
    "Dant House",
    "US Science",
    "US Math",
    "US Modern Language",
    "US Library",
    "Vollum",
    "Toad Hall",
    "Facilities",
    "Annex",
    "Inclusion Office",
    "CAC",
    "Barn",
    "Business Office",
    "US Library Downstairs",
    "Woodshop",
    "Art Barn",
    "Cabell Center Theater",
    "3-D Studio",
    "Human Resources",
    "Mail Room",
    "Mechanic Shop"
]

for location in locations:
    requests.post("https://ctrace.vercel.app/api/admin/location", data={
        "name": location,
        "max_occupancy": 100
    })
