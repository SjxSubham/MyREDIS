import express from "express";
import redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new redis(process.env.REDIS_URL || "redis://localhost:6379");


function otpKey(phone){
    return `otp:;${phone}`;
}

app.post('/otp', async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(otpKey(phone), otp, 'EX', 30); // valid only for 30 second

    res.json({ message: `OTP sent to ${phone}`, otp });
});




