import StatisticsBox from "@/components/StatisticsBox";
import React from "react";

// interface StatisticsProps {
//     data: object
// }

const Statistics = () => {
    return (
        <div className="grid grid-cols-2 gap-3 text-black">
            <StatisticsBox label={"Amount to be sent"} data={139.792}/>
            <StatisticsBox label={"Total orders"} data={375}/>
            <StatisticsBox label={"rate in each order india"} data={370}/>
        </div>
    )
}

export default Statistics