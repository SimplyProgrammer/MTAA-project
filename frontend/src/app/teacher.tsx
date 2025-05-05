import React, { useEffect, useState } from "react";
import { Alert, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Screen } from "@/components/styles";
import AppButton from "@/components/AppButton";
import axios from "@/libs/axios";
import * as toasts from "@/libs/toasts";
import * as useAuthStore from "@/libs/auth";


export default function TeacherOverviewScreen() {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [newSubjectTitle, setNewSubjectTitle] = useState("");
    const [newSubjectDescription, setNewSubjectDescription] = useState("");
    const [loading, setLoading] = useState(false);

	// Events state
    const [events, setEvents] = useState<any[]>([]);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventType, setNewEventType] = useState("");
    const [newEventSubjectId, setNewEventSubjectId] = useState<number | null>(null);
    const [newEventDateTill, setNewEventDateTill] = useState<string>("");

    const fetchSubjects = async () => {
        try {
            const user = useAuthStore.getUser();
            if (!user?.id) return;

            const response = await axios.get(`subjects?user_id=${user.id}`);
            setSubjects(response.data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

	const handleDeleteSubject = async (subjectId: number) => {
        Alert.alert(
            "Delete Subject",
            "Are you sure you want to delete this subject?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await axios.delete(`subjects/${subjectId}`);
                            setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
                        } catch (error) {
                            console.error(error);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const fetchEvents = async () => {
        try {
            const user = useAuthStore.getUser();
            if (!user?.id) return;
            // Get all events for subjects assigned to this user
            const subjectIds = subjects.map((s) => s.id);
            if (subjectIds.length === 0) {
                setEvents([]);
                return;
            }
            // Fetch all events for these subjects
            const promises = subjectIds.map((id: number) =>
                axios.get(`events?subject_id=${id}`)
            );
            const results = await Promise.all(promises);
            // Flatten and merge all events
            const allEvents = results.flatMap((res) => res.data.data || []);
            setEvents(allEvents);
        } catch (error) {
            console.error(error);
        }
    };

	const handleDeleteEvent = async (eventId: number) => {
        Alert.alert(
            "Delete Event",
            "Are you sure you want to delete this event?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await axios.delete(`events/${eventId}`);
                            setEvents((prev) => prev.filter((e) => e.id !== eventId));
                        } catch (error) {
                            console.error(error);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };


	const handleAddEvent = async () => {
        if (!newEventTitle || !newEventType || !newEventSubjectId || !newEventDateTill) {
            console.error("Please fill in all event fields");
            return;
        }
        try {
            setLoading(true);
            const response = await toasts.forAxiosActionCall(
                axios.post("events", {
                    title: newEventTitle,
                    subject_id: newEventSubjectId,
                    type: newEventType,
                    date_till: newEventDateTill,
                }),
                "Add Event",
                "Event added successfully"
            );
            if (response) {
                setEvents((prev) => [...prev, response.data]);
                setNewEventTitle("");
                setNewEventType("");
                setNewEventSubjectId(null);
                setNewEventDateTill("");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubject = async () => {
        if (!newSubjectTitle || !newSubjectDescription) {
            console.error("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            const user = useAuthStore.getUser();
            if (!user?.id) {
                console.error("User not found");
                return;
            }

            const response = await toasts.forAxiosActionCall(
                axios.post("subjects", {
                    title: newSubjectTitle,
                    description: newSubjectDescription,
                    user_id: user.id,
                }),
                "Add Subject",
                "Subject added successfully"
            );

            if (response) {
                setSubjects((prev) => [...prev, response.data]);
                setNewSubjectTitle("");
                setNewSubjectDescription("");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

	useEffect(() => {
        if (subjects.length > 0) fetchEvents();
    }, [subjects]);

    return (
        <ScrollView className={`${Screen}`}>
            <Text className="text-2xl font-bold mb-4">Teacher Overview</Text>

            <Text className="text-xl font-semibold mb-2">Your Subjects</Text>
            <View className="mb-4">
                {subjects.length === 0 ? (
                    <Text>No subjects found.</Text>
                ) : (
                    subjects.map((subject) => (
                        <View key={subject.id} className="mb-2 p-2 border rounded flex-row justify-between items-center">
                            <View>
                                <Text className="font-bold">{subject.title}</Text>
                                <Text>{subject.description}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleDeleteSubject(subject.id)}
                                style={{
                                    backgroundColor: "#ffdddd",
                                    padding: 6,
                                    borderRadius: 4,
                                    marginLeft: 8,
                                }}
                            >
                                <Text style={{ color: "#b00" }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>

            <Text className="text-xl font-semibold mb-2">Add New Subject</Text>
            <View className="mb-4">
                <TextInput
                    placeholder="Subject Title"
                    value={newSubjectTitle}
                    onChangeText={setNewSubjectTitle}
                    className="border p-2 rounded mb-2"
                />
                <TextInput
                    placeholder="Subject Description"
                    value={newSubjectDescription}
                    onChangeText={setNewSubjectDescription}
                    className="border p-2 rounded mb-2"
                />
                <AppButton
                    title={loading ? "Adding..." : "Add Subject"}
                    onPress={handleAddSubject}
                    disable={loading}
                />
            </View>
			<Text className="text-xl font-semibold mb-2">Events for Your Subjects</Text>
            <View className="mb-4">
                {events.length === 0 ? (
                    <Text>No events found.</Text>
                ) : (
                    events.map((event) => (
                        <View key={event.id} className="mb-2 p-2 border rounded flex-row justify-between items-center">
                            <View>
                                <Text className="font-bold">{event.title}</Text>
                                <Text>Type: {event.type}</Text>
                                <Text>Subject: {event.subject_title || (subjects.find(s => s.id === event.subject_id)?.title ?? "")}</Text>
                                <Text>Due: {event.date_till?.slice(0, 10)}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleDeleteEvent(event.id)}
                                style={{
                                    backgroundColor: "#ffdddd",
                                    padding: 6,
                                    borderRadius: 4,
                                    marginLeft: 8,
                                }}
                            >
                                <Text style={{ color: "#b00" }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>

            <Text className="text-xl font-semibold mb-2">Add New Event</Text>
            <View className="mb-4">
                <TextInput
                    placeholder="Event Title"
                    value={newEventTitle}
                    onChangeText={setNewEventTitle}
                    className="border p-2 rounded mb-2"
                />
                <TextInput
                    placeholder="Event Type (e.g. exam, deadline)"
                    value={newEventType}
                    onChangeText={setNewEventType}
                    className="border p-2 rounded mb-2"
                />
                <View className="border p-2 rounded mb-2">
                    <Text>Select Subject:</Text>
                    {subjects.map((subject) => (
                        <TouchableOpacity
                            key={subject.id}
                            onPress={() => setNewEventSubjectId(subject.id)}
                            style={{
                                backgroundColor: newEventSubjectId === subject.id ? "#ddd" : "#fff",
                                padding: 6,
                                marginVertical: 2,
                                borderRadius: 4,
                            }}
                        >
                            <Text>{subject.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TextInput
                    placeholder="Due Date (YYYY-MM-DD)"
                    value={newEventDateTill}
                    onChangeText={setNewEventDateTill}
                    className="border p-2 rounded mb-2"
                />
              
                <AppButton
                    title={loading ? "Adding..." : "Add Event"}
                    onPress={handleAddEvent}
                    disable={loading}
                />
            </View>
        </ScrollView>
    );
}