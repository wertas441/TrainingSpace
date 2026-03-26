'use client'

import {
    CalendarIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";
import SettingsPageContext from "@/widgets/UiContex/SettingsPageContext";
import SettingsHeader from "@/widgets/SettingsHeader";
import {thirdDarkColorTheme} from "@/shared/styles";
import {getUserData, useUserStore} from "@/entities/user/model/store";
import ErrorState from "@/shared/UI-kit/errors/ErrorState";

export default function Profile() {

    const userData = useUserStore(getUserData)
    
    if (!userData) {
        return <ErrorState
            title="Проблема с получением ваших данных"
            description="Похоже, что ваша сессия истекла или отсутствует токен доступа. Попробуйте войти заново."
        />
    }
    
    const { userName, email, publicId, createdAt } = userData;
    
    const createdAtDate = createdAt ? new Date(createdAt) : null;

    const memberSince =
        createdAtDate && !Number.isNaN(createdAtDate.getTime())
            ? createdAtDate.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
            : null;

    const initials = userName
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <SettingsPageContext>

            <SettingsHeader
                label={`Профиль`}
                text={`Основная информация о вашей учётной записи`}
            />

            <div className="px-6 py-6 sm:px-8 sm:py-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="flex items-center justify-center">
                        <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full dark:text-white dark:bg-emerald-800 dark:border-emerald-700 bg-emerald-100 flex items-center justify-center text-2xl sm:text-3xl font-semibold text-emerald-800 shadow-inner">
                            {initials ? (
                                <span>{initials}</span>
                            ) : (
                                <UserCircleIcon className="h-14 w-14 text-emerald-500 " />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <div>
                            <div className="text-xs uppercase tracking-wide text-gray-400 ">
                                Имя пользователя
                            </div>

                            <div className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white">
                                {userName}
                            </div>
                        </div>

                        <div className="mt-2 text-sm text-gray-600 dark:text-white">
                            {memberSince && (
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1
                                border border-emerald-100 dark:bg-emerald-800 dark:border-emerald-700">
                                    <CalendarIcon className="h-4 w-4 mb-0.5 text-emerald-500 dark:text-white " />
                                    <span>С нами с {memberSince}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className={`${thirdDarkColorTheme} rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3`}>
                        <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            ID пользователя
                        </div>

                        <div className="mt-1 text-xs md:text-sm font-mono text-gray-900 break-all dark:text-white">
                            {publicId}
                        </div>
                    </div>

                    <div className={`${thirdDarkColorTheme} rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3`}>
                        <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Email
                        </div>

                        <div className="mt-1 text-xs md:text-sm font-mono text-gray-900 break-all dark:text-white">
                            {email}
                        </div>
                    </div>
                </div>
            </div>
        </SettingsPageContext>
    )
}