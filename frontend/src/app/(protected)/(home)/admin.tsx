import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as Styles from "@/components/styles";
import AppButton from "@/components/AppButton";
import axios from "@/libs/axios";

export default function AdminOverviewScreen() {
    const [users, setUsers] = useState<any[]>([]);
    const [newUserFirstName, setNewUserFirstName] = useState("");
    const [newUserLastName, setNewUserLastName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await axios.get_auth_data("users/accounts");
            setUsers(response.data?.data || response.data || response || []);
        } catch (error) {
            console.error(error);
        }
    };

    // Add new user
    const handleAddUser = async () => {
        if (!newUserFirstName || !newUserLastName || !newUserEmail || !newUserPassword) {
            console.error("Please fill in all fields.");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post_auth_data("auth/signup", {
                first_name: newUserFirstName,
                last_name: newUserLastName,
                email: newUserEmail,
                password: newUserPassword,
            });
            if (response) {
                setUsers((prev) => [...prev, response]);
                setNewUserFirstName("");
                setNewUserLastName("");
                setNewUserEmail("");
                setNewUserPassword("");
            } else {
                  console.error("Failed to add user.");
            }
        } catch (error) {
              console.error("Failed to add user.");
        } finally {
            setLoading(false);
        }
    };

    // "Delete" user (set active = false)
    const handleDeleteUser = async (userId: number) => {
        try {
            setLoading(true);
            await axios.put_auth_data(`users/accounts/${userId}`, {
                first_name: users.find(u => u.id === userId)?.first_name,
                last_name: users.find(u => u.id === userId)?.last_name,
                active: false,
            });
            setUsers((prev) => prev.map(u => u.id === userId ? { ...u, active: false } : u));
        } catch (error) {
            Alert.alert("Failed to deactivate user.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <ScrollView className={Styles.ScrollViewContainer}>
            <View>
                {/* Users Section */}
                <View className={`${Styles.Card} mt-3 mb-8`}>
                    <Text className={Styles.H3 + " mb-3"}>All Users</Text>
                    {users.length === 0 ? (
                        <Text className={Styles.emptyText}>No users found.</Text>
                    ) : (
                        users.map((user) => (
                            <View key={user.id} className={Styles.subjectItem + " flex-row justify-between items-center"}>
                                <View>
                                    <Text className={Styles.subjectTitle}>
                                        {user.first_name} {user.last_name}
                                    </Text>
                                    <Text className={Styles.subjectDescription}>{user.email}</Text>
                                    <Text className={Styles.subjectDescription}>
                                        Status: {user.active ? "Active" : "Deactivated"}
                                    </Text>
                                </View>
                                {user.active && (
                                    <TouchableOpacity
                                        onPress={() => handleDeleteUser(user.id)}
                                        className={Styles.deleteButton}
                                    >
                                        <Text className={Styles.deleteButtonText}>×</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))
                    )}
                    {/* Add User */}
                    <View className={`${Styles.Card} mt-3 mb-7`}>
                        <Text className={Styles.H3 + " mb-4"}>Add New User</Text>
                        <TextInput
                            placeholder="First Name"
                            value={newUserFirstName}
                            placeholderTextColor="#9CA3AF"
                            onChangeText={setNewUserFirstName}
                            className={Styles.Input + " mb-2"}
                        />
                        <TextInput
                            placeholder="Last Name"
                            value={newUserLastName}
                            placeholderTextColor="#9CA3AF"
                            onChangeText={setNewUserLastName}
                            className={Styles.Input + " mb-2"}
                        />
                        <TextInput
                            placeholder="Email"
                            value={newUserEmail}
                            placeholderTextColor="#9CA3AF"
                            onChangeText={setNewUserEmail}
                            className={Styles.Input + " mb-2"}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            placeholder="Password"
                            value={newUserPassword}
                            placeholderTextColor="#9CA3AF"
                            onChangeText={setNewUserPassword}
                            className={Styles.Input + " mb-2"}
                            secureTextEntry
                        />
                        <AppButton
                            title={loading ? "Adding..." : "Add User"}
                            onPress={handleAddUser}
                            disable={loading}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
