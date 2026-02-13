import Image from "next/image";
import LightGreenLinkBtn from "@/components/buttons/LightGreenBtn/LightGreenLinkBtn";
import {secondDarkColorTheme} from "@/styles";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Страница не найдена | TrainingSpace',
    description: 'Страница которую вы ищете не найдена, код ошибки 404, попробуйте проверить URL может вы допустили ошибку',
}

export default function NotFound () {

    return (
        <div className="w-full flex items-center justify-center py-10">
            <div className="w-full max-w-4xl">
                <div className={`${secondDarkColorTheme} relative overflow-hidden rounded-2xl border border-emerald-100 backdrop-blur shadow-lg`}>
                    <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-2">
                        <div className="flex items-center justify-center">
                            <div className="relative w-full  max-w-[340px] aspect-[4/3]">
                                <Image
                                    src="/window.svg"
                                    alt="Иллюстрация - страница не найдена"
                                    fill
                                    sizes="(max-width: 768px) 80vw, 40vw"
                                    className="object-contain drop-shadow-sm"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <span className="inline-flex w-fit items-center rounded-full border border-emerald-200
                            bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ">
                                Ошибка 404
                            </span>
                            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                                Страница не найдена
                            </h1>
                            <p className="mt-3 text-gray-600 dark:text-gray-300">
                                Похоже, вы перешли по несуществующей ссылке или страница была
                                перемещена. Проверьте адрес или вернитесь на главную.
                            </p>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <LightGreenLinkBtn
                                    label="На главную"
                                    href="/"
                                    className="w-auto text-center px-6"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
                        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

                        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}