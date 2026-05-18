import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post("/user/:id/json", async (req, res) => {
    await redis.set(`user:${req.params.id}`, JSON.stringify(req.body));
    res.json({savedAs: "json"}) 
});

app.get("/user/:id/json", async (req, res) => {
    const raw = await redis.get(`user:${req.params.id}`);
    if(raw){
        res.json({ user: raw ? JSON.parse(raw) : null });
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

app.post("user/:id/hash", async (req, res) => {
    await redis.hset(`user:${req.params.id}`, req.body);
    res.json({savedAs: "hash"}) 
});

app.get("user/:id/hash", async (req, res) => {
    const user = await redis.hgetall(`user:${req.params.id}`);
    res.json({ user });
});

app.listen(3000, () => {
    console.log('User profile cache service is running on port 3000');
});
