import VerifyEmail from "./components/VerifyEmail";
import VerifyIdentity from "./components/VerifyIdentity";


const VerifyDriverPage = () => {
    return (
        <div className="container mx-auto">
            <div className="text-[16px] pt-8 px-4">
                <div className="text-center py-8">
                    {/* <VerifyEmail/> */}
                    <VerifyIdentity/>
                </div>
            </div>
        </div>

    )
}

export default VerifyDriverPage;