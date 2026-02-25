import type { Express } from "express";

let appPromise: Promise<Express> | null = null;

async function getApp() {
    if (!appPromise) {
        appPromise = import("../server/app")
            .then(mod => mod.createApp())
            .catch(err => {
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
            message: "Server Configuration Error",
            error: error instanceof Error ? error.message : String(error),
            resolution: "Please ensure all required environment variables (like DATABASE_URL and SESSION_SECRET) are added to your Vercel Dashboard -> Settings -> Environment Variables, then REDEPLOY."
        });
    }
}
