import Select from "react-select";
import {memo, ReactNode} from "react";

export type OptionType = { value: string; label: string };

interface MainMultiSelectProps {
    id: string;
    label?: string;
    value: OptionType[];
    options: OptionType[];
    onChange: (vals: OptionType[]) => void;
    placeholder?: string;
    error?: string;
    noOptionsMessage?: () => string;
    isMulti?: boolean;
    icon?: ReactNode;
}

function MainMultiSelect(
    {
        id,
        label,
        value,
        options,
        icon,
        onChange,
        placeholder = "Выберите...",
        error,
        noOptionsMessage = () => 'Нет опций',
        isMulti = true,
    }: MainMultiSelectProps) {

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-500">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        {icon}
                    </div>
                )}

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
                            backgroundColor: '#ffffff',
                            borderColor: state.isFocused ? '#10b981' : '#9ca3af', // emerald-500 : gray-400
                            boxShadow: state.isFocused ? '0 0 0 2px rgba(16,185,129,0.2)' : 'none', // ring-emerald-500/20
                            transition: 'box-shadow 150ms, border-color 150ms',
                            ':hover': {
                                borderColor: state.isFocused ? '#10b981' : '#34d399', // emerald-400
                            },
                        }),
                        multiValue: (base) => ({
                            ...base,
                            backgroundColor: 'rgba(16,185,129,0.1)', // emerald-500/10
                            border: '1px solid rgba(16,185,129,0.25)',
                            borderRadius: 9999,
                        }),
                        multiValueLabel: (base) => ({
                            ...base,
                            color: '#065f46', // emerald-800
                            paddingRight: 4,
                        }),
                        multiValueRemove: (base) => ({
                            ...base,
                            color: '#065f46',
                            ':hover': {
                                backgroundColor: 'rgba(16,185,129,0.15)',
                                color: '#065f46',
                            },
                        }),
                        placeholder: (base) => ({
                            ...base,
                            color: '#9ca3af', // gray-400
                        }),
                        valueContainer: (base) => ({
                            ...base,
                            padding: '2px 8px',
                        }),
                        menu: (base) => ({
                            ...base,
                            borderRadius: 12,
                            overflow: 'hidden',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
                            border: '1px solid rgba(16,185,129,0.15)',
                        }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? 'rgba(16,185,129,0.08)' : '#fff',
                            color: '#111827', // gray-900
                            ':active': {
                                backgroundColor: 'rgba(16,185,129,0.12)',
                            },
                        }),
                        indicatorsContainer: (base) => ({
                            ...base,
                            color: '#6b7280', // gray-500
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
                            primary25: 'rgba(16,185,129,0.12)',
                            neutral20: '#9ca3af',
                            neutral30: '#34d399',
                        },
                    })}
                />
            </div>

            {error && (
                <p className="pt-2 pl-1 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}

export default memo(MainMultiSelect)

















