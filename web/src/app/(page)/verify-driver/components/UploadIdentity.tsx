import CustomButton from "@/components/CustomButton";
import UploadImages from "@/components/UploadImages";

const UploadIdentity = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-1">Verify driver identity</h1>
            <p className="text-[#666]">Please upload a photo of your ID card & drive license to confirm your identity</p>
            <div className="mt-8">
                <p className="text-start font-semibold mb-2">Upload driver's license</p>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <UploadImages/>
                        <p className="mt-2">Front side</p>
                    </div>
                    <div>
                        <UploadImages/>
                        <p className="mt-2">Back side</p>
                    </div>
                </div>
            </div>
            <div className={"grid grid-cols-1 mt-10"}>
                <CustomButton label="Verify ID card" variant="dark" size="large"/>
            </div>
        </div>
    )
}

export default UploadIdentity;