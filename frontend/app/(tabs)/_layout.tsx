import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const _Layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    paddingVertical: 10, // Add vertical padding inside the tab bar
                    backgroundColor: "#fff", // Set background color for the tab bar
                    borderTopWidth: 1, // Optional: Add a border at the top of the tab bar
                    borderTopColor: "#ccc", // Optional: Set border color
                },
                tabBarLabelStyle: {
                    fontSize: 8, // Optional: Adjust label font size for better spacing
                    marginBottom: 8, // Add spacing between the label and icon
                },
                tabBarIconStyle: {
                    marginTop: 8,
                    marginVertical: 2, // Add spacing around the icon
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size} />
                    ),
                    headerShown: false,
                }}
            />
            {/* <Tabs.Screen
                name="categories"
                options={{
                    title: "Categories",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid-outline" color={color} size={size} />
                    ),
                    headerShown: false,
                }}
            /> */}
            <Tabs.Screen
                name="saved"
                options={{
                    title: "Saved",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bookmark-outline" color={color} size={size} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="chatbot"
                options={{
                    title: "Chatbot",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubble-outline" color={color} size={size} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="itinerary"
                options={{
                    title: "Itinerary",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" color={color} size={size} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="SpendPlaner"
                options={{
                    title: "Spend Planer",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="card-outline" color={color} size={size} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" color={color} size={size} />
                    ),
                    headerShown: false,
                }}
            />

        </Tabs>
    );
};

export default _Layout;