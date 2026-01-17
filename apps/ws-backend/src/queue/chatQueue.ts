import { Queue } from "bullmq";

export const chatQueue = new Queue("chat-queue", {
    connection: {
        host: "localhost",
        port: 6379
    }
})