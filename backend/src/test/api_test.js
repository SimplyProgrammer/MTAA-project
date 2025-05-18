const chai = require('chai');
const request = require('supertest');

const expect = chai.expect;

const dotenv = require("dotenv");
const fs = require("fs");
if (fs.existsSync(".env.local")) {
    dotenv.config({ path: ".env.local", override: true });
}
dotenv.config();

const { IP, PORT } = require("../utils.js");
const BASE_URL = `http://${IP}:${PORT}`;
let authToken = '';

describe('API unit tests', () => {
    before(async () => {
        const res = await request(BASE_URL)
            .post('/auth/login')
            .send({
                email: 'teacher@mail.com',
                password: 'tst123'
            });

        expect(res.status).to.equal(200);
        expect(res.body.data.token).to.be.a('string');
        authToken = res.body.data.token;
    });

    it('should return user account data', async () => {
        const res = await request(BASE_URL)
            .get('/users/accounts/1')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).to.equal(200);
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.not.have.property('password');
    });

    it('should create a new subject and assign it to the teacher, then fetch it', async () => {
        const subjectTitle = "Test Subject " + Date.now();
        const subjectDescription = "Test Description";
        const userId = 3;

        const createRes = await request(BASE_URL)
            .post('/subjects')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: subjectTitle,
                description: subjectDescription,
                user_id: userId
            });

        expect(createRes.status).to.equal(201);
        expect(createRes.body.data).to.have.property('id');
        const subjectId = createRes.body.data.id;

        const fetchRes = await request(BASE_URL)
            .get(`/subjects?user_id=${userId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(fetchRes.status).to.equal(200);
        const found = fetchRes.body.data.some(s => s.id === subjectId && s.title === subjectTitle);
        expect(found).to.be.true;
    });

    it('should create an event for a subject and then fetch it by subject_id', async () => {

        const subjectTitle = "Event Subject " + Date.now();
        const subjectDescription = "Event Subject Description";
        const userId = 3;

        const subjectRes = await request(BASE_URL)
            .post('/subjects')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: subjectTitle,
                description: subjectDescription,
                user_id: userId
            });

        expect(subjectRes.status).to.equal(201);
        const subjectId = subjectRes.body.data.id;

        const eventTitle = "Test Event " + Date.now();
        const eventType = "exam";
        const dateTill = "2025-12-31";

        const eventRes = await request(BASE_URL)
            .post('/events')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: eventTitle,
                subject_id: subjectId,
                type: eventType,
                date_till: dateTill
            });

        expect(eventRes.status).to.equal(201);
        expect(eventRes.body.data).to.have.property('id');
        const eventId = eventRes.body.data.id;

        const fetchEventsRes = await request(BASE_URL)
            .get(`/events?subject_id=${subjectId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(fetchEventsRes.status).to.equal(200);
        const found = fetchEventsRes.body.data.some(e => e.id === eventId && e.title === eventTitle);
        expect(found).to.be.true;
    });

    it('should fail to register a user with missing fields and return 400', async () => {
        let res = await request(BASE_URL)
            .post('/auth/signup')
            .send({
                first_name: "Test",
                last_name: "User",
                email: "fail" + Date.now() + "@mail.com"
                // password missing
            });
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');

        res = await request(BASE_URL)
            .post('/auth/signup')
            .send({
                first_name: "Test",
                last_name: "User",
                password: "tst12345"
                // email missing
            });
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');

        res = await request(BASE_URL)
            .post('/auth/signup')
            .send({
                first_name: "Test",
                last_name: "User",
                email: "fail" + Date.now() + "@mail.com",
                password: "123" // too short
            });
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');

        res = await request(BASE_URL)
            .post('/auth/signup')
            .send({
                first_name: "Test",
                last_name: "User",
                email: "a", // bad email
                password: "tst12345"
            });
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
    });

});