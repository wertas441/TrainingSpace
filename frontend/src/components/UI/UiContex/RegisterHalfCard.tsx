import {CheckBadgeIcon, ClockIcon, RocketLaunchIcon, ShieldCheckIcon, UserGroupIcon} from "@heroicons/react/24/outline";

export default function RegisterHalfCard() {

    return (
        <aside className="relative flex overflow-hidden bg-gradient-to-br from-teal-700 via-cyan-600 to-emerald-600 px-8 py-10 text-white sm:px-10 lg:px-16">
            <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="relative z-10 flex w-full flex-col justify-center gap-12">
                <div className="space-y-6">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
                        <RocketLaunchIcon className="h-4 w-4" />
                        Новый старт с системой
                    </div>

                    <h2 className="max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
                        Соберите фундамент прогресса с первого дня и тренируйтесь по понятному плану
                    </h2>

                    <p className="max-w-2xl text-sm text-cyan-50/95 sm:text-base">
                        После регистрации вы получите единое пространство для целей, тренировок, активности, питания, регулярности и анализа результатов
                    </p>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center backdrop-blur-sm sm:px-4">
                            <p className="text-xl font-bold leading-none sm:text-2xl">1 мин</p>
                            <p className="pt-1 text-[11px] text-cyan-50/90 sm:text-xs">до старта</p>
                        </div>

                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center backdrop-blur-sm sm:px-4">
                            <p className="text-xl font-bold leading-none sm:text-2xl">3 шага</p>
                            <p className="pt-1 text-[11px] text-cyan-50/90 sm:text-xs">первичная настройка</p>
                        </div>

                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center backdrop-blur-sm sm:px-4">
                            <p className="text-xl font-bold leading-none sm:text-2xl">0%</p>
                            <p className="pt-1 text-[11px] text-cyan-50/90 sm:text-xs">хаоса в планах</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5">
                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2 font-semibold">
                            <ClockIcon className="h-5 w-5" />
                            Быстрая регистрация без лишних полей
                        </div>

                        <p className="pt-1 text-sm text-cyan-50/90">
                            Создайте профиль за минуту и сразу переходите к своим тренировочным задачам
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2 font-semibold">
                            <CheckBadgeIcon className="h-5 w-5" />
                            Персональный трекер целей
                        </div>

                        <p className="pt-1 text-sm text-cyan-50/90">
                            Фиксируйте важные ориентиры и контролируйте путь от плана к результату
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                        <div className="grid gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <ShieldCheckIcon className="h-5 w-5 shrink-0" />
                                <span>Безопасный вход и защита учетной записи</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <UserGroupIcon className="h-5 w-5 shrink-0" />
                                <span>Подходит и новичкам, и опытным спортсменам</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                        <p className="text-sm text-cyan-50/95">
                            “Регистрация заняла минуту, а дальше все стало прозрачным: что делать сегодня и как расти дальше”
                        </p>

                        <p className="pt-2 text-xs font-medium uppercase tracking-wide text-cyan-100">
                            Пользователи TrainingSpace
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
