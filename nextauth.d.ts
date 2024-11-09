import NextAuth, {DefaultSession} from "next-auth";


declare module 'next-auth'{
    interface Session {
    user: {
    id: string;
    role:string;           
    firstName: string;
    lastName :      string;
    phoneNumber:    string;   
    address:        string;
    postalCode :    string;
    password :      string;
    image:          string?;
    name:           string?;
    email:          string;
    emailVerified: boolean;
    } & DefaultSession['user'];
     
    } 
}