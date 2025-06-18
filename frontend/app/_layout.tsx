import { Stack } from "expo-router";
import './globals.css'
import ExpenseScreen from "./ExpenseScreen";
export default function RootLayout() {
  return <Stack>
    <Stack.Screen
      name="(tabs)"
      options={{headerShown: false}}
    />
    <Stack.Screen
        name="destinations/[id]"
        options={{headerShown: false}}
    />
    <Stack.Screen
      name="ExpenseScreen"
      options={{ headerShown: false }}
    />
    <Stack.Screen
        name="blog/[id]"
        options={{headerShown: false}}
    />

  </Stack>;
}
