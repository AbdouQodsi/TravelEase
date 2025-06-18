import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import { BlurView } from "expo-blur";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const router = useRouter();
const { height } = Dimensions.get("window");

// Define the types for the props
type ScreenProps = {
  onProceed?: () => void; // For the WelcomeScreen
  onSwitch?: () => void;  // For LoginScreen and SignUpScreen
};

const Profile: React.FC = () => {
  const [screen, setScreen] = useState<"welcome" | "login" | "signup" | "loggedIn">("welcome");

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        setScreen("loggedIn");
      }
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
    setScreen("welcome");
    window.location.href = "http://localhost:8081";
  };


  return (
    <View style={styles.background}>
      {screen === "welcome" && <WelcomeScreen onProceed={() => setScreen("login")} />}

      {screen === "login" && (
        <BlurView intensity={50} style={styles.welcomeBlur} tint="light">
          <LoginScreen
            onSwitch={() => setScreen("signup")}
            onLoginSuccess={(u) => {
              setUser(u);
              setScreen("loggedIn");
            }}
          />
        </BlurView>
      )}

      {screen === "signup" && (
        <BlurView intensity={50} style={styles.welcomeBlur} tint="light">
          <SignUpScreen onSwitch={() => setScreen("login")} />
        </BlurView>
      )}

      {screen === "loggedIn" && user && (
        <LoggedInProfile user={user} onLogout={handleLogout} />
      )}
    </View>

  );
};

// Welcome Screen
const WelcomeScreen: React.FC<ScreenProps> = ({ onProceed }) => (
  <ImageBackground
    source={{
      uri: 'https://toposmagazine.com/wp-content/uploads/2022/06/Hong_Kong_Harbour_Night_2019-06-11-min-scaled-aspect-ratio-16-9-scaled.jpeg',
    }} style={styles.backgroundImage} resizeMode="cover" >
    <View style={styles.overlay}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Travel around the world 🌍</Text>
        <Text style={styles.subtitle}>Design your Journey With Us</Text>
        <TouchableOpacity style={styles.exploreButton} onPress={onProceed}>
          <Text style={styles.buttonText}>Start Your Adventure</Text>
        </TouchableOpacity>
      </View>
    </View>
  </ImageBackground>
);




// Login Screen
const LoginScreen: React.FC<{ onSwitch: () => void; onLoginSuccess: (user: any) => void; }> = ({ onSwitch, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8082/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const message = await res.text();
        setError(message || "Invalid credentials");
        return;
      }

      const user = await res.json();
      await AsyncStorage.setItem("user", JSON.stringify(user));
      onLoginSuccess(user);
      window.location.href = "http://localhost:8081";
       
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <View style={styles.container0}>
        <View style={styles.containerimage} />
        <View style={styles.containerContent}>
          <View style={styles.popup}>
            <View style={styles.formCard}>
              <Text style={styles.title1}>Login</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#ccc"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#ccc"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity style={styles.exploreButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSwitch}>
                <Text style={styles.switchText}>Don't Have An Account? Sign Up Now!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

    </>
  );
};


// Logged In Profile 
const LoggedInProfile: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  return (
    <View style={styles.container12}>
      <Text style={styles.header}>My Profile</Text>

      <View style={styles.profileCard}>
        <Image
          source={{
            uri: 'https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.settingsBox}>
          <Text style={styles.settingsTitle}>Settings</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push("/ExpenseScreen")}
          >
            <Text style={styles.settingText}>Saved Expenses</Text>
            <Feather name="chevron-right" size={20} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={onLogout}>
            <Text style={styles.settingText}>Log out</Text>
            <Feather name="chevron-right" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


// Sign Up Screen
const SignUpScreen: React.FC<ScreenProps> = ({ onSwitch }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8082/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const message = await response.text();

      if (!response.ok) {
        if (response.status === 409) {
          setError("This email is already used. Please use another.");
        } else {
          setError(message || "Signup failed.");
        }
      } else {
        setFirstName(""); setLastName(""); setEmail(""); setPassword("");
        onSwitch?.();
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <>
      <View style={styles.container0}>
        <View style={styles.containerimage} />
        <View style={styles.containerContent}>
          <View style={styles.popup}>
            <View style={styles.formCard}>
              <Text style={styles.title1}>Sign up</Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#ccc"
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#ccc"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#ccc"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#ccc"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity style={styles.exploreButton} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSwitch}>
                <Text style={styles.switchText}>Already have an account? Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

    </>
  );
};


const styles = StyleSheet.create({
  // Sign up Screen 
  container0: {
    flex: 1,
    width: '100%',
    height: '100vh',
    backgroundColor: '#f5f7fa',
    flexDirection: 'column',
    position: 'relative',
  },

  containerimage: {
    width: '100%',
    height: '35%',
    backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://toposmagazine.com/wp-content/uploads/2022/06/Hong_Kong_Harbour_Night_2019-06-11-min-scaled-aspect-ratio-16-9-scaled.jpeg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },


  containerContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '70%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    zIndex: 10,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 15,
    marginBottom: 16,
    color: '#0f172a',
    outlineStyle: 'none',
    transition: 'border 0.2s',
    width: "100%",
  },

  errorText: {
    color: '#dc2626',
    marginBottom: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  switchText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    marginTop: 10,
  },
  titleq: {
    fontSize: 44,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
    textAlign: 'center',
  },
  // End Sign Up


  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 30,
  },
  title1: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 25,
  },
  input1: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f5f7fa',
  },
  forgotText: {
    alignSelf: 'flex-start',
    color: '#3366cc',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b6fd5',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText1: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  signupText: {
    fontSize: 14,
    color: '#444',
  },
  signupLink: {
    color: '#3366cc',
    fontWeight: '500',
  },

  // WelcomeScreen
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 600,
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 26,
    color: '#e2e8f0',
    marginBottom: 32,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: '#fe7f2d',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },

  // fin Welcome Screen

  //   Logged In Profile 
  container12: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 30,
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 75,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
  },
  email: {
    fontSize: 17,
    color: '#64748b',
    marginTop: 4,
  },
  settingsSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingText: {
    fontSize: 17,
    color: '#1e293b',
  },

  profileCard: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 650,
    borderRadius: 16,
    padding: 46,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  settingsBox: {
    width: "100%",
    marginTop: 20,
  },
  //  End Logged In Profile 




  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  roundedImage: {
    marginTop: 45,
    width: 350,
    height: 445,
    borderRadius: 54,
    marginBottom: 50,
  },
  welcomeTitle: {
    position: "absolute",
    top: 128,
    fontSize: 40,
    fontWeight: "bold",
    color: "#888",
    textAlign: "center",
    zIndex: 1,
  },
  welcomeSubtitle: {
    width: 350,
    fontSize: 22,
    paddingLeft: 12,
    color: "#666",
    marginBottom: 20,
    textAlign: "left",
  },

  formCard: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 15,
    width: 400,
    alignItems: "center",
  },

  continueButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  orText: {
    marginVertical: 15,
    fontSize: 18,
    color: "#999",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "82%",
    marginBottom: 20,
  },
  socialIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    alignItems: "center",
  },

  popup1: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "65%",
    // backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  welcomeBlur: {
    ...StyleSheet.absoluteFillObject, // Ensures the blur covers the full screen
    zIndex: -1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;