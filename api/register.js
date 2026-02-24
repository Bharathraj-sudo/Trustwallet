export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, password, confirmPassword } = req.body || {};

    if (!username || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    return res.status(200).json({
        success: true,
        message: "User registered successfully"
    });
}
