'use client'

import {UserProfileRequest} from "@/types/settingsTypes";
import {
    CalendarIcon,
    EnvelopeIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";
import SettingsPageContext from "@/components/UI/UiContex/SettingsPageContext";


export default function Profile({ userData }: { userData: UserProfileRequest | null}){

    if (!userData) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white border border-emerald-100 rounded-xl p-6 sm:p-8 shadow-sm text-center">
                    <h1 className="text-2xl font-semibold text-emerald-900 mb-2">Профиль</h1>
                    <p className="text-sm text-gray-500">
                        Не удалось загрузить данные профиля. Попробуйте обновить страницу или войти в систему ещё раз.
                    </p>
                </div>
            </div>
        )
    }

    const createdAtDate = userData.createdAt ? new Date(userData.createdAt) : null;

    const memberSince =
        createdAtDate && !Number.isNaN(createdAtDate.getTime())
            ? createdAtDate.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
            : null;

    const initials = userData.userName
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <SettingsPageContext>
            <div className="border-b border-emerald-50 px-6 py-4 sm:px-8 sm:py-5 bg-emerald-50/40">
                <h1 className="text-2xl sm:text-3xl font-semibold text-emerald-900">
                    Профиль
                </h1>
                <p className="mt-1 text-sm text-emerald-900/70">
                    Основная информация о вашей учётной записи.
                </p>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="flex items-center justify-center">
                        <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-emerald-100 flex items-center justify-center text-2xl sm:text-3xl font-semibold text-emerald-800 shadow-inner">
                            {initials ? (
                                <span>{initials}</span>
                            ) : (
                                <UserCircleIcon className="h-14 w-14 text-emerald-500" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 space-y-2">
                        <div>
                            <div className="text-xs uppercase tracking-wide text-gray-400">
                                Имя пользователя
                            </div>
                            <div className="text-lg sm:text-xl font-medium text-gray-900">
                                {userData.userName}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-100">
                                <EnvelopeIcon className="h-4 w-4 text-emerald-500" />
                                <span className="truncate">{userData.email}</span>
                            </div>

                            {memberSince && (
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-100">
                                    <CalendarIcon className="h-4 w-4 text-emerald-500" />
                                    <span>С нами с {memberSince}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
                        <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            ID пользователя
                        </div>
                        <div className="mt-1 text-sm font-mono text-gray-900 break-all">
                            {userData.id}
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
                        <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Email
                        </div>
                        <div className="mt-1 text-sm text-gray-900 break-all">
                            {userData.email}
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-xs text-gray-400">
                    Данные профиля синхронизируются с вашим аккаунтом в TrainingSpace.
                </div>
            </div>
        </SettingsPageContext>
    )
}