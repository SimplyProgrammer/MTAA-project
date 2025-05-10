const router = require("express").Router();
const cron = require("node-cron");
const db = require("../config/db");
const fetch = require("node-fetch");

async function sendPushNotification(expoPushToken, title, body) {
    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            to: expoPushToken,
            sound: "default",
            title,
            body,
        }),
    });
}

async function getUsersWithPushTokens() {
    const { rows } = await db.query(
        "SELECT id, first_name, expo_push_token FROM UserAccounts WHERE expo_push_token IS NOT NULL"
    );
    return rows;
}

async function getUpcomingEventsForUser(userId) {
    const { rows } = await db.query(`
        SELECT e.title, e.type, e.date_till, s.title AS subject_title
        FROM Events e
        JOIN Subjects s ON e.subject_id = s.id
        JOIN User_Subjects us ON e.subject_id = us.subject_id
        WHERE us.user_id = $1
          AND (e.type = 'exam' OR e.type = 'assignment')
          AND e.date_till >= NOW()
          AND e.date_till < NOW() + INTERVAL '5 days'
        ORDER BY e.date_till ASC
    `, [userId]);
    return rows;
}

cron.schedule("59 23 * * *", async () => {
    console.log("[ReminderJob] Running daily event reminder job...");

    const users = await getUsersWithPushTokens();

    for (const user of users) {
        const events = await getUpcomingEventsForUser(user.id);
        if (events.length > 0) {
            for (const event of events) {
                const eventDate = new Date(event.date_till).toLocaleString();
                const body = `Upcoming ${event.type} "${event.title}" for ${event.subject_title} on ${eventDate}`;
                await sendPushNotification(
                    user.expo_push_token,
                    "Event Reminder",
                    body
                );
                console.log(`[ReminderJob] Sent reminder to user ${user.id} for event "${event.title}"`);
            }
        }
    }

    console.log("[ReminderJob] Finished.");
}, { timezone: "Europe/Bratislava" });

module.exports = router;