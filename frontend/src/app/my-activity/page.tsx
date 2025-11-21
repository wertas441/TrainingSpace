import type { Metadata } from 'next';
import MyActivity from "@/app/my-activity/MyActivity";
import {cookies} from "next/headers";
import {getActivityList} from "@/lib/controllers/activityController";

export const metadata: Metadata = {
    title: 'Моя активность | TrainingSpace',
    description: 'На этой странице вы можете отследить вашу добавленную в сервис активность',
}

export default async function MyActivityPage(){

    // const activityData: ActivityDataStructure[] = [
    //     {
    //         id: 1,
    //         name: 'Тренировка ног в среду ',
    //         description: 'Тренировка с упором на мышцы икры и бедра, также почему то странно болели ноги и как будто плохо размялся',
    //         activityDate: '26.08.2025',
    //         type: 'Силовая',
    //         difficulty: 'Средняя',
    //         trainingId: 3,
    //         exercises: [
    //             {
    //                 exercisesId: 2,
    //                 try: [
    //                     { id: 1, weight: 60, quantity: 12 },
    //                     { id: 2, weight: 70, quantity: 10 },
    //                     { id: 3, weight: 70, quantity: 8 },
    //                 ],
    //             },
    //             {
    //                 exercisesId: 3,
    //                 try: [
    //                     { id: 1, weight: 40, quantity: 12 },
    //                     { id: 2, weight: 24, quantity: 12 },
    //                     { id: 3, weight: 40, quantity: 10 },
    //                 ],
    //             },
    //         ],
    //     },
    //     {
    //         id: 2,
    //         name: 'Ноги',
    //         description: 'Присед и жим ногами',
    //         activityDate: '29.10.2025',
    //         type: 'Силовая',
    //         difficulty: 'Тяжелая',
    //         trainingId: 5,
    //         exercises: [
    //             {
    //                 exercisesId: 6,
    //                 try: [
    //                     { id: 1, weight: 80, quantity: 10 },
    //                     { id: 2, weight: 90, quantity: 8 },
    //                     { id: 3, weight: 90, quantity: 6 },
    //                 ],
    //             },
    //             {
    //                 exercisesId: 7,
    //                 try: [
    //                     { id: 1, weight: 140, quantity: 12 },
    //                     { id: 2, weight: 160, quantity: 10 },
    //                 ],
    //             },
    //         ],
    //     }
    // ]

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const clientActivity = await getActivityList(tokenValue)

    return <MyActivity clientActivity = {clientActivity} />
}