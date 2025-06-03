import React from "react";


interface StatisticsBoxProps {
    label: string,
    data: number,
    unit: string
}

const StatisticsBox: React.FC<StatisticsBoxProps> = ({label, data, unit}) => {
    
    // Kiểm tra data hợp lệ
    const validData = isNaN(data) ? 0 : data;
    
    const formattedData = unit === '$' 
        ? `${unit}${validData.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
        : `${validData.toLocaleString()}`;


    return (
        <div className="bg-gray-200 p-3 rounded-lg flex flex-col justify-between">
            <div className="uppercase text-[#666]">{label}</div>
            <div className="text-2xl font-bold">
                {formattedData}
                {unit === 'orders' && <span className="text-lg ml-1">{unit}</span>}
            </div>
        </div>
    )
}

export default StatisticsBox