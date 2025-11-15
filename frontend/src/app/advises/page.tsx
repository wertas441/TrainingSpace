import type { Metadata } from 'next';
import Advises from "@/app/advises/Advises";

export const metadata: Metadata = {
    title: "Советы | TrainingPage",
    description: 'На данной странице вы можете прочитать советы по тренировочному процессу и питанию',
}

export default function AdvisesPage(){

    return <Advises />
}