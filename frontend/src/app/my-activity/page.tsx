import type { Metadata } from 'next';
import MyActivity from "@/app/my-activity/MyActivity";
import {cookies} from "next/headers";
import {getActivityList} from "@/lib/controllers/activityController";

export const metadata: Metadata = {
    title: 'Моя активность | TrainingSpace',
    description: 'На этой странице вы можете отследить вашу добавленную в сервис активность',
}

export default async function MyActivityPage(){

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const clientActivity = await getActivityList(tokenValue)

    return <MyActivity clientActivity = {clientActivity} />
}