
import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the frontend content file
// Assuming backend is in /backend and frontend data is in /src/data
const CONTENT_FILE_PATH = path.resolve(__dirname, '../../../src/data/homeContent.json');

export const getContent = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!fs.existsSync(CONTENT_FILE_PATH)) {
            return res.status(404).json({ error: "Content file not found" });
        }
        const data = await fs.readJson(CONTENT_FILE_PATH);
        return res.json(data);
    } catch (error) {
        console.error("Error reading content:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateContent = async (req: Request, res: Response): Promise<any> => {
    try {
        const newData = req.body;

        // Basic Validation (ensure it's an object)
        if (typeof newData !== 'object' || newData === null) {
            return res.status(400).json({ error: "Invalid data format" });
        }

        // Write directly to the file
        await fs.writeJson(CONTENT_FILE_PATH, newData, { spaces: 4 });

        return res.json({ success: true, message: "Content updated successfully" });
    } catch (error) {
        console.error("Error writing content:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
