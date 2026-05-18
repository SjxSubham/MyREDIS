import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_KEY = 'queue:emails';
app.post('/emails', async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || "No subject",
        body: req.body.body || "No content",
        createdAt: new Date().toISOString()
    };
    await redis.rpush(QUEUE_KEY, JSON.stringify(job));
    res.json({ queued: true, message: "Email job added to queue", job });
}); 

app.get('/emails/process-one', async (req, res) => {
    const rawjob = await redis.rpop(QUEUE_KEY);
    if(!rawjob){ 
        return res.json({message: 'No jobs available' });
    }
    const job = JSON.parse(rawjob);

    // Simulate email sending
    // console.log(`Sending email to ${job.to} with subject "${job.subject}" and body "${job.body}"`);
    res.json({message: 'Email Sent', sent: true, job });
}
);

app.listen(3000, () => {
    console.log('Email queue service is running on port 3000');
});

