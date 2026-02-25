export default function handler(req, res) {
    console.log("Executing /api/register function");

    if (req.method !== 'POST') {
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
        return res.status(400).json({ message: "Username, password, and confirmPassword are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    // TODO: Add database logic here to save user
    console.log(`Registered user: ${username}`);

    return res.status(200).json({
        id: 1,
        username: username,
        message: "Registration successful"
    });
}
