import { memo } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ErrorStateProps {
    /** Заголовок сообщения об ошибке */
    title?: string;
    /** Описание/подсказка для пользователя */
    description?: string;
    /** Центрирование блока по высоте (для страниц) */
    fullHeight?: boolean;
}

function ErrorState({
    title = "Не удалось загрузить данные",
    description = "Похоже, возникла проблема с сервером или подключением к интернету. Попробуйте обновить страницу чуть позже.",
    fullHeight = true,
}: ErrorStateProps) {

    return (
        <div className={`w-full ${fullHeight ? "min-h-[60vh] flex items-center justify-center" : ""}`}>
            <div
                className="mx-auto max-w-md rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm text-center"
                role="alert"
            >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
                    <ExclamationTriangleIcon className="h-8 w-8 text-rose-500" />
                </div>

                <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default memo(ErrorState);
