import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import api from "@/libs/axios";
import { getUser } from "@/libs/auth";
import EventCard from "@/components/timetable/EventCard";
import * as Styles from "@/components/styles";

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
        const subjectsUrl = `subjects?user_id=${user.id}`;
        const subjectsData = await api.get_auth_data(subjectsUrl);
        const subjectsArr: any[] = Array.isArray(subjectsData)
          ? subjectsData
          : subjectsData?.data || [];
        setSubjects(subjectsArr);

        // 2) Fetch lectures
        const lecturesUrl = `lectures?user_id=${user.id}`;
        const lecturesData = await api.get_auth_data(lecturesUrl);
        const lecturesArr: any[] = Array.isArray(lecturesData)
          ? lecturesData
          : lecturesData?.data || [];
        setLectures(lecturesArr);

        // 3) Fetch seminars
        const seminarsUrl = `seminars?user_id=${user.id}`;
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
                const eventsUrl = `events?subject_id=${subjectId}&type=${type}`;
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
    <ScrollView className={Styles.ScrollViewContainer}>
      <Text className={Styles.H2}>Timetable</Text>
      <View className={Styles.basicContainer}>
        {DAYS.map((day) => (
          <View key={day} className={Styles.daySection}>
            <Text className={Styles.dayTitle}>{day}</Text>
            {eventsByDay[day].length === 0 ? (
              <Text className={Styles.emptyText}>No lectures or seminars.</Text>
            ) : (
              <View className={Styles.compactList}>
                {eventsByDay[day].map((event) => (
                  <View
                    key={`${event.type}-${event.id}`}
                    className={Styles.compactItem}
                    style={isPast(event.to_time) ? { opacity: 0.3 } : undefined}
                  >
                    <Text className={Styles.compactType}>{event.type}</Text>
                    <Text className={Styles.compactTitle}>
                      {getSubjectTitle(event.subject_id)}
                    </Text>
                    <Text className={Styles.compactTime}>
                      {formatTime(event.from_time)} - {formatTime(event.to_time)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
      <Text className={Styles.H2}>Exams</Text>
      <View className={Styles.basicContainer}>
      {examEvents.length === 0 ? (
        <Text>No exam events found.</Text>
      ) : (
        examEvents.map((event) => {
          const countdown = getCountdown(event.date_till);
          return (
            <EventCard
              key={event.id}
              title={event.title}
              subject={event.subject_title}
              date={new Date(event.date_till).toLocaleString()}
              countdown={countdown}
              isPast={isPast(event.date_till)}
            />
          );
        })
      )}
      </View>
      <Text className={Styles.H2}>Assignments</Text>
      <View className={Styles.basicContainer}>
      {assignmentEvents.length === 0 ? (
        <Text>No assignment events found.</Text>
      ) : (
        assignmentEvents.map((event) => {
          const countdown = getCountdown(event.date_till);
          return (
            <EventCard
              key={event.id}
              title={event.title}
              subject={event.subject_title}
              date={new Date(event.date_till).toLocaleString()}
              countdown={countdown}
              isPast={isPast(event.date_till)}
            />
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
  if (diffMs <= 0) return { text: "Due!", color: Styles.countdownRed };

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  let color = Styles.countdownGreen;
  if (days < 2) color = Styles.countdownRed;
  else if (days < 10) color = Styles.countdownOrange;

  return { text: `${days}d ${hours}h`, color };
}

function isPast(dateStr: string) {
  return new Date(dateStr).getTime() < Date.now();
}