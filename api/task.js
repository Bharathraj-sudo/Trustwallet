export default function handler(req, res) {
    const secret = req.headers["x-cron-secret"];

    if (secret !== "mysecret123") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Secure cron triggered");

    // TODO: Add my real background task logic here

    return res.status(200).json({
        success: true,
        message: "Task executed"
    });
}
