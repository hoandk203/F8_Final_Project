import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button, CircularProgress, Alert } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadImages from "@/components/UploadImages";
import { getIdentityDocument, updateIdentityDocument } from "@/services/driverService";

interface IdentityDocument {
    id?: number;
    userId?: number;
    frontImageUrl?: string;
    backImageUrl?: string;
    status?: string;
    
}

interface User {
    id?: number;
    user?: {
        id?: number;
    }
}




const IdentityDocumentInfo = () => {
    const { user } = useSelector((state: RootState) => state.auth as { user: User | null });
    const [identityDocument, setIdentityDocument] = useState<IdentityDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [frontSide, setFrontSide] = useState("");
    const [backSide, setBackSide] = useState("");

    const fetchIdentityDocument = async () => {
        try {
            setLoading(true);
            if (user?.user?.id) {
                const data = await getIdentityDocument(user.user.id);
                setIdentityDocument(data);
                setFrontSide(data.frontImageUrl || "");
                setBackSide(data.backImageUrl || "");
            }
        } catch (err: any) {
            setError(err.message || "Cannot load identity document information");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIdentityDocument();
    }, [user]);

    const startEditing = () => {
        setEditing(true);
        setError("");
        setSuccess("");
    };

    const cancelEditing = () => {
        setEditing(false);
        setFrontSide(identityDocument?.frontImageUrl || "");
        setBackSide(identityDocument?.backImageUrl || "");
        setError("");
        setSuccess("");
    };

    const setFrontSideCallback = useCallback((value: string) => {
        setError("");
        setFrontSide(value);
    }, []);

    const setBackSideCallback = useCallback((value: string) => {
        setError("");
        setBackSide(value);
    }, []);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError("");
            setSuccess("");

            if (!frontSide || !backSide) {
                setError("Please upload both front and back sides of the identity document");
                setIsSubmitting(false);
                return;
            }

            const updateData = {
                frontImageUrl: frontSide,
                backImageUrl: backSide,
            };

            let result;
            if (identityDocument?.id) {
                result = await updateIdentityDocument(identityDocument.id, updateData);
            } else {
                result = await updateIdentityDocument(0, {
                    ...updateData,
                    userId: user?.user?.id,
                    status: "pending"
                });
            }

            setIdentityDocument(result);
            setSuccess("Update successfully, waiting for approval");
            setEditing(false);
        } catch (err: any) {
            setError(err.message || "Error when updating identity document information");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            {editing ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium mb-2">Front side</p>
                            <UploadImages setFrontSide={setFrontSideCallback} initialImage={frontSide} />
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-2">Back side</p>
                            <UploadImages setBackSide={setBackSideCallback} initialImage={backSide} />
                        </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                            className="bg-[#303030] text-white"
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={cancelEditing}
                            startIcon={<CancelIcon />}
                            className="border-[#303030] text-[#303030]"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {identityDocument && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Front side</p>
                                    {identityDocument.frontImageUrl ? (
                                        <img 
                                            src={identityDocument.frontImageUrl} 
                                            alt="Front side" 
                                            className="rounded-lg w-full max-h-40 object-cover"
                                        />
                                    ) : (
                                        <p className="font-medium">Not updated</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Back side</p>
                                    {identityDocument.backImageUrl ? (
                                        <img 
                                            src={identityDocument.backImageUrl} 
                                            alt="Back side" 
                                            className="rounded-lg w-full max-h-40 object-cover"
                                        />
                                    ) : (
                                        <p className="font-medium">Not updated</p>
                                    )}
                                </div>
                            </div> 

                            <div>
                                <p className="text-sm text-gray-500 mb-2">Status</p>
                                <span className={`font-medium ${
                                    identityDocument.status === 'approved' ? 'text-green-600 bg-green-100 rounded-md px-2 py-1' : 
                                    identityDocument.status === 'pending' ? 'text-red-600 bg-red-100 rounded-md px-2 py-1' : 
                                    identityDocument.status === 'rejected' ? 'text-red-700 bg-red-100 rounded-md px-2 py-1' : ''
                                }`}>
                                    {identityDocument.status === 'approved' ? 'Approved' : 
                                     identityDocument.status === 'pending' ? 'Pending' : 
                                     identityDocument.status === 'rejected' ? 'Rejected' : 'Not updated'}
                                </span>
                            </div>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={startEditing}
                                className="mt-3 bg-[#303030] text-white"
                            >
                                Update
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default IdentityDocumentInfo;