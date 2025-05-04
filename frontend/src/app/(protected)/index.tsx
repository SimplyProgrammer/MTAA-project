import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import * as useAuthStore from '@/libs/auth'
import AppButton from "@/components/AppButton";

import { Screen } from "@/components/styles";
import { Link, router } from "expo-router";

import * as toasts from "@/libs/toasts";

import axios from "@/libs/axios";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Outline } from "@/components/AppButton";

const handleLogout = async () => {
	try {
		const resp = await toasts.forAxiosActionCall(useAuthStore.logout(), "Logout", "Logged out successfully");
		if (resp)
			router.dismissTo("/login"); // Explicit...
		console.log("Logout: ", resp);
	} catch (error) {
		console.error(error);
	}
}

const tryGetImage = async () => {
	try {
		const img = await toasts.forAxiosActionCall(axios.get_auth_data('files/test.PNG'), "Img");
		console.log("Img: ", img);
	} catch (error) {
		console.error(error);
	}
}

export default function HomeScreen() {
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

	const doTest = async () => {
		try {
			const resp = await toasts.forAxiosActionCall(axios.get_auth_data(''), "Test", "Tested successfully");
			console.log("Test: ", resp);
		} catch (error) {
			console.error(error);
		}
	}

	const testRefresh = async () => {
		try {
			const resp = await useAuthStore.refreshToken()
			console.log("Refresh test: ", resp)
		}
		catch (err) {
			console.error(err)
		}
	}

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
            <Text>{'Welcome back ' + useAuthStore.getUser().first_name}</Text>
            <Text>{JSON.stringify(useAuthStore.getUser())}</Text>

            

            {/* ...rest of your code... */}
            <AppButton title="Logout" className={`mt-4`} onPress={handleLogout} />
            <AppButton title="tst refresh" className={`mt-4`} onPress={testRefresh} />
            <AppButton title="Test" className={`mt-4 ${Outline}`} onPress={tryGetImage}>
                <MaterialIcons name="http" size={24} color="blue" />
            </AppButton>
			<AppButton
                title="Admin Panel"
                className={`mt-4`}
                onPress={() => router.push("/admin")}
            />
            <View style={styles.timetableContainer}>
                <Text style={styles.timetableHeader}>
                    {timetableLabel}
                </Text>
                {loading ? (
                    <Text>Loading...</Text>
                ) : todayEvents.length === 0 ? (
                    <Text style={styles.emptyText}>
                        No lectures or seminars {timetableLabel === "Monday's Timetable" ? "on Monday." : "today."}
                    </Text>
                ) : (
                    todayEvents.map((event) => (
                        <View
                            key={`${event.type}-${event.id}`}
                            style={[
                                styles.eventRow,
                                new Date(event.to_time).getTime() < Date.now() && { opacity: 0.3 },
                            ]}
                        >
                            <Text style={styles.eventType}>
                                {event.type}
                            </Text>
                            <Text style={styles.eventTitle}>
                                {getSubjectTitle(event.subject_id)}
                            </Text>
                            <Text style={styles.eventTime}>
                                {formatTime(event.from_time)} - {formatTime(event.to_time)}
                            </Text>
                        </View>
                    ))
                )}
            </View>
			{/* Subject List Section */}
            <View style={styles.subjectListContainer}>
                <Text style={styles.subjectListHeader}>Your Subjects</Text>
                {subjects.length === 0 ? (
                    <Text style={styles.emptyText}>No subjects found.</Text>
                ) : (
                    subjects.map((subject) => (
                        <TouchableOpacity
                            key={subject.id}
                            style={styles.subjectItem}
                            onPress={() => router.push({ pathname: "/subject", params: { name: subject.title } })}
                        >
                            <Text style={styles.subjectTitle}>{subject.title}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </View>
		</ScrollView>
	);

	
}

const styles = StyleSheet.create({
    timetableContainer: {
        width: "100%",
        maxWidth: 600,
        marginTop: 24,
        marginBottom: 16,
    },
    timetableHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    emptyText: {
        color: "#888",
    },
    eventRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginBottom: 4,
    },
    eventType: {
        fontWeight: "bold",
        width: 18,
        color: "#2563eb",
    },
    eventTitle: {
        flex: 1,
        fontSize: 13,
        fontWeight: "600",
    },
    eventTime: {
        fontSize: 12,
        color: "#555",
        width: 80,
        textAlign: "right",
    },subjectListContainer: {
        width: "100%",
        maxWidth: 600,
        marginTop: 16,
        marginBottom: 16,
    },
    subjectListHeader: {
        fontSize: 17,
        fontWeight: "bold",
        marginBottom: 6,
    },
    subjectItem: {
        backgroundColor: "#e0e7ff",
        borderRadius: 6,
        padding: 10,
        marginBottom: 6,
    },
    subjectTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1e293b",
    },
});