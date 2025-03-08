
import VerifyDriverContainer from "@/app/driver/verify-driver/components/VerifyDriverContainer";


const VerifyDriverPage = () => {
    return (
        <div className="container mx-auto">
            <div className="text-[16px] pt-8 px-4">
                <div className="text-center py-8">
                    <VerifyDriverContainer/> {/* components này để bọc components con rồi dùng useSelector để VerifyDriverPage giữ server side*/}
                </div>
            </div>
        </div>

    )
}

export default VerifyDriverPage;