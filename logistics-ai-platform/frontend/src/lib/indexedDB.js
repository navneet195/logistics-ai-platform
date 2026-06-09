import { openDB } from "idb";

const DB_NAME = "chatDB";

export const dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
        db.createObjectStore("sessions", { keyPath: "id" });
        db.createObjectStore("messages", { keyPath: "id" });
    }
});