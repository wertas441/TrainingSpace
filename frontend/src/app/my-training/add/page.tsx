import AddNewTraining from "@/app/my-training/add/AddNewTraining";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Добавить новую тренировку | TrainingSpace',
    description: 'Страница добавление новой тренировки-шаблона в сервис TrainingSpace',
}

export default function AddNewTrainingPage(){

    return <AddNewTraining />
}