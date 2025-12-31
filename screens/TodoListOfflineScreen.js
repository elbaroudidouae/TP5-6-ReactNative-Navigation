import { View, Text, FlatList, Button, TextInput } from "react-native";
import { useEffect, useState, useContext } from "react";
import { loadTodos, addTodoOffline, updateTodoOffline, deleteTodoOffline } from "../services/database";
import { ThemeContext } from "../context/ThemeContext";

export default function TodoListOfflineScreen() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");
    const [editingId, setEditingId] = useState(null);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const refreshTodos = () => {
        setTodos(loadTodos());
    };

    const handleAddOrUpdate = () => {
        if (!title.trim()) return;
        if (editingId) {
            // UPDATE OFFLINE
            updateTodoOffline(editingId, title);
            setEditingId(null);
        } else {
            // ADD OFFLINE
            addTodoOffline(title);
        }
        setTitle("");
        refreshTodos();
    };

    const handleDelete = (id) => {
        deleteTodoOffline(id);
        refreshTodos();
    };

    useEffect(() => {
        refreshTodos();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {/* Theme toggle */}
            <Button title={`Passer en mode ${theme === "light" ? "dark" : "light"}`} onPress={toggleTheme} />

            {/* Add / Update */}
            <View style={{ padding: 10 }}>
                <TextInput
                    placeholder="Tâche offline"
                    placeholderTextColor={theme === "dark" ? "#aaa" : "#555"}
                    value={title}
                    onChangeText={setTitle}
                    style={{
                        borderWidth: 1,
                        borderColor: theme === "dark" ? "#fff" : "#000",
                        padding: 10,
                        marginBottom: 10,
                        color: theme === "dark" ? "#fff" : "#000",
                        backgroundColor: theme === "dark" ? "#333" : "#fff"
                    }}
                />
                <Button title={editingId ? "✏️ Mettre à jour" : "➕ Ajouter hors ligne"} onPress={handleAddOrUpdate} />
            </View>

            {todos.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20, color: theme === "dark" ? "#fff" : "#000" }}>
                    Aucune tâche disponible hors ligne
                </Text>
            ) : (
                <FlatList
                    data={todos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: "#ccc"
                            }}
                        >
                            <Text style={{ color: theme === "dark" ? "#ffffff" : "#000000", flex: 1 }}>{item.title}</Text>
                            <View style={{ flexDirection: "row", gap: 10 }}>
                                <Button
                                    title="✏️"
                                    onPress={() => {
                                        setTitle(item.title);
                                        setEditingId(item.id);
                                    }}
                                />
                                <Button
                                    title="🗑️"
                                    color="red"
                                    onPress={() => handleDelete(item.id)}
                                />
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}
