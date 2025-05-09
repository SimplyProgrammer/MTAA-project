import React, { useEffect, useState } from "react";
import { Alert, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import * as Styles from "@/components/styles";
import AppButton from "@/components/AppButton";
import axios from "@/libs/axios";
import { getUser } from "@/libs/auth";
import { Picker } from "@react-native-picker/picker";
import * as useAuthStore from '@/libs/auth';

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

    // Lectures state
    const [lectures, setLectures] = useState<any[]>([]);
    const [newLectureTitle, setNewLectureTitle] = useState("");
    const [newLectureSubjectId, setNewLectureSubjectId] = useState<number | null>(null);
    const [newLectureDay, setNewLectureDay] = useState("");
    const [newLectureFromTime, setNewLectureFromTime] = useState("");
    const [newLectureToTime, setNewLectureToTime] = useState("");

    // Seminars state
    const [seminars, setSeminars] = useState<any[]>([]);
    const [newSeminarTitle, setNewSeminarTitle] = useState("");
    const [newSeminarSubjectId, setNewSeminarSubjectId] = useState<number | null>(null);
    const [newSeminarDay, setNewSeminarDay] = useState("");
    const [newSeminarFromTime, setNewSeminarFromTime] = useState("");
    const [newSeminarToTime, setNewSeminarToTime] = useState("");

    

    const FIXED_DATE = "2025-01-01";
    const toTimestamp = (time: string) => time ? `${FIXED_DATE} ${time}` : "";

    // Fetch subjects assigned to the teacher
    const fetchSubjects = async () => {
        try {
            const user = useAuthStore.getUser();
            if (!user?.id) return;
            const response = await axios.get_auth_data(`subjects?user_id=${user.id}`);
            setSubjects(response.data?.data || response.data || response || []);
        } catch (error) {
            console.error(error);
        }
    };

    // Add new subject and assign to user
    const handleAddSubject = async () => {
        if (!newSubjectTitle || !newSubjectDescription) {
            console.error("Please fill in all fields");
            return;
        }
        const user = useAuthStore.getUser();
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

    // Fetch all lectures for the teacher's subjects
    const fetchLectures = async () => {
        try {
            const subjectIds = subjects.map((s) => s.id);
            if (subjectIds.length === 0) {
                setLectures([]);
                return;
            }
            const promises = subjectIds.map((id: number) =>
                axios.get_auth_data(`lectures?subject_id=${id}`)
            );
            const results = await Promise.all(promises);
            const allLectures = results.flatMap((res) => res.data?.data || res.data || res || []);
            setLectures(allLectures);
        } catch (error) {
            console.error(error);
        }
    };

    // Add new lecture for a subject
    const handleAddLecture = async () => {
        if (!newLectureSubjectId || !newLectureDay || !newLectureFromTime || !newLectureToTime) {
            console.error("Please fill in all lecture fields");
            return;
        }
        const user = useAuthStore.getUser();
        try {
            setLoading(true);
            const response = await axios.post_auth_data("lectures", {
                subject_id: newLectureSubjectId,
                from_time: toTimestamp(newLectureFromTime),
                to_time: toTimestamp(newLectureToTime),
                day: newLectureDay,
                user_id: user.id,
            });
            if (response.data && response.data.data) {
                setLectures((prev) => [...prev, response.data.data]);
                setNewLectureSubjectId(null);
                setNewLectureDay("");
                setNewLectureFromTime("");
                setNewLectureToTime("");
            } else if (response && response.id) {
                setLectures((prev) => [...prev, response]);
                setNewLectureSubjectId(null);
                setNewLectureDay("");
                setNewLectureFromTime("");
                setNewLectureToTime("");
            } else {
                console.error('Unexpected response structure:', response);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all seminars for the teacher's subjects
    const fetchSeminars = async () => {
        try {
            const subjectIds = subjects.map((s) => s.id);
            if (subjectIds.length === 0) {
                setSeminars([]);
                return;
            }
            const promises = subjectIds.map((id: number) =>
                axios.get_auth_data(`seminars?subject_id=${id}`)
            );
            const results = await Promise.all(promises);
            const allSeminars = results.flatMap((res) => res.data?.data || res.data || res || []);
            setSeminars(allSeminars);
        } catch (error) {
            console.error(error);
        }
    };

    // Add new seminar for a subject
    const handleAddSeminar = async () => {
        if (!newSeminarSubjectId || !newSeminarDay || !newSeminarFromTime || !newSeminarToTime) {
            console.error("Please fill in all seminar fields");
            return;
        }
        const user = useAuthStore.getUser();
        try {
            setLoading(true);
            const response = await axios.post_auth_data("seminars", {
                subject_id: newSeminarSubjectId,
                from_time: toTimestamp(newSeminarFromTime),
                to_time: toTimestamp(newSeminarToTime),
                day: newSeminarDay,
                user_id: user.id,
            });
            if (response.data && response.data.data) {
                setSeminars((prev) => [...prev, response.data.data]);
                setNewSeminarSubjectId(null);
                setNewSeminarDay("");
                setNewSeminarFromTime("");
                setNewSeminarToTime("");
            } else if (response && response.id) {
                setSeminars((prev) => [...prev, response]);
                setNewSeminarSubjectId(null);
                setNewSeminarDay("");
                setNewSeminarFromTime("");
                setNewSeminarToTime("");
            } else {
                console.error('Unexpected response structure:', response);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubject = async (subjectId: number) => {
        try {
            setLoading(true);
            await axios.delete_auth_data(`subjects/${subjectId}`);
            await fetchSubjects();
            await fetchEvents();
            await fetchLectures();
            await fetchSeminars();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        try {
            setLoading(true);
            await axios.delete_auth_data(`events/${eventId}`);
            setEvents((prev) => prev.filter((e) => e.id !== eventId));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLecture = async (lectureId: number) => {
        try {
            setLoading(true);
            await axios.delete_auth_data(`lectures/${lectureId}`);
            setLectures((prev) => prev.filter((l) => l.id !== lectureId));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSeminar = async (seminarId: number) => {
        try {
            setLoading(true);
            await axios.delete_auth_data(`seminars/${seminarId}`);
            setSeminars((prev) => prev.filter((s) => s.id !== seminarId));
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
        if (subjects.length > 0) {
            fetchEvents();
            fetchLectures();
            fetchSeminars();
        }
    }, [subjects]);

    // Helper to format time (HH:mm)
    function formatTime(dateStr: string) {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    return (
        <ScrollView className={Styles.ScrollViewContainer}>
            <View>
                {/* Subjects Section */}
                <View className={`${Styles.Card} mt-3`}>
                    <Text className={`${Styles.H2} text-center`}>{'Welcome back ' + getUser().first_name}</Text>
                </View>
                <View className={`${Styles.Card} mt-3`}>
                    <Text className={Styles.H3 + " mb-3"}>Your Subjects</Text>
                    {subjects.length === 0 ? (
                        <Text className={Styles.emptyText}>No subjects found.</Text>
                    ) : (
                        subjects.map((subject) => (
                            <View key={subject.id} className={Styles.subjectItem}>
                                <View>
                                    <Text className={Styles.subjectTitle}>{subject.title}</Text>
                                    <Text className={Styles.subjectDescription}>{subject.description}</Text>
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
                    {/* Add Subject */}
                    <View className={`${Styles.Card} mt-3`}>
                        <Text className={Styles.H3 + " mb-4"}>Add New Subject</Text>
                        <TextInput
                            placeholder="Subject Title"
                            value={newSubjectTitle}
                            placeholderTextColor="#9CA3AF"
                            onChangeText={setNewSubjectTitle}
                            className={Styles.Input + " mb-2"}
                        />
                        <TextInput
                            placeholder="Subject Description"
                            value={newSubjectDescription}
                            placeholderTextColor="#9CA3AF"
                            onChangeText={setNewSubjectDescription}
                            className={Styles.Input + " mb-2"}
                        />
                        <AppButton
                            title={loading ? "Adding..." : "Add Subject"}
                            onPress={handleAddSubject}
                            disable={loading}
                        />
                    </View>
                </View>


                {/* Events Section */}
                <View className={`${Styles.Card} mt-3`}>
                    <Text className={Styles.H3 + " mb-4"}>Events for Your Subjects</Text>
                    <View className="mb-4 mt-3">
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
                                        <Text className={Styles.EventCardDate}>Due: {new Date(event.date_till).toLocaleString()}</Text>
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
                    {/* Add Event */}
                    <View className={`${Styles.Card} mt-3`}>
                        <Text className={Styles.H3 + " mb-4"}>Add New Event</Text>
                        <View className={Styles.Input + " h-[52px] mb-2 px-0.5"}>
                            <Picker
                                selectedValue={newEventType}
                                onValueChange={(itemValue) => setNewEventType(itemValue)}
                                dropdownIconColor="#333"
                                style={{ fontSize: 13.5 }}
                            >
                                <Picker.Item style={{ fontSize: 13.5 }} label="Select type" value={null} />
                                <Picker.Item style={{ fontSize: 13.5 }} key={"exam"} label={"exam"} value={"exam"} />
                                <Picker.Item style={{ fontSize: 13.5 }} key={"assignment"} label={"assignment"} value={"assignment"} />
                            </Picker>
                        </View>
                        <View className={Styles.Input + " h-[52px] mb-2 px-0.5"}>
                            <Picker
                                selectedValue={newEventSubjectId}
                                onValueChange={(itemValue) => setNewEventSubjectId(itemValue)}
                                dropdownIconColor="#333"
                                style={{ fontSize: 13.5 }}
                            >
                                <Picker.Item style={{ fontSize: 13.5 }} label="Select subject" value={null} />
                                {subjects.map((subject) => (
                                    <Picker.Item style={{ fontSize: 13.5 }} key={subject.id} label={subject.title} value={subject.id} />
                                ))}
                            </Picker>
                        </View>
                        <TextInput
                            placeholder="Event Title"
                            placeholderTextColor="#9CA3AF"
                            value={newEventTitle}
                            onChangeText={setNewEventTitle}
                            className={Styles.Input + " mb-2"}
                        />
                        <TextInput
                            placeholder="Due Date (YYYY-MM-DD HH:MM)"
                            placeholderTextColor="#9CA3AF"
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
                </View>


                {/* Lectures Section */}
                <View className={`${Styles.Card} mt-3`}>
                    <Text className={Styles.H3 + " mb-4"}>Lectures</Text>
                    {lectures.length === 0 ? (
                        <Text className={Styles.emptyText}>No lectures found.</Text>
                    ) : (
                        lectures.map((lecture) => (
                            <View key={lecture.id} className={Styles.EventCardItem + " flex-row justify-between items-center"}>
                                <View>
                                    <Text className={Styles.EventCardTitle}>
                                        {subjects.find(s => s.id === lecture.subject_id)?.title || "Unknown Subject"}
                                    </Text>
                                    <Text className={Styles.EventCardSubject}>
                                        {lecture.day} {formatTime(lecture.from_time)} - {formatTime(lecture.to_time)}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDeleteLecture(lecture.id)}
                                    className={Styles.deleteButton}
                                >
                                    <Text className={Styles.deleteButtonText}>×</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                    <View className={`${Styles.Card} mt-3`}>
                        <Text className={Styles.H3 + " mb-4"}>Add New Lecture</Text>
                        <View className={Styles.Input + " h-[52px] mb-2 px-0.5"}>
                            <Picker
                                selectedValue={newLectureSubjectId}
                                onValueChange={(itemValue) => setNewLectureSubjectId(itemValue)}
                                dropdownIconColor="#333"
                                style={{ fontSize: 13.5 }}
                            >
                                <Picker.Item style={{ fontSize: 13.5 }} label="Select subject" value={null} />
                                {subjects.map((subject) => (
                                    <Picker.Item style={{ fontSize: 13.5 }} key={subject.id} label={subject.title} value={subject.id} />
                                ))}
                            </Picker>
                        </View>
                        <TextInput
                            placeholder="Day (e.g. Monday)"
                            placeholderTextColor="#9CA3AF"
                            value={newLectureDay}
                            onChangeText={setNewLectureDay}
                            className={Styles.Input + " mb-2"}
                        />
                        <TextInput
                            placeholder="From Time (HH:MM)"
                            placeholderTextColor="#9CA3AF"
                            value={newLectureFromTime}
                            onChangeText={setNewLectureFromTime}
                            className={Styles.Input + " mb-2"}
                        />
                        <TextInput
                            placeholder="To Time (HH:MM)"
                            placeholderTextColor="#9CA3AF"
                            value={newLectureToTime}
                            onChangeText={setNewLectureToTime}
                            className={Styles.Input + " mb-2"}
                        />
                        <AppButton
                            title={loading ? "Adding..." : "Add Lecture"}
                            onPress={handleAddLecture}
                            disable={loading}
                        />
                    </View>
                </View>
                {/* Add Lecture */}


                {/* Seminars Section */}
                <View className={`${Styles.Card} mt-3`}>
                    <Text className={Styles.H3 + " mb-4"}>Seminars</Text>
                    {seminars.length === 0 ? (
                        <Text className={Styles.emptyText}>No seminars found.</Text>
                    ) : (
                        seminars.map((seminar) => (
                            <View key={seminar.id} className={Styles.EventCardItem + " flex-row justify-between items-center"}>
                                <View>
                                    <Text className={Styles.EventCardTitle}>
                                        {subjects.find(s => s.id === seminar.subject_id)?.title || "Unknown Subject"}
                                    </Text>
                                    <Text className={Styles.EventCardSubject}>
                                        {seminar.day} {formatTime(seminar.from_time)} - {formatTime(seminar.to_time)}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDeleteSeminar(seminar.id)}
                                    className={Styles.deleteButton}
                                >
                                    <Text className={Styles.deleteButtonText}>×</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                    {/* Add Seminar */}
                    <View className={`${Styles.Card} mt-3 mb-7`}>
                        <Text className={Styles.H3 + " mb-4"}>Add New Seminar</Text>
                        <View className={Styles.Input + " h-[52px] mb-2 px-0.5"}>
                            <Picker
                                selectedValue={newSeminarSubjectId}
                                onValueChange={(itemValue) => setNewSeminarSubjectId(itemValue)}
                                dropdownIconColor="#333"
                                style={{ fontSize: 13.5 }}
                            >
                                <Picker.Item style={{ fontSize: 13.5 }} label="Select subject" value={null} />
                                {subjects.map((subject) => (
                                    <Picker.Item style={{ fontSize: 13.5 }} key={subject.id} label={subject.title} value={subject.id} />
                                ))}
                            </Picker>
                        </View>
                        <TextInput
                            placeholder="Day (e.g. Monday)"
                            placeholderTextColor="#9CA3AF"
                            value={newSeminarDay}
                            onChangeText={setNewSeminarDay}
                            className={Styles.Input + " mb-2"}
                        />
                        <TextInput
                            placeholder="From Time (HH:MM)"
                            placeholderTextColor="#9CA3AF"
                            value={newSeminarFromTime}
                            onChangeText={setNewSeminarFromTime}
                            className={Styles.Input + " mb-2"}
                        />
                        <TextInput
                            placeholder="To Time (HH:MM)"
                            placeholderTextColor="#9CA3AF"
                            value={newSeminarToTime}
                            onChangeText={setNewSeminarToTime}
                            className={Styles.Input + " mb-2"}
                        />
                        <AppButton
                            title={loading ? "Adding..." : "Add Seminar"}
                            onPress={handleAddSeminar}
                            disable={loading}
                        />
                    </View>
                </View>

            </View>
        </ScrollView>
    );
}