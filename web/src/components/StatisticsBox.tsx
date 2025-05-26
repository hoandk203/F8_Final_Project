import React from "react";


interface StatisticsBoxProps {
    label: string,
    data: number,
    unit: string
}

const StatisticsBox: React.FC<StatisticsBoxProps> = ({label, data, unit}) => {
    const formattedData = unit === '$' 
        ? `${unit}${data.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` 
        : `${data.toLocaleString()} ${unit}`;

    return (
        <div className="bg-gray-200 p-3 rounded-lg flex flex-col justify-between">
            <div className="uppercase text-[#666]">{label}</div>
            <div className="text-2xl font-bold">{formattedData}</div>
        </div>
    )
}

export default StatisticsBox