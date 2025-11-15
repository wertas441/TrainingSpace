'use client'

import ProfilePage from "@/app/settings/Ui/ProfilePage";
import ChangePasswordPage from "@/app/settings/Ui/ChangePasswordPage";
import ChangeEmailPage from "@/app/settings/Ui/ChangeEmailPage";
import {useMemo, useState} from "react";
import ProjectInformationPage from "@/app/settings/Ui/ProjectInformationPage";
import {ArrowLeftOnRectangleIcon, EnvelopeIcon, LockClosedIcon, UserCircleIcon} from "@heroicons/react/24/outline";
import {SettingsMenuItemsStructure} from "@/types/indexTypes";

export default function Settings(){

    const settingsMenuItems: SettingsMenuItemsStructure[] = useMemo(() => {
        return [
            { id: 'profile', label: 'Профиль', icon: UserCircleIcon },
            { id: 'password', label: 'Сменить пароль', icon: LockClosedIcon },
            { id: 'email', label: 'Сменить почту', icon: EnvelopeIcon },
            { id: 'projectInformation', label: 'Информация о проекте', icon: LockClosedIcon },
        ]
    }, [])

    const [activeTab, setActiveTab] = useState('profile');
    const activeItem = settingsMenuItems.find(i => i.id === activeTab);

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfilePage />;
            case 'password':
                return <ChangePasswordPage />;
            case 'email':
                return <ChangeEmailPage />;
            case 'projectInformation':
                return <ProjectInformationPage />;
            default:
                return <ProfilePage />;
        }
    };


    return (
        <div className="w-full">
            <div className="w-full flex flex-col lg:flex-row gap-6">
                <aside className="w-full lg:w-90">
                    <nav className="space-y-2 p-3 rounded-lg border border-emerald-100 bg-white shadow-sm">
                        {settingsMenuItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 py-2.5 cursor-pointer px-3 rounded-md border transition text-left ${
                                        activeTab === item.id
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                                            : 'bg-white text-emerald-700 border-white hover:bg-emerald-50'
                                    }`}
                                >
                                    <IconComponent className="h-5 w-5"/>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </button>
                            )
                        })}
                        <div className="border-t border-emerald-100 my-2"></div>
                        <button
                            className="w-full flex items-center cursor-pointer gap-3 py-2.5 px-3 rounded-md transition-colors
                            text-left text-red-700 bg-white hover:bg-red-50"
                        >
                            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                            <span className="text-sm font-medium">Выйти</span>
                        </button>
                    </nav>
                </aside>

                <main className="w-full p-6 rounded-lg border border-emerald-100 bg-white shadow-sm">
                    <div className="mb-4">
                        <h1 className="text-2xl font-semibold text-emerald-800">{activeItem?.label ?? 'Раздел'}</h1>
                    </div>
                    <div className="mt-4">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    )
}