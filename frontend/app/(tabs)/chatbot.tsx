import React, { useState, useEffect, useRef } from "react";
import Voice from "react-native-voice";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    GestureResponderEvent,
    RefreshControl,
    ScrollView, Button, ImageBackground
} from "react-native";
// import LoadingOverlay from "../LoadingOverlay";
import useLoadingState from "../useLoadingState";
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';

type Message = {
    id: string;
    text: string;
    sender: "user" | "bot";
};

const chatbot: React.FC = () => {
    // const [messages, setMessages] = useState<Message[]>([
    //     { id: "1", text: "Hi there! How can I assist you today?", sender: "bot" },
    // ]);
    const [input, setInput] = useState("");
    const [isVoiceMode, setIsVoiceMode] = useState(true); // Tracks whether it's in voice mode or keyboard mode
    const [refreshing, setRefreshing] = useState(false);
    const { isError, errorMessage, startLoading, setError, reset } = useLoadingState();

    // Load initial data
    useEffect(() => {
        loadMessages();
    }, []);

    // Load messages function
    const loadMessages = async () => {
        try {
            startLoading();
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            reset();
        } catch (error) {
            setError('Failed to load messages');
        }
    };

    // Handle pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            // Simulate refreshing data
            await new Promise(resolve => setTimeout(resolve, 1500));
            // setMessages([
            //     { id: "1", text: "Hi there! How can I assist you today?", sender: "bot" },
            // ]);
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            setError('Failed to refresh');
        }
    };

    // Handle sending a message
    const handleSend = () => {
        if (input.trim() === "") return;

        const userMessage: Message = { id: Date.now().toString(), text: input, sender: "user" };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Simulate loading state for response
        startLoading();

        setTimeout(() => {
            const botMessage: Message = {
                id: Date.now().toString(),
                text: "Thank you for your message! Let me help you with that.",
                sender: "bot",
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
            reset();
        }, 1000);

        setInput("");
    };

    // Simulate voice message
    const handleVoiceMessage = (event: GestureResponderEvent) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            text: "🎤 Voice message sent (simulate speech recognition)",
            sender: "user",
        };
        // setMessages((prevMessages) => [...prevMessages, userMessage]);

        setTimeout(() => {
            const botMessage: Message = {
                id: Date.now().toString(),
                text: "I received your voice message! Let me help you with that.",
                sender: "bot",
            };
            // setMessages((prevMessages) => [...prevMessages, botMessage]);
        }, 1000);
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === "user";
        return (
            <View
                style={[
                    styles.messageContainer,
                    isUser ? styles.userMessage : styles.botMessage,
                ]}
            >
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };




    // Abdellah Qodsi
    const [messages, setMessages] = useState([]);
    const scrollViewRef = useRef(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        const thinkingMessage = { role: "bot", content: "⏳ I'm thinking..." };

        setMessages(prev => [...prev, userMessage, thinkingMessage]);
        setInput("");

        try {
            

            const res = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    model: "mistralai/mistral-7b-instruct",
    messages: [{ role: "user", content: input }]
  },
  {
    headers: {
      Authorization: "Bearer ???", 
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost"
    }
  }
);


const botReply = res.data.choices?.[0]?.message?.content || "No reply";



            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "bot", content: botReply };
                return updated;
            });

        } catch (error) {
            console.error("Erreur Hugging Face :", error.message);

            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "bot", content: "Erreur API" };
                return updated;
            });
        }
    };


    // End Abdellah Qodsi

    return (
        <>
            {/* Header */}
            <ImageBackground
                source={{
                    uri: "https://images.ctfassets.net/bth3mlrehms2/2qHworX4SxuqmcIVQ0BQhx/2bf600001f20beb5a584cf9fbdf49a18/China_Hong_Kong_Skyline.jpg",
                }} style={styles.hero} resizeMode="cover" >
                <View style={styles.overlay} />
                <View style={styles.heroContent}>
                    <Text style={styles.heroTitle}>Chat with Assistant</Text>
                    <Text style={styles.heroSubtitle}>Let me guild your trip</Text>
                </View>
            </ImageBackground>


            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >


                {/* Chat Area */}
                <ScrollView style={styles.scroll}>
                    {messages.map((msg, i) => (
                        <View
                            key={i}
                            style={[
                                styles.messageContainer,
                                msg.role === 'user' ? styles.userMessage : styles.botMessage,
                            ]}
                        >
                            <Text style={styles.messageText}>{msg.content}</Text>
                        </View>
                    ))}
                </ScrollView>



                {/* Input Area */}
                <View style={styles.inputContainer}>

                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => setIsVoiceMode(!isVoiceMode)}
                    >
                        <Ionicons
                            name={isVoiceMode ? "chatbubble-ellipses-outline" : "mic-outline"}
                            size={24}
                            color="#fe7f2d"
                        />
                    </TouchableOpacity>


                    <TextInput
                        style={styles.textInput}
                        placeholder="Type your message..."
                        placeholderTextColor="#999"
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                        <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({


    // chatbot 
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 10,
    },
    scroll: {
        flex: 1,
        marginBottom: 10,
        backgroundColor: "white",
        padding: 20,
    },
    messageContainer: {
        padding: 10,
        borderRadius: 12,
        marginVertical: 5,
        maxWidth: '80%',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#fe7f2d',
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#e5e7eb',
    },
    messageText: {
        color: 'black',
        fontSize: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 12,
        alignItems: 'center',
        elevation: 2,
    },
    input: {
        flex: 1,
        height: 45,
        fontSize: 16,
        color: '#333',
    },
    sendButton: {
        backgroundColor: '#fe7f2d',
        padding: 10,
        borderRadius: 20,
        marginLeft: 8,
    },

    // header 
    hero: {
        height: 400,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1,
    },
    heroContent: {
        zIndex: 2,
        alignItems: "center",
        paddingHorizontal: 20,
    },
    heroTitle: {
        fontSize: 56,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 8,
        textAlign: "center",
    },
    heroSubtitle: {
        fontSize: 18,
        color: "#f1f5f9",
        textAlign: "center",
        maxWidth: 600,
    },
    backBtn: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fe7f2d",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
        backdropFilter: "blur(4px)",
        gap: 6,
    },
    backText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    container1: {
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 0,
        margin: 0,
    },
    // end header


    header: {
        // marginTop: 50,
        flexDirection: "column",
        padding: 16,
        backgroundColor: "#fe7f2d",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginLeft: 2,
        marginBottom: 8,
    },
    chatArea: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "#f9f9f9",
    },

    toggleButton: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#eaeaea",
        borderRadius: 20,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
        color: "#333",
    },
    voiceButton: {
        flex: 1,
        height: 38,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fe7f2d",
        borderRadius: 12,
    },
    voiceButtonText: {
        color: "white",
        fontSize: 16,
    },
});

export default chatbot;