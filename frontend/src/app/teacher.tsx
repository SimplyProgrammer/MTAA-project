import React, { useEffect, useState } from "react";
import { Alert, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import * as Styles from "@/components/styles";
import AppButton from "@/components/AppButton";
import axios from "@/libs/axios";
import { getUser } from "@/libs/auth";
import { Picker } from "@react-native-picker/picker";

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

    // Fetch subjects assigned to the teacher
    const fetchSubjects = async () => {
        try {
            const user = getUser();
            if (!user?.id) return;
            const response = await axios.get_auth_data(`subjects?user_id=${user.id}`);
            setSubjects(response.data?.data || response.data || response || []);
        } catch (error) {
            console.error(error);
        }
    };

    // Delete subject
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
                            await axios.delete_auth_data(`subjects/${subjectId}`);
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

    // Fetch all events for the teacher's subjects
    const fetchEvents = async () => {
        try {
            const subjectIds = subjects.map((s) => s.id);
            if (subjectIds.length === 0) {
                setEvents([]);
                return;
            }
            const promises = subjectIds.map((id: number) =>
                axios.get_auth_data(`events?subject_id=${id}`)
            );
            const results = await Promise.all(promises);
            const allEvents = results.flatMap((res) => res.data?.data || res.data || res || []);
            setEvents(allEvents);
        } catch (error) {
            console.error(error);
        }
    };

    // Delete event
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
                            await axios.delete_auth_data(`events/${eventId}`);
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

    // Add new subject and assign to user
    const handleAddSubject = async () => {
        if (!newSubjectTitle || !newSubjectDescription) {
            console.error("Please fill in all fields");
            return;
        }
        const user = getUser();
        try {
            setLoading(true);
            const response = await axios.post_auth_data("subjects", {
                title: newSubjectTitle,
                description: newSubjectDescription,
                user_id: user.id,
            });
            if (response && response.data && response.data.data) {
                setSubjects((prev) => [...prev, response.data.data]);
                setNewSubjectTitle("");
                setNewSubjectDescription("");
            } else if (response && response.id) {
                setSubjects((prev) => [...prev, response]);
                setNewSubjectTitle("");
                setNewSubjectDescription("");
            } else {
                console.error('Unexpected response structure:', response);
            }
        } catch (error) {
            console.error('API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add new event for a subject
    const handleAddEvent = async () => {
        if (!newEventTitle || !newEventType || !newEventSubjectId || !newEventDateTill) {
            console.error("Please fill in all event fields");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post_auth_data("events", {
                title: newEventTitle,
                subject_id: newEventSubjectId,
                type: newEventType,
                date_till: newEventDateTill,
            });
            if (response.data && response.data.data) {
                setEvents((prev) => [...prev, response.data.data]);
                setNewEventTitle("");
                setNewEventType("");
                setNewEventSubjectId(null);
                setNewEventDateTill("");
            } else if (response && response.id) {
                setEvents((prev) => [...prev, response]);
                setNewEventTitle("");
                setNewEventType("");
                setNewEventSubjectId(null);
                setNewEventDateTill("");
            } else {
                console.error('Unexpected response structure:', response);
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
        <ScrollView className={Styles.ScrollViewContainer}>
            <Text className={Styles.H2 + " mb-4"}>Teacher Overview</Text>

            <Text className={Styles.H3 + " mb-2"}>Your Subjects</Text>
            <View className="mb-4">
                {subjects.length === 0 ? (
                    <Text className={Styles.emptyText}>No subjects found.</Text>
                ) : (
                    subjects.map((subject) => (
                        <View key={subject.id} className={Styles.subjectItem}>
                            <View>
                                <Text className={Styles.subjectTitle}>{subject.title}</Text>
                                <Text className="text-xs text-gray-500">{subject.description}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleDeleteSubject(subject.id)}
                                className={Styles.deleteButton}
                            >
                                <Text className={Styles.deleteButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>

            <Text className={Styles.H3 + " mb-2"}>Add New Subject</Text>
            <View className={Styles.basicContainer}>
                <TextInput
                    placeholder="Subject Title"
                    value={newSubjectTitle}
                    onChangeText={setNewSubjectTitle}
                    className={Styles.Input + " mb-2"}
                />
                <TextInput
                    placeholder="Subject Description"
                    value={newSubjectDescription}
                    onChangeText={setNewSubjectDescription}
                    className={Styles.Input + " mb-2"}
                />
                <AppButton
                    title={loading ? "Adding..." : "Add Subject"}
                    onPress={handleAddSubject}
                    disable={loading}
                />
            </View>

            <Text className={Styles.H3 + " mb-2"}>Events for Your Subjects</Text>
            <View className="mb-4">
                {events.length === 0 ? (
                    <Text className={Styles.emptyText}>No events found.</Text>
                ) : (
                    events.map((event) => (
                        <View key={event.id} className={Styles.EventCardItem + " flex-row justify-between items-center"}>
                            <View>
                                <Text className={Styles.EventCardTitle}>{event.title}</Text>
                                <Text className={Styles.EventCardSubject}>Type: {event.type}</Text>
                                <Text className={Styles.EventCardSubject}>
                                    Subject: {event.subject_title || (subjects.find(s => s.id === event.subject_id)?.title ?? "")}
                                </Text>
                                <Text className={Styles.EventCardDate}>Due: {event.date_till?.slice(0, 10)}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleDeleteEvent(event.id)}
                                className={Styles.deleteButton}
                            >
                                <Text className={Styles.deleteButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>

            <Text className={Styles.H3 + " mb-2"}>Add New Event</Text>
            <View className={Styles.basicContainer}>
                <TextInput
                    placeholder="Event Title"
                    value={newEventTitle}
                    onChangeText={setNewEventTitle}
                    className={Styles.Input + " mb-2"}
                />
                <TextInput
                    placeholder="assignment/exam"
                    value={newEventType}
                    onChangeText={setNewEventType}
                    className={Styles.Input + " mb-2"}
                />
                <View className={Styles.Input + " h-[52px] mb-2 px-0"}>
						<Picker
							selectedValue={newEventSubjectId}
							onValueChange={(itemValue) => setNewEventSubjectId(itemValue)}
							
							dropdownIconColor="#333"
							style={{ fontSize: 13.5 }} 
						>
							<Picker.Item style={{ fontSize: 13.5 }} label="Select subject..." value={null} />
							{subjects.map((subject) => (
								<Picker.Item style={{ fontSize: 13.5 }}  key={subject.id} label={subject.title} value={subject.id} />
							))}
						</Picker>
                </View>
                <TextInput
                    placeholder="Due Date (YYYY-MM-DD)"
                    value={newEventDateTill}
                    onChangeText={setNewEventDateTill}
                    className={Styles.Input + " mb-2"}
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