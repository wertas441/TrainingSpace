 'use client'

import Select from "react-select";
import {memo} from "react";
import InputError from "@/components/errors/InputError";
import {useTheme} from "@/lib/utils/ThemeProvider";

export type OptionType = { value: string; label: string };

interface MainMultiSelectProps {
    id: string;
    label?: string;
    value: OptionType[];
    options: OptionType[];
    onChange: (vals: OptionType[]) => void;
    placeholder?: string;
    error: string | null;
    noOptionsMessage?: () => string;
    isMulti?: boolean;
}

function MainMultiSelect(
    {
        id,
        label,
        value,
        options,
        onChange,
        placeholder = "Выберите...",
        error,
        noOptionsMessage = () => 'Нет опций',
        isMulti = true,
    }: MainMultiSelectProps) {

    const {theme} = useTheme();
    const isDark = theme === 'dark';

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                <Select
                    inputId={id}
                    classNamePrefix="rs"
                    isMulti={isMulti}
                    // Для одиночного выбора передаём один объект либо null
                    value={isMulti ? value : (value[0] ?? null)}
                    options={options}
                    onChange={(vals) => {
                        if (isMulti) {
                            onChange(vals as OptionType[]);
                        } else {
                            const single = vals as OptionType | null;
                            onChange(single ? [single] : []);
                        }
                    }}
                    placeholder={placeholder}
                    noOptionsMessage={noOptionsMessage}
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            minHeight: 48, // ~ py-3
                            borderRadius: 8, // rounded-lg
                            backgroundColor: isDark ? '#262626' : '#ffffff',
                            borderColor: state.isFocused
                                ? '#10b981'
                                : (isDark ? '#4b5563' : '#9ca3af'), // gray-600 : gray-400
                            boxShadow: state.isFocused
                                ? `0 0 0 2px rgba(16,185,129,${isDark ? 0.35 : 0.2})`
                                : 'none', // ring-emerald-500/20, чуть ярче в тёмной теме
                            transition: 'box-shadow 150ms, border-color 150ms',
                            ':hover': {
                                borderColor: state.isFocused
                                    ? '#10b981'
                                    : (isDark ? '#6b7280' : '#34d399'), // gray-500 : emerald-400
                            },
                        }),
                        input: (base) => ({
                            ...base,
                            color: isDark ? '#e5e7eb' : '#111827', // gray-200 : gray-900
                        }),
                        singleValue: (base) => ({
                            ...base,
                            color: isDark ? '#e5e7eb' : '#111827',
                        }),
                        multiValue: (base) => ({
                            ...base,
                            backgroundColor: isDark
                                ? 'rgba(16,185,129,0.25)'
                                : 'rgba(16,185,129,0.1)', // emerald-500/10
                            border: '1px solid rgba(16,185,129,0.35)',
                            borderRadius: 9999,
                        }),
                        multiValueLabel: (base) => ({
                            ...base,
                            color: isDark ? '#ecfdf5' : '#065f46', // почти белый текст в тёмной теме
                            paddingRight: 4,
                        }),
                        multiValueRemove: (base) => ({
                            ...base,
                            color: isDark ? '#bbf7d0' : '#065f46',
                            ':hover': {
                                backgroundColor: isDark
                                    ? 'rgba(16,185,129,0.35)'
                                    : 'rgba(16,185,129,0.15)',
                                color: isDark ? '#ecfdf5' : '#065f46',
                            },
                        }),
                        placeholder: (base) => ({
                            ...base,
                            color: isDark ? '#9ca3af' : '#9ca3af', // можно отличить от value через opacity, но тут оставим одинаково
                        }),
                        valueContainer: (base) => ({
                            ...base,
                            padding: '2px 8px',
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: isDark ? '#020617' : '#ffffff', // slate-950 : white
                            borderRadius: 12,
                            overflow: 'hidden',
                            boxShadow: isDark
                                ? '0 10px 30px rgba(0,0,0,0.6)'
                                : '0 10px 20px rgba(0,0,0,0.06)',
                            border: isDark
                                ? '1px solid rgba(55,65,81,0.85)'
                                : '1px solid rgba(16,185,129,0.15)',
                        }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused
                                ? (isDark ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.08)')
                                : (isDark ? '#020617' : '#ffffff'),
                            color: isDark ? '#e5e7eb' : '#111827', // gray-200 : gray-900
                            ':active': {
                                backgroundColor: isDark
                                    ? 'rgba(16,185,129,0.35)'
                                    : 'rgba(16,185,129,0.12)',
                            },
                        }),
                        indicatorsContainer: (base) => ({
                            ...base,
                            color: isDark ? '#9ca3af' : '#6b7280', // gray-400 : gray-500
                        }),
                        clearIndicator: (base) => ({ ...base, padding: 6 }),
                        dropdownIndicator: (base) => ({ ...base, padding: 6 }),
                    }}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 8,
                        colors: {
                            ...theme.colors,
                            primary: '#10b981', // emerald-500
                            primary25: isDark ? 'rgba(16,185,129,0.22)' : 'rgba(16,185,129,0.12)',
                            neutral0: isDark ? '#111827' : '#ffffff', // фон контрола
                            neutral80: isDark ? '#e5e7eb' : '#111827', // цвет текста
                            neutral20: isDark ? '#4b5563' : '#9ca3af',
                            neutral30: isDark ? '#6b7280' : '#34d399',
                            neutral50: isDark ? '#9ca3af' : '#9ca3af',
                        },
                    })}
                />
            </div>

            <InputError error={error} />
        </div>
    );
}

export default memo(MainMultiSelect)

















