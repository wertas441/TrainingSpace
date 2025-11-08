import Dashboard from "@/app/Dashboard";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Главная | TrainingSpace",
    description: 'Dashboard',
}

export default function Home() {

    return (
        <Dashboard />
    );
}
