import CustomButton from "@/components/CustomButton";

const OrderStatusPage = () => {
    return (
        <>
            <div className="container mx-auto">
                <div className="px-4">
                    <h1>Order Status Page</h1>
                    <div className="flex flex-col gap-y-2">
                        <CustomButton label={"Mark as moving"} focus={true}/>
                        <CustomButton label={"Mark as arrived"} focus={false}/>
                        <CustomButton label={"Cancel ride"} focus={false}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderStatusPage