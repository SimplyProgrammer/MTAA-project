const { sendPushNotification, getUsersWithPushTokens, getUpcomingEventsForUser } = require('../routes/reminderJob');
const db = require("../config/db");
const { expect } = require('chai');

describe('reminderJob unit tests', () => {
    let testUserId;
    let testSubjectId;
    let testEventId;

    before(async () => {
        const userRes = await db.query(
            `INSERT INTO UserAccounts (first_name, last_name, email, password, expo_push_token, active)
             VALUES ('Push', 'Tester', 'push_tester@mail.com', 'x', 'ExponentPushToken[test]', true)
             RETURNING id`
        );
        testUserId = userRes.rows[0].id;

        const subjectRes = await db.query(
            `INSERT INTO Subjects (title, description) VALUES ('PushTestSubject', 'desc') RETURNING id`
        );
        testSubjectId = subjectRes.rows[0].id;

        await db.query(
            `INSERT INTO User_Subjects (user_id, subject_id) VALUES ($1, $2)`,
            [testUserId, testSubjectId]
        );

        const eventRes = await db.query(
            `INSERT INTO Events (title, subject_id, type, date_till)
             VALUES ('PushTestEvent', $1, 'exam', NOW() + INTERVAL '2 days')
             RETURNING id`,
            [testSubjectId]
        );
        testEventId = eventRes.rows[0].id;
    });

    after(async () => {
        await db.query(`DELETE FROM Events WHERE id = $1`, [testEventId]);
        await db.query(`DELETE FROM User_Subjects WHERE user_id = $1 AND subject_id = $2`, [testUserId, testSubjectId]);
        await db.query(`DELETE FROM Subjects WHERE id = $1`, [testSubjectId]);
        await db.query(`DELETE FROM UserAccounts WHERE id = $1`, [testUserId]);
    });

    it('getUsersWithPushTokens returns users with tokens', async () => {
        const users = await getUsersWithPushTokens();
        const found = users.some(u => u.id === testUserId && u.expo_push_token === 'ExponentPushToken[test]');
        expect(found).to.be.true;
    });

    it('getUpcomingEventsForUser returns upcoming events for user', async () => {
        const events = await getUpcomingEventsForUser(testUserId);
        const found = events.some(e => e.title === 'PushTestEvent');
        expect(found).to.be.true;
    });

    it('sendPushNotification does not throw', async () => {
        await sendPushNotification('ExponentPushToken[test]', 'Test', 'Body');
    });
});