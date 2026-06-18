// mongo-init.js

db = db.getSiblingDB('applymcp');

db.person.insertMany([
    {
        "firstName": "John",
        "lastName": "Doe",
        "email": "johndoe@gmail.com",
        "birthDate": "1990-01-01",
        "phoneNumber": "123-456-7890",
        "address": "Rue des potiers",
        "linkedinUrl":"",
        "githubUrl":"",
        "portfolioUrl":"",
        "summary":"That's my awesome summary !",
        "hobbies":[],
        "languages":[],
        "workExperiences":[],
        "educations":[]
    }
]);