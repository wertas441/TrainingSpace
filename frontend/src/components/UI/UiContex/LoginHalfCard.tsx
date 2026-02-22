import {
    BoltIcon,
    CalendarDaysIcon,
    ChartBarSquareIcon,
    CheckCircleIcon,
    FireIcon,
    TrophyIcon
} from "@heroicons/react/24/outline";

export default function LoginHalfCard() {
    
    return (
        <aside className="relative flex overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 px-8 py-10 text-white sm:px-10 lg:px-16">
            <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />

            <div className="relative z-10 flex w-full flex-col justify-center gap-12">
                <div className="space-y-6">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
                        <FireIcon className="h-4 w-4" />
                        Ваш личный фитнес-хаб
                    </div>

                    <h2 className="max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
                        Превратите тренировки в предсказуемый результат, а не в случайную мотивацию
                    </h2>

                    <p className="max-w-xl text-sm text-emerald-50/95 sm:text-base">
                        TrainingSpace помогает держать фокус: план на неделю, контроль активности и понятная картина вашего роста
                    </p>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center backdrop-blur-sm sm:px-4">
                            <p className="text-xl font-bold leading-none sm:text-2xl">7</p>
                            <p className="pt-1 text-[11px] text-emerald-50/90 sm:text-xs">дней плана</p>
                        </div>

                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center backdrop-blur-sm sm:px-4">
                            <p className="text-xl font-bold leading-none sm:text-2xl">24/7</p>
                            <p className="pt-1 text-[11px] text-emerald-50/90 sm:text-xs">доступ к данным</p>
                        </div>

                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center backdrop-blur-sm sm:px-4">
                            <p className="text-xl font-bold leading-none sm:text-2xl">100%</p>
                            <p className="pt-1 text-[11px] text-emerald-50/90 sm:text-xs">фокус на цели</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2 font-semibold">
                            <BoltIcon className="h-5 w-5" />
                            Быстрый запуск тренировок
                        </div>

                        <p className="pt-1 text-sm text-emerald-50/90">
                            Возвращайтесь к плану за секунды и не теряйте темп
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2 font-semibold">
                            <CheckCircleIcon className="h-5 w-5" />
                            Все важные метрики в одном месте
                        </div>

                        <p className="pt-1 text-sm text-emerald-50/90">
                            Прогресс по активности, целям и регулярности всегда перед глазами
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                        <div className="grid gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <CalendarDaysIcon className="h-5 w-5 shrink-0" />
                                <span>Планирование недели в 2-3 клика</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <ChartBarSquareIcon className="h-5 w-5 shrink-0" />
                                <span>Наглядные графики и история активности</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <TrophyIcon className="h-5 w-5 shrink-0" />
                                <span>Контроль целей и фиксация достижений</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                        <p className="text-sm text-emerald-50/95">
                            “Когда система понятная, дисциплина становится проще. Я вижу реальный рост каждую неделю”
                        </p>

                        <p className="pt-2 text-xs font-medium uppercase tracking-wide text-emerald-100">
                            Команда TrainingSpace
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}