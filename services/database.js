import * as SQLite from "expo-sqlite";

let db;
try {
    db = SQLite.openDatabaseSync("todos.db");
} catch (error) {
    console.log("Error opening database, might be on web or not supported yet", error);
}

export const initDB = () => {
    if (!db) return;
    try {
        db.execSync(`
      CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY,
          title TEXT
      );
    `);
    } catch (e) {
        console.error("Error initializing DB", e);
    }
};

export const addTodoOffline = (title) => {
    if (!db) return;
    try {
        db.runSync(
            "INSERT INTO todos (id, title) VALUES (?, ?)",
            [Date.now(), title]
        );
    } catch (e) { console.error(e); }
};

export const updateTodoOffline = (id, title) => {
    if (!db) return;
    try {
        db.runSync(
            "UPDATE todos SET title = ? WHERE id = ?",
            [title, id]
        );
    } catch (e) { console.error(e); }
};

export const deleteTodoOffline = (id) => {
    if (!db) return;
    try {
        db.runSync(
            "DELETE FROM todos WHERE id = ?",
            [id]
        );
    } catch (e) { console.error(e); }
};

export const loadTodos = () => {
    if (!db) return [];
    try {
        return db.getAllSync("SELECT * FROM todos");
    } catch (e) {
        console.error(e);
        return [];
    }
};
