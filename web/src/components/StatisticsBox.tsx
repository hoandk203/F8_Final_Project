import React from "react";


interface StatisticsBoxProps {
    label: string,
    data: number,
    unit: string
}

const StatisticsBox: React.FC<StatisticsBoxProps> = ({label, data, unit}) => {
    return (
        <div className="bg-gray-200 p-3 rounded-lg">
            <div className="uppercase text-[#666]">{label}</div>
            <div><span className="text-2xl font-bold">{data}</span> {unit}</div>
        </div>
    )
}

export default StatisticsBox