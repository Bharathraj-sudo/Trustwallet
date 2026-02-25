import type { Express } from "express";
import { createApp } from "../server/app";

let appPromise: Promise<Express> | null = null;

function getApp() {
    if (!appPromise) {
        appPromise = createApp().catch(err => {
            appPromise = null;
            throw err;
        });
    }

    return appPromise;
}

export default async function handler(req: any, res: any) {
    try {
        const app = await getApp();
        return app(req, res);
    } catch (error) {
        console.error("Initialization error:", error);
        return res.status(500).json({
            message: "Fatal Server Error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}
