import React from "react";
import { View, Text } from "react-native";
import { EventCardItem, EventCardTitle, EventCardSubject, EventCardDate } from "@/components/styles";

type EventCardProps = {
  title: string;
  subject: string;
  date: string;
  countdown?: { text: string; color: any };
  isPast?: boolean;
};

export default function EventCard({ title, subject, date, countdown, isPast }: EventCardProps) {
  return (
    <View
        className={EventCardItem}
      style={[
        isPast && { opacity: 0.3 },
      ]}
    >
      <Text className={EventCardTitle}>{title}</Text>
      <Text className={EventCardSubject}>{subject}</Text>
      <Text className={EventCardDate}>
        {date}
        {countdown && (
          <Text className={countdown.color}> ({countdown.text})</Text>
        )}
      </Text>
    </View>
  );
}