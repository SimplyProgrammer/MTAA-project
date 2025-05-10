import AppStack from "@/components/AppStack";
import { Stack } from "expo-router";

export default function SubjectsLayout() {
  return (
    <AppStack>
      <Stack.Screen name="[id]/index" options={{ title: "Subject Detail", headerShown: true}} />
    </AppStack>
  );
}