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
        // Try DB first
        try {
            const prisma = await getPrismaClient();
            let record = await prisma.cmsContent.findUnique({ where: { id: 'global' } });
            
            // If DB is empty, seed it from JSON file (first time)
            if (!record) {
                console.log("Seeding CMS content from JSON to DB...");
                if (fs.existsSync(CONTENT_FILE_PATH)) {
                    const jsonData = await fs.readJson(CONTENT_FILE_PATH);
                    record = await prisma.cmsContent.create({
                        data: { id: 'global', content: jsonData }
                    });
                }
            }
            
            if (record) return res.json(record.content);
        } catch (dbError) {
            console.warn("DB unavailable, falling back to local JSON file:", (dbError as any).message?.slice(0, 100));
        }

        // Fallback: Read from local JSON file
        if (fs.existsSync(CONTENT_FILE_PATH)) {
            const jsonData = await fs.readJson(CONTENT_FILE_PATH);
            return res.json(jsonData);
        }

        return res.status(404).json({ error: "No content found" });
    } catch (error) {
        console.error("Error reading content:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const newData = req.body;

        if (typeof newData !== 'object' || newData === null) {
            return res.status(400).json({ error: "Invalid data format" });
        }

        // Try DB first
        try {
            const prisma = await getPrismaClient();
            await prisma.cmsContent.upsert({
                where: { id: 'global' },
                update: { content: newData },
                create: { id: 'global', content: newData }
            });
        } catch (dbError) {
            console.warn("DB unavailable, saving to local JSON file instead");
        }

        // Always also write to local JSON file (works in dev + acts as backup)
        await fs.writeJson(CONTENT_FILE_PATH, newData, { spaces: 4 });

        return res.json({ success: true, message: "Content updated successfully" });
    } catch (error) {
        console.error("Error writing content:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
