import type { Metadata } from 'next';
import AddActivity from "@/app/add-activity/AddActivity";

export const metadata: Metadata = {
    title: "Добавить активность | TrainingSpace",
    description: "Страница добавление вашей активности в приложение TrainingSpace для последующего отслеживания ",
}

export default function AddActivityPage(){

    return <AddActivity />
}