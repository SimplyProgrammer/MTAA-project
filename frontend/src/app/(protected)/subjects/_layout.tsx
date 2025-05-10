import AppStack from "@/components/AppStack";
import { Stack } from "expo-router";

export default function SubjectsLayout() {
  return (
    <AppStack>
      <Stack.Screen name="index" options={{ title: "", headerShown: false}} />
    </AppStack>
  );
}