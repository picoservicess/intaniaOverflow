import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const {
    CU_AUTH_URL = "https://account.it.chula.ac.th/serviceValidation",
    CU_APP_ID = "your-app-id",
    CU_APP_SECRET = "your-app-secret",
} = process.env;

interface VerifiedUser {
    id: string;
    displayname: string;
    profileImage: string;
}

interface CuAuthResponse {
    uid: string;
    username: string;
    gecos: string;
    email: string;
    disable: boolean;
    roles: string[];
    firstname: string;
    lastname: string;
    firstnameth: string;
    lastnameth: string;
    ouid: string;
}

export const verifyTicket = async (
    ticket: string
): Promise<VerifiedUser | null> => {
    try {
        // console.log('Verifying ticket:', ticket);
        // console.log('CU_AUTH_URL:', CU_AUTH_URL);
        // console.log('CU_APP_ID:', CU_APP_ID);
        // console.log('CU_APP_SECRET:', CU_APP_SECRET);

        const response = await axios.get(CU_AUTH_URL, {
            headers: {
                DeeTicket: ticket,
                DeeAppId: CU_APP_ID,
                DeeAppSecret: CU_APP_SECRET,
            },
        });

        if (!response.data) {
            return null;
        }

        const cuData = response.data as CuAuthResponse;

        // Create or update user in your database
        const user = await prisma.user.upsert({
            where: {
                studentId: cuData.username,
            },
            update: {
                email: cuData.email,
                // displayname: `${cuData.firstname} ${cuData.lastname}`,
                firstname: cuData.firstname,
                lastname: cuData.lastname,
                firstnameth: cuData.firstnameth,
                lastnameth: cuData.lastnameth,
                // roles: cuData.roles,
            },
            create: {
                studentId: cuData.username,
                email: cuData.email,
                displayname: `${cuData.firstname} ${cuData.lastname}`,
                firstname: cuData.firstname,
                lastname: cuData.lastname,
                firstnameth: cuData.firstnameth,
                lastnameth: cuData.lastnameth,
                // roles: cuData.roles,
                profileImage: null,
                pinnedThreads: [],
            },
        });

        return {
            id: user.id,
            displayname: user.displayname,
            profileImage: user.profileImage ?? "",
        };
    } catch (error) {
        console.error("Ticket verification failed:", error);
        return null;
    }
};
