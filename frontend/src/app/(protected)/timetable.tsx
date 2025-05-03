import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import api from "@/libs/axios";
import { getUser } from "@/libs/auth";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetableScreen() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [examEvents, setExamEvents] = useState<any[]>([]);
  const [assignmentEvents, setAssignmentEvents] = useState<any[]>([]);
  const [lectures, setLectures] = useState<any[]>([]);
  const [seminars, setSeminars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = getUser();
        if (!user?.id) {
          setError("User not logged in or missing ID.");
          setLoading(false);
          return;
        }

        // 1) Fetch subjects
        const subjectsUrl = `/subjects?user_id=${user.id}`;
        const subjectsData = await api.get_auth_data(subjectsUrl);
        const subjectsArr: any[] = Array.isArray(subjectsData)
          ? subjectsData
          : subjectsData?.data || [];
        setSubjects(subjectsArr);

        // 2) Fetch lectures
        const lecturesUrl = `/lectures?user_id=${user.id}`;
        const lecturesData = await api.get_auth_data(lecturesUrl);
        const lecturesArr: any[] = Array.isArray(lecturesData)
          ? lecturesData
          : lecturesData?.data || [];
        setLectures(lecturesArr);

        // 3) Fetch seminars
        const seminarsUrl = `/seminars?user_id=${user.id}`;
        const seminarsData = await api.get_auth_data(seminarsUrl);
        const seminarsArr: any[] = Array.isArray(seminarsData)
          ? seminarsData
          : seminarsData?.data || [];
        setSeminars(seminarsArr);

        // 4) Fetch events (exams & assignments)
        if (subjectsArr.length > 0) {
          const subjectIds = subjectsArr.map((s) => s.id);

          const fetchEventsForType = async (type: string) => {
            let allEvents: any[] = [];
            await Promise.all(
              subjectIds.map(async (subjectId) => {
                const eventsUrl = `/events?subject_id=${subjectId}&type=${type}`;
                const eventsData = await api.get_auth_data(eventsUrl);
                const eventsArr: any[] = Array.isArray(eventsData)
                  ? eventsData
                  : eventsData?.data || [];
                const subject = subjectsArr.find((s) => s.id === subjectId);
                eventsArr.forEach((ev) => {
                  ev.subject_title = subject?.title || "";
                });
                allEvents = allEvents.concat(eventsArr);
              })
            );
            allEvents.sort((a, b) => {
              const da = new Date(a.date_till).getTime();
              const db = new Date(b.date_till).getTime();
              return da - db;
            });
            return allEvents;
          };

          const [examEv, assignmentEv] = await Promise.all([
            fetchEventsForType("exam"),
            fetchEventsForType("assignment"),
          ]);
          setExamEvents(examEv);
          setAssignmentEvents(assignmentEv);
        } else {
          setExamEvents([]);
          setAssignmentEvents([]);
        }
      } catch (err: any) {
        setError(err?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  // Combine lectures and seminars into a single list per day and sort by start time
  const groupEventsByDay = (lectures: any[], seminars: any[]) => {
    const eventsByDay: { [day: string]: any[] } = {};
    DAYS.forEach((day) => {
      eventsByDay[day] = [];
    });

    lectures.forEach((item) => {
      if (DAYS.includes(item.day)) {
        eventsByDay[item.day].push({ ...item, type: "L" });
      }
    });
    seminars.forEach((item) => {
      if (DAYS.includes(item.day)) {
        eventsByDay[item.day].push({ ...item, type: "S" });
      }
    });

    // Sort by from_time ascending
    DAYS.forEach((day) => {
      eventsByDay[day].sort(
        (a, b) => new Date(a.from_time).getTime() - new Date(b.from_time).getTime()
      );
    });

    return eventsByDay;
  };

  const eventsByDay = groupEventsByDay(lectures, seminars);

  // Helper: get subject title by id
  const getSubjectTitle = (id: number) =>
    subjects.find((s) => s.id === id)?.title || "";

  return (
<ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
      }}
    >
      <View style={{ width: "100%", maxWidth: 600 }}>
        <View style={styles.timetableContainer}>
          {DAYS.map((day) => (
            <View key={day} style={styles.daySection}>
              <Text style={styles.dayTitle}>{day}</Text>
              {eventsByDay[day].length === 0 ? (
                <Text style={styles.emptyText}>No lectures or seminars.</Text>
              ) : (
                <View style={styles.compactList}>
                  {eventsByDay[day].map((event) => (
                    <View
                      key={`${event.type}-${event.id}`}
                      style={[
                        styles.compactItem,
                        isPast(event.to_time) && { opacity: 0.3 },
                      ]}
                    >
                      <Text style={styles.compactType}>{event.type}</Text>
                      <Text style={styles.compactTitle}>
                        {getSubjectTitle(event.subject_id)}
                      </Text>
                      <Text style={styles.compactTime}>
                        {formatTime(event.from_time)} - {formatTime(event.to_time)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
        <Text style={styles.header}>Exams</Text>
        {examEvents.length === 0 ? (
          <Text>No exam events found.</Text>
        ) : (
          examEvents.map((event) => {
            const countdown = getCountdown(event.date_till);
            return (
              <View
                key={event.id}
                style={[
                  styles.eventCard,
                  isPast(event.date_till) && { opacity: 0.3 },
                ]}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventInfo}>{event.subject_title}</Text>
                <Text style={styles.eventInfo}>
                  {new Date(event.date_till).toLocaleString()}{" "}
                  <Text style={countdown.color}>({countdown.text})</Text>
                </Text>
              </View>
            );
          })
        )}

        <Text style={styles.header}>Assignments</Text>
        {assignmentEvents.length === 0 ? (
          <Text>No assignment events found.</Text>
        ) : (
          assignmentEvents.map((event) => {
            const countdown = getCountdown(event.date_till);
            return (
              <View
                key={event.id}
                style={[
                  styles.eventCard,
                  isPast(event.date_till) && { opacity: 0.3 },
                ]}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventInfo}>{event.subject_title}</Text>
                <Text style={styles.eventInfo}>
                  {new Date(event.date_till).toLocaleString()}{" "}
                  <Text style={countdown.color}>({countdown.text})</Text>
                </Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

// Helper to format time (HH:mm)
function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Helper to get countdown string and color
function getCountdown(dateStr: string) {
    const now = new Date();
    const target = new Date(dateStr);
    const diffMs = target.getTime() - now.getTime();
    if (diffMs <= 0) return { text: "Due!", color: styles.countdownRed };
  
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
    let color = styles.countdownGreen;
    if (days < 2) color = styles.countdownRed;
    else if (days < 10) color = styles.countdownOrange;
  
    return { text: `${days}d ${hours}h`, color };
  }

function isPast(dateStr: string) {
    return new Date(dateStr).getTime() < Date.now();
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  eventCard: {
    backgroundColor: "#dbdbdb",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },
  eventInfo: {
    fontSize: 13,
    marginTop: 3,
    color: "#333",
  },
  timetableContainer: {
    marginTop: 12,
    marginBottom: 24,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 14,
  },
  daySection: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 6,
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#374151",
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    marginLeft: 8,
    fontSize: 12,
  },
  compactList: {
    flexDirection: "column",
    gap: 2,
  },
  compactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: "#dbdbdb",
  },
  compactType: {
    fontWeight: "bold",
    fontSize: 13,
    marginRight: 6,
    color: "#2563eb",
    width: 16,
    textAlign: "center",
  },
  compactTitle: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  compactTime: {
    fontSize: 12,
    color: "#555",
    marginLeft: 8,
    width: 70,
    textAlign: "right",
  },
  countdownRed: {
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: 12,
  },
  countdownOrange: {
    color: "#f59e42",
    fontWeight: "bold",
    fontSize: 12,
  },
  countdownGreen: {
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: 12,
  },
});

