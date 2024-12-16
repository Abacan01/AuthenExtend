import React, { useState, useEffect } from 'react'; 
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Image,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        address: '',
        profilePicture: '',
    });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        const status = await AsyncStorage.getItem('isLoggedIn');
        if (status === 'true') {
            const storedProfile = JSON.parse(await AsyncStorage.getItem('profile'));
            if (storedProfile) setProfile(storedProfile);
            setIsLoggedIn(true);
        }
    };

    const handleLoginRegister = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (isLogin) {
            const storedProfile = JSON.parse(await AsyncStorage.getItem('profile'));
            if (
                storedProfile &&
                storedProfile.username === username &&
                storedProfile.password === password
            ) {
                await AsyncStorage.setItem('isLoggedIn', 'true');
                setProfile(storedProfile);
                setIsLoggedIn(true);
                Alert.alert('Success', 'Logged in successfully');
            } else {
                Alert.alert('Error', 'Invalid credentials');
            }
        } else {
            if (Object.values(profile).some((value) => !value)) {
                Alert.alert('Error', 'Please fill in all profile fields');
                return;
            }

            const newProfile = { ...profile, username, password };
            await AsyncStorage.setItem('profile', JSON.stringify(newProfile));
            setIsLogin(true);
            Alert.alert('Success', 'Registration successful');
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('profile');
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
    };

    const handleSaveProfile = async () => {
        if (Object.values(profile).some((value) => !value)) {
            Alert.alert('Error', 'Please fill in all profile fields');
            return;
        }
        await AsyncStorage.setItem('profile', JSON.stringify(profile));
        setEditMode(false);
        Alert.alert('Success', 'Profile updated successfully');
    };

    if (isLoggedIn) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.profileContainer}>
                    <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: profile.profilePicture || 'https://via.placeholder.com/120' }}
                        style={styles.avatar}
                    />
                    </View>
                    {editMode ? (
                        <>
                            <Text style={styles.formTitle}>Edit Profile</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="First Name"
                                value={profile.firstName}
                                onChangeText={(text) =>
                                    setProfile((prev) => ({ ...prev, firstName: text }))
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Last Name"
                                value={profile.lastName}
                                onChangeText={(text) =>
                                    setProfile((prev) => ({ ...prev, lastName: text }))
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={profile.email}
                                onChangeText={(text) =>
                                    setProfile((prev) => ({ ...prev, email: text }))
                                }
                                keyboardType="email-address"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Contact Number"
                                value={profile.contactNumber}
                                onChangeText={(text) =>
                                    setProfile((prev) => ({ ...prev, contactNumber: text }))
                                }
                                keyboardType="phone-pad"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Address"
                                value={profile.address}
                                onChangeText={(text) =>
                                    setProfile((prev) => ({ ...prev, address: text }))
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Profile Picture URL"
                                value={profile.profilePicture}
                                onChangeText={(text) =>
                                    setProfile((prev) => ({ ...prev, profilePicture: text }))
                                }
                            />
                            <TouchableOpacity style={styles.mainButton} onPress={handleSaveProfile}>
                                <Text style={styles.buttonText}>Save Profile</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.profileText}>Name: {`${profile.firstName} ${profile.lastName}`}</Text>
                            <Text style={styles.profileText}>Email: {profile.email}</Text>
                            <Text style={styles.profileText}>Contact: {profile.contactNumber}</Text>
                            <Text style={styles.profileText}>Address: {profile.address}</Text>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => setEditMode(true)}
                            >
                                <Text style={styles.buttonText}>Edit Profile</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
                    {!isLogin && (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="First Name"
                                value={profile.firstName}
                                onChangeText={(text) =>
                                    setProfile((prev) => ({ ...prev, firstName: text }))
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Last Name"
                                value={profile.lastName}
                                onChangeText={(text) =>
                                    setProfile((prev) => ({ ...prev, lastName: text }))
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={profile.email}
                                onChangeText={(text) =>
                                    setProfile((prev) => ({ ...prev, email: text }))
                                }
                                keyboardType="email-address"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Contact Number"
                                value={profile.contactNumber}
                                onChangeText={(text) =>
                                    setProfile((prev) => ({ ...prev, contactNumber: text }))
                                }
                                keyboardType="phone-pad"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Address"
                                value={profile.address}
                                onChangeText={(text) =>
                                    setProfile((prev) => ({ ...prev, address: text }))
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Profile Picture URL"
                                value={profile.profilePicture}
                                onChangeText={(text) =>
                                    setProfile((prev) => ({ ...prev, profilePicture: text }))
                                }
                            />
                        </>
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.mainButton} onPress={handleLoginRegister}>
                        <Text style={styles.buttonText}>
                            {isLogin ? 'Login' : 'Register'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => setIsLogin(!isLogin)}
                    >
                        <Text style={styles.switchText}>
                            {isLogin ? 'New here? Register' : 'Already have an account? Login'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eef2f3',
        padding: 16,
        justifyContent: 'center',
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    mainButton: {
        backgroundColor: '#6A669D',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        paddingBottom: 10,
        paddingTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    switchButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    switchText: {
        color: '#6A669D',
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    profileContainer: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        marginVertical: 16,
        alignItems: 'left',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileText: {
        fontSize: 18,
        marginBottom: 12,
        color: '#333333',
        fontWeight: '600',
    },
    editButton: {
        backgroundColor: '#f4a261',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#e63946',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
});
