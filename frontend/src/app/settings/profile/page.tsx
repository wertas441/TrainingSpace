import {Metadata} from "next";
import Profile from "@/app/settings/profile/Profile";
import {cookies} from "next/headers";
import {getUserData} from "@/lib/controllers/settingController";

export const metadata: Metadata = {
    title: 'Профиль | TrainingSpace',
    description: 'Страница профиля пользователя в сервисе TrainingSpace',
}

export default async function ProfilePage(){

    const cookieStore = await cookies();
    const authTokenCookie = cookieStore.get('token');
    const tokenValue = authTokenCookie?.value;

    const userData = await getUserData(tokenValue);

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

    return <Profile userData={userData} />
}