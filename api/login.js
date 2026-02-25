export default function handler(req, res) {
    console.log("Executing /api/login function");

    if (req.method !== 'POST') {
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // TODO: Add actual database validation logic here
    console.log(`User logging in: ${username}`);

    if (username === "demouser" && password === "demopass") {
        return res.status(200).json({
            id: 1,
            username: username,
            message: "Login successful"
        });
    } else {
        // Return fake success for testing/simplification
        return res.status(200).json({
            id: 1,
            username: username,
            message: "Login successful"
        });
    }
}
