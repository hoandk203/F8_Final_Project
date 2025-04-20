import React, { useRef } from "react";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";

import {readFile} from "@/utils/readFile";

interface props {
    setFrontSide?: (value:any) => void
    setBackSide?: (value:any) => void
    setVehicleImageCallback?: (value:any) => void
    setVehicleRCImageCallback?: (value:any) => void
    setProofImage?: (value:any) => void
    setIssueImage?: (value:any) => void
    imageHeight?: string
    initialImage?: string
}

const UploadImages = React.memo(({setFrontSide, setBackSide, setVehicleImageCallback, setVehicleRCImageCallback, setProofImage, setIssueImage, imageHeight, initialImage}:props) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [images, setImages] = React.useState("");
    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            for (let i = 0; i < fileList.length; i++) {

                if (fileList[i]) {
                    if (fileList[i].type.includes("image/jpg") || fileList[i].type.includes("image/png") || fileList[i].type.includes("image/jpeg")) {
                        const imageFile= await readFile(fileList[i])
                        setImages(imageFile);
                        if(setFrontSide){
                            setFrontSide(imageFile)
                        }
                        if(setBackSide){
                            setBackSide(imageFile)
                        }
                        if(setVehicleImageCallback){
                            setVehicleImageCallback(imageFile)
                        }
                        if(setVehicleRCImageCallback){
                            setVehicleRCImageCallback(imageFile)
                        }
                        if(setProofImage){
                            setProofImage(imageFile)
                        }
                        if(setIssueImage){
                            setIssueImage(imageFile)
                        }
                    } else {
                        alert("Ảnh phải có định dạng PNG, JPG, JPEG");
                    }
                }
            }
        }
        //Reset giá trị của input file để có thể upload lại cùng một file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div
            className={`bg-gray-200 ${imageHeight ? "h-[200px]" : "h-[120px]"} rounded-md border-2 border-gray-300 flex items-center justify-center cursor-pointer`}
            onClick={handleClick}
        >
            
            {images ? (
                <img src={images} className="w-full h-full object-cover rounded-md" alt=""/>
            ) : initialImage && (
                <img src={initialImage} className="w-full h-full object-cover rounded-md" alt=""/>
            )}
            {!images && !initialImage && <AddAPhotoOutlinedIcon className="text-gray-500"/>}
            
            <input
                type="file"
                ref={fileInputRef}
                onChange={onUploadFile}
                style={{ display: "none" }}
                multiple
            />
        </div>
    );
});

export default UploadImages;
