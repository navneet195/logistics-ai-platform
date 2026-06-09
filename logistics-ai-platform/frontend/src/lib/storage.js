import { dbPromise } from "./indexedDB";

export const saveSession = async (session) => {
    const db = await dbPromise;
    await db.put("sessions", session);
};

export const getSessions = async () => {
    const db = await dbPromise;
    return await db.getAll("sessions");
};