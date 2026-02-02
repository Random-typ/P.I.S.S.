export const config = {
    runtime: "edge",
};

export default async function handler(request) {
    // 1. Get the ID from the URL query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "0";

    // 2. Prepare the data
    const payload = {
        id: id,
        timestamp: new Date().toISOString(),
    };

    // 3. Send to Upstash SECURELY (The token is on the server, not the browser)
    // We use process.env to read the secret keys
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    try {
        const dbResponse = await fetch(`${upstashUrl}/lpush/click_stats`, {
            method: "POST",
            headers: { Authorization: `Bearer ${upstashToken}` },
            body: JSON.stringify(payload),
        });

        return new Response(JSON.stringify({ status: "Saved" }), {
            status: 200,
            headers: { "content-type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ status: "Error" }), {
            status: 500,
        });
    }
}
