import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect, useRouter, useSegments } from "expo-router";

import * as useAuthStore from '@/libs/auth'
import AppButton from "@/components/AppButton";

import { Screen } from "@/components/styles";
import { Link, router } from "expo-router";

import * as toasts from "@/libs/toasts";
import * as Styles from "@/components/styles";

import axios from "@/libs/axios";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Outline } from "@/components/AppButton";

export default function HomeScreen() {
	if (useAuthStore.getUser()?.role == 'ADMIN') 
		return <Redirect href="/(protected)/(home)/admin" />

	if (useAuthStore.getUser()?.role == 'TEACHER') 
		return <Redirect href="/(protected)/(home)/teacher" />

	const [todayEvents, setTodayEvents] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

	const router = useRouter();

    useEffect(() => {
        const fetchTodayTimetable = async () => {
            setLoading(true);
            try {
                const user = useAuthStore.getUser();
                if (!user?.id) {
                    setTodayEvents([]);
                    setLoading(false);
                    return;
                }
				// console.log(useAuthStore.getToken())
                const subjectsData = await axios.get_auth_data(`/subjects?user_id=${user.id}`);
                const subjectsArr: any[] = Array.isArray(subjectsData)
                    ? subjectsData
                    : subjectsData?.data || [];
                setSubjects(subjectsArr);

                const lecturesData = await axios.get_auth_data(`/lectures?user_id=${user.id}`);
                const lecturesArr: any[] = Array.isArray(lecturesData)
                    ? lecturesData
                    : lecturesData?.data || [];
                const seminarsData = await axios.get_auth_data(`/seminars?user_id=${user.id}`);
                const seminarsArr: any[] = Array.isArray(seminarsData)
                    ? seminarsData
                    : seminarsData?.data || [];

                const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
                const todayIdx = new Date().getDay();
                // 1 = Monday, 5 = Friday, 0 = Sunday, 6 = Saturday
                let today: string;
                let label: string;
                if (todayIdx < 1 || todayIdx > 5) {
                    today = "Monday";
                    label = "Monday's Timetable";
                } else {
                    today = DAYS[todayIdx - 1];
                    label = `Today's Timetable`;
                }

                const allEvents = [
                    ...lecturesArr.map((item) => ({ ...item, type: "L" })),
                    ...seminarsArr.map((item) => ({ ...item, type: "S" })),
                ].filter((item) => item.day === today);

                allEvents.sort(
                    (a, b) =>
                        new Date(a.from_time).getTime() - new Date(b.from_time).getTime()
                );

                setTodayEvents(allEvents);
                setTimetableLabel(label);
            } catch (err) {
                setTodayEvents([]);
                setTimetableLabel("Today's Timetable");
            } finally {
                setLoading(false);
            }
        };
        // Add timetable label state
        setTimetableLabel("Today's Timetable");
        fetchTodayTimetable();
    }, []);

    const [timetableLabel, setTimetableLabel] = useState("Today's Timetable");

    const getSubjectTitle = (id: number) =>
        subjects.find((s) => s.id === id)?.title || "";

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

	return (
    <ScrollView className={Styles.ScrollViewContainer}>
            <View className={`${Styles.basicContainer} mt-5`}>
                <Text className={`${Styles.H2} text-center`}>{'Welcome back ' + useAuthStore.getUser().first_name}</Text>
            </View>
            <Text className={`${Styles.H3} mt-5 mb-3`}>{timetableLabel}</Text>
            <View className={`${Styles.basicContainer}`}>

                {loading ? (
                    <Text>Loading...</Text>
                ) : todayEvents.length === 0 ? (
                    <Text className={Styles.emptyText}>
                        No lectures or seminars {timetableLabel === "Monday's Timetable" ? "on Monday." : "today."}
                    </Text>
                ) : (
                    todayEvents.map((event) => (
                        <View
                            key={`${event.type}-${event.id}`}
                            className={Styles.compactItem}
                        >
                            <Text className={Styles.compactType}>{event.type}</Text>
                            <Text className={Styles.compactTitle}>
                                {getSubjectTitle(event.subject_id)}
                            </Text>
                            <Text className={Styles.compactTime}>
                                {formatTime(event.from_time)} - {formatTime(event.to_time)}
                            </Text>
                        </View>
                    ))
                )}
            </View>
            <Text className={`${Styles.H3} mt-5 mb-3`}>Your Subjects</Text>
            <View className={Styles.basicContainer}>
                {subjects.length === 0 ? (
                    <Text className={Styles.emptyText}>No subjects found.</Text>
                ) : (
                    subjects.map((subject) => (
                        <TouchableOpacity
                            key={subject.id}
                            className={`${Styles.subjectItem}`}
                            onPress={() => router.push({ pathname: "/subjects/id/index", params: { id: subject.id, name: subject.title, desc: subject.description } })}
                        >
                            <Text className={Styles.subjectTitle}>{subject.title}</Text>
                            <Text className={Styles.arrowRight}>›</Text>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );

	
}

