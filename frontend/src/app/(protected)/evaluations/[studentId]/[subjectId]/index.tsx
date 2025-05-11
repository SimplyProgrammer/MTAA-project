import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator, TextInput } from "react-native";
import * as Styles from "@/components/styles";
import { useLocalSearchParams } from "expo-router";
import api from "@/libs/axios";
import { TouchableOpacity } from "react-native";
import AppButton from "@/components/AppButton";

export default function TimelineScreen() {
    const { studentId, subjectId } = useLocalSearchParams();
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for user and subject info
    const [user, setUser] = useState<any>(null);
    const [subject, setSubject] = useState<any>(null);

    // New evaluation state
    const [newEvalTitle, setNewEvalTitle] = useState("");
    const [newEvalPoints, setNewEvalPoints] = useState("");
    const [newEvalMaxPoints, setNewEvalMaxPoints] = useState("");

    const handleDeleteEvaluation = async (id: number) => {
        try {
            await api.delete_auth_data(`evaluations/${id}`);
            setEvaluations((prev) => prev.filter((ev) => ev.id !== id));
        } catch (err) {
            setError("Failed to delete evaluation.");
        }
    };

    const handleAddEvaluation = async () => {
        if (!newEvalTitle || !newEvalPoints || !newEvalMaxPoints) {
            setError("Please fill in all fields.");
            return;
        }
        setError(null);
        try {
            const res = await api.post_auth_data("evaluations", {
                user_id: studentId,
                subject_id: subjectId,
                title: newEvalTitle,
                points: Number(newEvalPoints),
                max_points: Number(newEvalMaxPoints),
            });
            if (res) {
                setEvaluations((prev) => [...prev, res]);
                setNewEvalTitle("");
                setNewEvalPoints("");
                setNewEvalMaxPoints("");
            } else {
                setError("Failed to add evaluation.");
            }
        } catch (err) {
            setError("Failed to add evaluation.");
        }
    };

    useEffect(() => {
        const fetchUserAndSubject = async () => {
            setLoading(true);
            setError(null);
            try {
                if (studentId) {
                    const userRes = await api.get_auth_data(`users/accounts/${studentId}`);
                    setUser(userRes?.data || userRes);
                }
                if (subjectId) {
                    const subjectRes = await api.get_auth_data(`subjects/${subjectId}`);
                    setSubject(subjectRes?.data || subjectRes);
                }
                // Fetch evaluations
                if (studentId && subjectId) {
                    const evalRes = await api.get_auth_data(`evaluations?user_id=${studentId}&subject_id=${subjectId}`);
                    setEvaluations(Array.isArray(evalRes) ? evalRes : evalRes?.data || []);
                }
            } catch (err) {
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };
        if (studentId && subjectId) fetchUserAndSubject();
    }, [studentId, subjectId]);

    return (
        <ScrollView className={Styles.ScrollViewContainer}>
            <View>
                <View className={Styles.Card + " mt-3 items-center"}>
                    {loading && (!user || !subject) ? (
                        <ActivityIndicator />
                    ) : user && subject ? (
                        <>
                            <Text className={Styles.H2}>
                                {user.first_name} {user.last_name}
                            </Text>
                            <Text className={Styles.basicText + " mt-2"}>
                                {subject.title}
                            </Text>
                        </>
                    ) : (
                        <Text className={Styles.emptyText}>Loading user and subject...</Text>
                    )}
                </View>
                <View className={Styles.Card + " mt-3 items-center"}>
                    {loading ? (
                        <ActivityIndicator />
                    ) : error ? (
                        <Text className={Styles.emptyText}>{error}</Text>
                    ) : evaluations.length === 0 ? (
                        <Text className={Styles.emptyText}>No evaluations found.</Text>
                    ) : (
                        evaluations.map((ev) => (
                            <View key={ev.id} className={Styles.EventCardItem} style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ flex: 1 }}>
                                    <Text className={Styles.EventCardTitle}>{ev.title}</Text>
                                    <Text className={Styles.EventCardSubject}>
                                        Points: {ev.points} / {ev.max_points}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDeleteEvaluation(ev.id)}
                                    className={Styles.deleteButton}
                                >
                                    <Text className={Styles.deleteButtonText}>×</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
                {/* Add Evaluation Section */}
                <View className={Styles.Card + " mt-3 mb-7"}>
                    <Text className={Styles.H3 + " mb-4"}>Add New Evaluation</Text>
                    <TextInput
                        placeholder="Evaluation Title"
                        value={newEvalTitle}
                        placeholderTextColor="#9CA3AF"
                        onChangeText={setNewEvalTitle}
                        className={Styles.Input + " mb-2"}
                    />
                    <TextInput
                        placeholder="Points"
                        value={newEvalPoints}
                        placeholderTextColor="#9CA3AF"
                        onChangeText={setNewEvalPoints}
                        keyboardType="numeric"
                        className={Styles.Input + " mb-2"}
                    />
                    <TextInput
                        placeholder="Max Points"
                        value={newEvalMaxPoints}
                        placeholderTextColor="#9CA3AF"
                        onChangeText={setNewEvalMaxPoints}
                        keyboardType="numeric"
                        className={Styles.Input + " mb-2"}
                    />
                    <AppButton
                        title={loading ? "Adding..." : "Add Evaluation"}
                        onPress={handleAddEvaluation}
                        disable={loading}
                    />
                </View>
            </View>
        </ScrollView>
    );
}