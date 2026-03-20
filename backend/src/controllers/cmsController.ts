import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPrismaClient } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_FILE_PATH = path.resolve(__dirname, '../../../src/data/homeContent.json');

export const getContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const prisma = await getPrismaClient();
        
        // Try DB first
        let record = await prisma.cmsContent.findUnique({ where: { id: 'global' } });
        
        // If DB is empty, seed it from JSON file (first time)
        if (!record) {
            console.log("Seeding CMS content from JSON to DB...");
            if (fs.existsSync(CONTENT_FILE_PATH)) {
                const jsonData = await fs.readJson(CONTENT_FILE_PATH);
                record = await prisma.cmsContent.create({
                    data: { id: 'global', content: jsonData }
                });
            } else {
                return res.status(404).json({ error: "No content in DB and no seed file found" });
            }
        }
        
        return res.json(record.content);
    } catch (error) {
        console.error("Error reading content:", error);
        return res.status(500).json({ error: "Internal Server Error. Database might be down." });
    }
};

export const updateContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const newData = req.body;
        const prisma = await getPrismaClient();

        if (typeof newData !== 'object' || newData === null) {
            return res.status(400).json({ error: "Invalid data format" });
        }

        // Write to DB (Persistent on Vercel)
        await prisma.cmsContent.upsert({
            where: { id: 'global' },
            update: { content: newData },
            create: { id: 'global', content: newData }
        });

        return res.json({ success: true, message: "Content updated in database successfully" });
    } catch (error) {
        console.error("Error writing content:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

