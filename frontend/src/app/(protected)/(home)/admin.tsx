import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TextInput, Button } from "react-native";
import api from "@/libs/axios";
import { Screen } from "@/components/styles";
import AppButton from "@/components/AppButton";
import { router, useSegments } from "expo-router";

export default function AdminScreen() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersData = await api.get_auth_data("/users/accounts");
      const usersArr: any[] = Array.isArray(usersData)
        ? usersData
        : usersData?.data || [];
      setStudents(usersArr);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    setFormError(null);
    setFormSuccess(null);
    if (!firstName || !lastName || !email || !password) {
      setFormError("All fields are required.");
      return;
    }
    try {
      const res = await api.post("/auth/signup", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      setFormSuccess("User added successfully.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      fetchStudents();
    } catch (err: any) {
      setFormError(err?.response?.data?.error || err?.data?.message || "Failed to add user.");
    }
  };

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
      }}
    >
      <View style={{ width: "100%", maxWidth: 600 }}>
        

        <Text style={styles.header}>All users</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.headerCell]}>ID</Text>
          <Text style={[styles.cell, styles.headerCell]}>First Name</Text>
          <Text style={[styles.cell, styles.headerCell]}>Last Name</Text>
          <Text style={[styles.cell, styles.headerCell]}>Email</Text>
        </View>
        {students.length === 0 ? (
          <Text>No users found.</Text>
        ) : (
          students.map((student) => (
            <View key={student.id} style={styles.tableRow}>
              <Text style={styles.cell}>{student.id}</Text>
              <Text style={styles.cell}>{student.first_name}</Text>
              <Text style={styles.cell}>{student.last_name}</Text>
              <Text style={styles.cell}>{student.email}</Text>
            </View>
          ))
        )}

<Text style={styles.header}>Add new user</Text>
        <View style={styles.formRow}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.formRow}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <AppButton title="Add" className={`mt-2`} onPress={handleAddUser} />

        {formError && <Text  style={styles.error}>{formError}</Text>}
        {formSuccess && <Text style={styles.success}>{formSuccess}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 18,
    textAlign: "left",
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    backgroundColor: "#fff",
    marginHorizontal: 2,
  },
  error: {
    color: "#ef4444",
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
  },
  success: {
    color: "#22c55e",
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e7ff",
    borderRadius: 6,
    paddingVertical: 8,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    paddingVertical: 8,
    marginBottom: 2,
  },
  cell: {
    flex: 1,
    fontSize: 13,
    paddingHorizontal: 4,
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 14,
  },
});