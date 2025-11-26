import Dashboard from "@/app/Dashboard";
import {Metadata} from "next";
import {cookies} from "next/headers";
import {getGoalShortyList} from "@/lib/controllers/goalController";

export const metadata: Metadata = {
    title: "Главная | TrainingSpace",
    description: 'Главная страница сервиса TrainingSpace',
}

export default async function Home() {
    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const goalsShortyList = await getGoalShortyList(tokenValue);

    return <Dashboard goalsShortyList={goalsShortyList}  />
}
