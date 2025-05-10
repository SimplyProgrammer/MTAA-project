import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import * as Styles from "@/components/styles";
import { useLocalSearchParams } from "expo-router";
import api from "@/libs/axios";
import { getUser } from "@/libs/auth";

export default function TimelineScreen() {
    const { id } = useLocalSearchParams();
    const [subject, setSubject] = useState<any>(null);
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const user = getUser();
                if (!user?.id || !id) {
                    setError("Missing user or subject id.");
                    setLoading(false);
                    return;
                }
                // Fetch subject details
                const subjectData = await api.get_auth_data(`subjects/${id}`);
                setSubject(subjectData?.data || subjectData);

                // Fetch evaluations
                const evalData = await api.get_auth_data(`evaluations?user_id=${user.id}&subject_id=${id}`);
                setEvaluations(Array.isArray(evalData) ? evalData : evalData?.data || []);
                // Fetch events for this subject
                const eventsData = await api.get_auth_data(`events?subject_id=${id}`);
                setEvents(Array.isArray(eventsData) ? eventsData : eventsData?.data || []);
            } catch (err: any) {
                setError(err?.data?.message || "Failed to load data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    return (
        <ScrollView className={Styles.ScrollViewContainer}>

            <View className={``}>
                <View className={Styles.Card + "mt-3 items-center"}>
                   {loading && !subject ? (
                        <ActivityIndicator />
                    ) : subject ? (
                        <>
                            <Text className={Styles.H2}>{subject.title}</Text>
                            <Text className={Styles.basicText + " mt-3"}>{subject.description}</Text>
                        </>
                    ) : (
                        <Text className={Styles.emptyText}>Subject not found.</Text>
                    )}
                </View>
            </View>

            <View className={``}>
                <View className={`${Styles.Card} mt-5`}>
                    <Text className={`${Styles.H3} mb-3`}>Evaluations</Text>
                    {loading ? (
                        <ActivityIndicator />
                    ) : error ? (
                        <Text className={Styles.emptyText}>{error}</Text>
                    ) : evaluations.length === 0 ? (
                        <Text className={Styles.emptyText}>No evaluations found.</Text>
                    ) : (
                        <View>
                            {evaluations.map((ev) => (
                                <View key={ev.id} className={Styles.EventCardItem}>
                                    <Text className={Styles.EventCardTitle}>{ev.title}</Text>
                                    <Text className={Styles.EventCardSubject}>
                                        Points: {ev.points} / {ev.max_points}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
                <View className={`${Styles.Card} mt-5 mb-7`}>
                    <Text className={`${Styles.H3} mb-3`}>Events for this subject</Text>
                    {loading ? (
                        <ActivityIndicator />
                    ) : error ? (
                        <Text className={Styles.emptyText}>{error}</Text>
                    ) : events.length === 0 ? (
                        <Text className={Styles.emptyText}>No events found.</Text>
                    ) : (
                        <View>
                            {events.map((event) => (
                                <View key={event.id} className={Styles.EventCardItem}>
                                    <Text className={Styles.EventCardTitle}>{event.title}</Text>
                                    <Text className={Styles.EventCardSubject}>
                                        Type: {event.type}
                                    </Text>
                                    <Text className={Styles.EventCardDate}>
                                        {new Date(event.date_till).toLocaleString()}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>



        </ScrollView>
    );
}