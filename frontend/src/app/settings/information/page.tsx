import Information from "@/app/settings/information/Infromation";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Информация о проекте | TrainingSpace',
    description: 'Страница с информацией о проекте TrainingSpace',
}

export default function InformationPage(){

    return <Information />
}