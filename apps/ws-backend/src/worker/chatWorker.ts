import { Worker } from "bullmq";
import { prismaClient } from "@repo/db/client";


const worker = new Worker(
    "chat-queue",
    async job => {
        const { roomId, message, userId } = job.data

        await prismaClient.chat.create({
            data: {
                roomId,
                message,
                userId
            },
        });
        console.log("DB Saved")
    },
    {
        connection: {
            host: "localhost",
            port: 6379
        }
    }
);

// 🔥 ADD THESE LISTENERS
worker.on("failed", (job, err) => {
    console.error("JOB FAILED:", job?.data);
    console.error("ERROR:", err);
});

worker.on("error", err => {
    console.error("WORKER ERROR:", err);
});

// Worker("chat-queue", "{async-db calls}", "{connection}")