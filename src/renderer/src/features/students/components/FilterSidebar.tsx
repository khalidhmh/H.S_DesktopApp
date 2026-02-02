import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, Filter, X } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

interface FilterSectionProps {
    title: string;
    options: string[];
    selected: string[];
    onChange: (option: string) => void;
    isOpenDefault?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, options, selected, onChange, isOpenDefault = true }) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault);

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-right font-semibold text-gray-700 py-2 hover:text-[#002147] transition-colors"
            >
                <span>{title}</span>
                {isOpen ? <ChevronDown size={16} /> : <ChevronLeft size={16} />}
            </button>

            {isOpen && (
                <div className="mt-2 space-y-2 mr-1 animate-in slide-in-from-top-2 duration-200">
                    {options.map((option) => (
                        <label key={option} className="flex items-center space-x-2 space-x-reverse cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => onChange(option)}
                                className="rounded border-gray-300 text-[#002147] focus:ring-[#002147]"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

interface FilterSidebarProps {
    selectedBuildings: string[];
    toggleBuilding: (building: string) => void;
    selectedColleges: string[];
    toggleCollege: (college: string) => void;
    selectedStatuses: string[];
    toggleStatus: (status: string) => void;
    onClearAll: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
    selectedBuildings,
    toggleBuilding,
    selectedColleges,
    toggleCollege,
    selectedStatuses,
    toggleStatus,
    onClearAll,
}) => {
    const hasActiveFilters = selectedBuildings.length > 0 || selectedColleges.length > 0 || selectedStatuses.length > 0;

    return (
        <div className="w-64 bg-white border-l border-gray-200 h-full p-4 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between mb-6 text-[#002147]">
                <div className="flex items-center space-x-2 space-x-reverse">
                    <Filter size={20} />
                    <h2 className="text-lg font-bold">تصفية النتائج</h2>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={onClearAll}
                        className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 hover:underline"
                    >
                        <X size={12} />
                        مسح الكل
                    </button>
                )}
            </div>

            <FilterSection
                title="حالة الطالب"
                options={['نظامي', 'ساعات معتمدة', 'وافد']}
                selected={selectedStatuses}
                onChange={toggleStatus}
            />

            <div className="w-full h-px bg-gray-100 my-4" />

            <FilterSection
                title="المباني"
                options={['مبنى أ', 'مبنى ب', 'مبنى ج']}
                selected={selectedBuildings}
                onChange={toggleBuilding}
            />

            <div className="w-full h-px bg-gray-100 my-4" />

            <FilterSection
                title="الكليات"
                options={['الهندسة', 'الطب البشري', 'حاسبات ومعلومات', 'العلوم', 'التجارة']}
                selected={selectedColleges}
                onChange={toggleCollege}
            />

            <div className="w-full h-px bg-gray-100 my-4" />

            <FilterSection
                title="الطوابق"
                options={['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس']}
                selected={[]}
                onChange={() => { }} // Placeholder as logic wasn't fully requested/implemented in parent yet
            />
        </div>
    );
};
