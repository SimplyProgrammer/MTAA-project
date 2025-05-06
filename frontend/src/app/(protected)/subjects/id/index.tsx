import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import * as Styles from "@/components/styles";
import { useLocalSearchParams } from "expo-router";
import api from "@/libs/axios";
import { getUser } from "@/libs/auth";

export default function TimelineScreen() {
    const { name, id, desc } = useLocalSearchParams();
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
            <Text className={Styles.H2}>{name}</Text>
            <Text className="my-3">{desc}</Text>

            <Text className={`${Styles.H3} mt-6 my-3`}>Evaluations</Text>
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

            <Text className={`${Styles.H3} mt-6 my-3`}>Events for this subject</Text>
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
        </ScrollView>
    );
}