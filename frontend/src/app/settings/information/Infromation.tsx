'use client'

import SettingsPageContext from "@/components/UI/UiContex/SettingsPageContext";
import {
    InformationCircleIcon,
    CodeBracketIcon,
    HeartIcon,
    SparklesIcon,
    GlobeAltIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import InformationPageBlock from "@/components/elements/InformationPageBlock";
import SettingsHeader from "@/components/UI/headers/SettingsHeader";

const informationBlock = [
    {
        label: "Тренировки и активность",
        text: 'Планируйте и отслеживайте тренировки, комбинируйте упражнения, следите за прогрессом и делайте тренировки более осознанными.',
        icon: HeartIcon,
    },
    {
        label: "Цели и мотивация",
        text: 'Создавайте цели, отслеживайте выполнение и держите фокус на том, что для вас действительно важно в тренировочном процессе.',
        icon: SparklesIcon,
    },
    {
        label: "Открытый код",
        text: 'Проект разрабатывается как Open Source — вы можете изучать код, форкать репозиторий, предлагать идеи и контрибьютить.',
        icon: GlobeAltIcon,
    },
    {
        label: "Обратная связь",
        text: 'Если у вас есть идеи, замечания или вы нашли баг — создайте issue на GitHub или напишите мне. Обратная связь помогает делать TrainingSpace лучше.',
        icon: InformationCircleIcon,
    },
] as const;

export default function Information() {

    return (
        <SettingsPageContext>

            <SettingsHeader
                label={`О проекте TrainingSpace`}
                text={`Немного о том, что это за приложение, зачем оно нужно и как вы можете поучаствовать в его развитии`}
                IconComponent={InformationCircleIcon}
            />

            <div className="px-6 py-6 sm:px-8 sm:py-8 max-w-4xl">
                <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        <span className="font-semibold text-emerald-900">TrainingSpace</span> — это
                        открытое (Open Source) приложение для отслеживания тренировок, питания и целей
                        в сфере здоровья и спорта. Я делаю его как удобное рабочее пространство, где
                        можно собрать свои привычки, планы и прогресс в одном месте.
                    </p>

                    <p className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                        Код проекта доступен на GitHub, так что вы можете посмотреть, как всё устроено
                        внутри, предложить улучшения или поучаствовать в разработке.
                    </p>

                    <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                        <Link
                            href="https://github.com/wertas441/TrainingSpace"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4
                                py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors`}
                        >
                            <CodeBracketIcon className="h-5 w-5" />
                            <span>Открыть репозиторий на GitHub</span>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {informationBlock.map((item, i) => (
                        <InformationPageBlock
                            key={i}
                            label={item.label}
                            text={item.text}
                            icon={item.icon}
                        />
                    ))}
                </div>
            </div>
        </SettingsPageContext>
    );
}