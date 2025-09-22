import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import twilio from "twilio";
import {RecommendInfluencer} from "./model/RecommendInfluencer";
import {createMessage} from "./util/MessageUtil";
import dotenv from 'dotenv';



dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


if (!accountSid || !authToken || !twilioPhoneNumber) {
    throw new Error('Missing required Twilio environment variables');
}

const client = twilio(accountSid, authToken);

// POST endpoint from React Native app
app.post("/send-recommendation", async (req: Request, res: Response) => {
    const businessDescription = req.body.Body;
    const userPhone = req.body.From;
    const userName = req.body.ProfileName;

    const wellcomeText = "Hi! I'm interested in connecting with influencers through your platform."

    if (businessDescription === wellcomeText) {

        const message = "Hello! Thank you for reaching out to Influensa. Please provide a brief description of your business, including your industry, target audience, and any specific goals you have in mind. This will help us recommend the best influencers for your needs.";

        await client.messages.create({
            from: twilioPhoneNumber, // Twilio Sandbox
            to: userPhone,
            body: message // Use messageText instead of message
        });

        res.send("<Response></Response>"); // Twilio expects XML response

        return;
    }

    try {
        // Call Python AI
        const aiResponse = await axios.post("http://127.0.0.1:8000/recommend", {
            business_description: businessDescription
        });

        const data: RecommendInfluencer[] = aiResponse.data.recommendations;

        // create message
        const message = createMessage(data, userName);
        if (!message) {
            res.status(500).send("<Response></Response>");
            return;
        }
        const messageText = message.length > 1600 ? message.substring(0, 1597) + "..." : message;
        // Send WhatsApp message via Twilio

        await client.messages.create({
            from: twilioPhoneNumber, // Twilio Sandbox
            to: userPhone,
            body: messageText // Use messageText instead of message
        });

        res.send("<Response></Response>"); // Twilio expects XML response
    } catch (error) {
        console.error(error);
        res.status(500).send("<Response></Response>");
    }
});


// Start server
app.listen(4001, () => console.log("🚀 Express TS server running on port 4001"));
