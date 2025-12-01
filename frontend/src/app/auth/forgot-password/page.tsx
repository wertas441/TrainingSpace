import {Metadata} from "next";
import ForgotPassword from "@/app/auth/forgot-password/ForgotPassword";

export const metadata: Metadata = {
    title: '',
    description: '',
}

export default function ForgotPasswordPage(){

    return <ForgotPassword />
}