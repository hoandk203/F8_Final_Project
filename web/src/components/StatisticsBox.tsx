import React from "react";


interface StatisticsBoxProps {
    label: string,
    data: number
}

const StatisticsBox: React.FC<StatisticsBoxProps> = ({label, data}) => {
    return (
        <div className="bg-gray-200 p-3 rounded-lg">
            <div className="uppercase text-[#666]">{label}</div>
            <div><span className="text-2xl font-bold">{data}</span> INR</div>
        </div>
    )
}

export default StatisticsBox