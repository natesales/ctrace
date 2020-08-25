# cTrace

Contact Tracing and Reporting Application

MongoDB Setup:
Create person document expiry after 30 days. `mongod` will automatically remove the document after the 30 day timeout:
`db.people.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 2592000 } )`