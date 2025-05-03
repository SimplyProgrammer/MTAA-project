import React from "react";
import { View, Text } from "react-native";
import { Screen } from "@/components/styles";
import { useLocalSearchParams } from "expo-router";

export default function TimelineScreen() {
    const { name } = useLocalSearchParams();

    return (
        <View className={`${Screen}`}>
            <Text>Subject info</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 12 }}>{name}</Text>
        </View>
    );
};