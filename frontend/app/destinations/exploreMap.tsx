import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

// Define the type for the location state
type LocationType = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

const MapPage = () => {
    const [location, setLocation] = useState<LocationType | null>(null); // Allow null state
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        (async () => {
            try {
                // Request location permissions
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setErrorMessage("Permission to access location was denied.");
                    setLoading(false);
                    return;
                }

                // Get the user's current location
                const userLocation = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching location:", error);
                setErrorMessage("An error occurred while fetching location.");
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="blue" />
                <Text style={styles.loadingText}>Loading map...</Text>
            </View>
        );
    }

    if (errorMessage) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
        );
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "gray",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
    },
});

export default MapPage;