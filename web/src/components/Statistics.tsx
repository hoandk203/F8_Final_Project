import StatisticsBox from "@/components/StatisticsBox";
import React from "react";

// interface StatisticsProps {
//     data: object
// }

const Statistics = () => {
    return (
        <div className="grid grid-cols-2 gap-3 text-black">
            <StatisticsBox label={"Amount to be sent"} data={139} unit={"dollars"}/>
            <StatisticsBox label={"Total orders"} data={189} unit={"orders"}/>
        </div>
    )
}

export default Statistics