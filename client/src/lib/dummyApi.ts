export const dummySendTransaction = async (txData: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 10% failure rate for realism
            if (Math.random() < 0.1) {
                reject(new Error("Network simulation error: Failed to broadcast transaction."));
            } else {
                const fakeHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
                resolve({
                    hash: fakeHash,
                });
            }
        }, 2500);
    });
};
