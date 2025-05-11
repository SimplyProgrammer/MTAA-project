import AppStack from "@/components/AppStack";
import { Stack } from "expo-router";

export default function SubjectsLayout() {
  return (
    <AppStack>
      <Stack.Screen name="[studentId]/[subjectId]/index" options={{ title: "Evaluation", headerShown: true}} />
    </AppStack>
  );
}