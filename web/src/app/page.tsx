import Statistics from "@/components/Statistics";
import OrderManager from "@/components/OrderManager";

export default function Home() {
    return (
        <div>
            <div className="container mx-auto">
                <div
                    className="flex flex-col gap-4 px-4 pt-8 pb-4 text-white text-[14px] font-medium bg-zinc-900 rounded-b-xl">
                    <div>
                        <h1 className="text-2xl mb-1">Welcome, Driver</h1>
                        <p className="text-[#666]">Statistics from October, 2024</p>
                    </div>
                    <Statistics data={{}}/>
                    <div className="text-[14px]">
                        <span>72.894 INR</span>
                        <span className="text-[#666] mx-2">available to withdraw</span>
                        <button>Withdraw</button>
                    </div>
                </div>
                <div className="px-4 text-[14px] font-medium pt-6 pb-4">
                    <OrderManager/>
                </div>
            </div>
        </div>
    );
}
