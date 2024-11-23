import CustomButton from "@/components/CustomButton";
import Contact from "@/components/Contact";
import StepperOrder from "@/components/StepperOrder";
import OrderInfo from "@/components/OrderInfo";


const OrderStatusPage = () => {
    return (
        <>
            <div className="container mx-auto h-screen">
                <div className="px-4 pt-8 text-[14px] h-full pb-[250px]">
                    <h1 className="font-bold mb-4">Order status</h1>
                    <StepperOrder/>
                    <div className="flex flex-col gap-y-3 h-full pb-[120px] overflow-y-auto">
                        <OrderInfo type="accepted"/>
                        <OrderInfo type="accepted"/>
                        <OrderInfo type="accepted"/>
                    </div>
                </div>

                <div className="bg-white fixed bottom-0 left-0 right-0 px-4 py-4 border-t">
                    <div className="flex flex-col gap-y-8">
                        <div className="flex flex-col gap-y-2">
                            <CustomButton label={"Mark as moving"} variant="dark" size="medium"/>
                            <CustomButton label={"Mark as arrived"} variant="light" size="medium"/>
                            {/* <CustomButton label={"Cancel ride"} variant="light" size="medium"/> */}
                        </div>
                        <Contact/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderStatusPage
