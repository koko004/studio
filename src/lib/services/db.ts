import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import fs from 'fs-extra';
import bcrypt from 'bcrypt';
import type { Bot, Log, User } from '@/lib/types';

const dataDir = join(process.cwd(), 'data');
const dbFile = join(dataDir, 'db.json');

fs.ensureDirSync(dataDir);

const defaultData: { users: User[]; bots: Bot[]; logs: Log[] } = { users: [], bots: [], logs: [] };

const adapter = new JSONFile(dbFile);
const db = new Low(adapter, defaultData);

// A singleton promise to ensure the database is initialized only once.
let dbInitialization: Promise<void> | null = null;

async function getDb() {
    if (!dbInitialization) {
        dbInitialization = (async () => {
            console.log('Initializing database...');
            await db.read();
            console.log('Database read. Current data:', db.data);
            if (db.data && db.data.users.length === 0) {
                console.log('No users found, creating default admin user...');
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'password', salt);
                db.data.users.push({
                    id: 'admin',
                    username: process.env.ADMIN_USERNAME || 'admin',
                    password: hashedPassword,
                });
                await db.write();
                console.log('Default admin user created and DB written.');
            }
        })();
    }
    await dbInitialization;
    return db;
}

// --- User Functions ---
export async function findUserByUsername(username: string): Promise<User | undefined> {
    const db = await getDb();
    console.log('findUserByUsername: Reading DB for user');
    return db.data?.users.find((u) => u.username === username);
}

export async function findUserById(id: string): Promise<User | undefined> {
    const db = await getDb();
    console.log('findUserById: Reading DB for user');
    return db.data?.users.find((u) => u.id === id);
}

export async function updateUser(user: User): Promise<void> {
    const db = await getDb();
    console.log('updateUser: Before update: db.data.users length:', db.data.users.length);
    const userIndex = db.data.users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
        db.data.users[userIndex] = user;
        console.log('updateUser: After update: db.data.users length:', db.data.users.length);
        await db.write();
        console.log('updateUser: DB written.');
    }
}


// --- Bot Functions ---

export async function getBots(): Promise<Bot[]> {
    const db = await getDb();
    console.log('--- Starting getBots ---');
    const bots = db.data?.bots || [];
    console.log('getBots: Bots retrieved from DB:', bots.length);
    return bots;
}

export async function writeBots(bots: Bot[]): Promise<void> {
    console.log('--- Starting writeBots ---');
    const db = await getDb();
    console.log('writeBots: Before update: db.data.bots length:', db.data.bots.length);
    db.data.bots = bots;
    console.log('writeBots: After update: db.data.bots length:', db.data.bots.length);
    await db.write();
    console.log('--- Finished writeBots ---');
}

// --- Log Functions ---

export async function getLogs(botId: string): Promise<Log[]> {
    const db = await getDb();
    console.log('getLogs: Reading DB for logs');
    return db.data?.logs.filter((log) => log.botId === botId) || [];
}

export async function addLog(log: Log): Promise<void> {
    const db = await getDb();
    console.log('addLog: Before update: db.data.logs length:', db.data.logs.length);
    db.data.logs.push(log);
    console.log('addLog: After update: db.data.logs length:', db.data.logs.length);
    await db.write();
    console.log('addLog: DB written.');
}
