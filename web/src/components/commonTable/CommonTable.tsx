import React, { memo } from "react";
import { TableContainer, Table, Paper, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface Column {
    name: string;
    key: string;
    format?: (value: any) => string;
}

interface Props {
    columns: Column[];
    rows: any[];
    handleOpenDialog: () => void;
    setCurrentData: (data: any) => void;
    softDelete: (id: number) => void;
    onViewDocument?: (row: any) => void;
    onViewVehicle?: (row: any) => void;
}

const CommonTable = memo(function CommonTable({ columns, rows, handleOpenDialog, setCurrentData, softDelete, onViewDocument, onViewVehicle }: Props) {
    console.log(rows);
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <TableHead>
                    <TableRow className="bg-gray-100">
                        {columns.map((column) => (
                            <TableCell className={"border"} key={column.key}>
                                {column.name}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, ridx) => {
                        return (
                            <TableRow key={`${ridx}`} className="border-b hover:bg-gray-100">
                                {columns.map((column) => {
                                    if (column.key === "action") {
                                        return (
                                            <TableCell className="border" key={`${ridx}${column.key}`}>
                                                <EditIcon onClick={() => {
                                                    // Đảm bảo tất cả các trường dữ liệu được truyền đúng
                                                    const dataToEdit = {
                                                        id: row.id,
                                                        fullname: row.fullname || "",
                                                        date_of_birth: row.date_of_birth || "",
                                                        gst_number: row.gst_number || "",
                                                        address: row.address || "",
                                                        city: row.city || "",
                                                        country: row.country || "",
                                                        phone_number: row.phone_number || "",
                                                        phone: row.phone || "",
                                                        document_status: row.document_status || "",
                                                        vehicle_status: row.vehicle_status || "",
                                                        user_id: row.user_id,
                                                        vehicle_id: row.vehicle_id,
                                                        identity_document_id: row.identity_document_id,
                                                        vendor_id: row.vendor_id,
                                                        name: row.name || "",
                                                        unitPrice: row.unitPrice || 0,
                                                        email: row.email || "",
                                                        description: row.description || "",
                                                    };
                                                    
                                                    setCurrentData(dataToEdit);
                                                    handleOpenDialog();
                                                }} className={"cursor-pointer text-black hover:text-blue-700"} fontSize="small"/>
                                                <DeleteOutlineIcon onClick={() => softDelete(row.id)} className={"cursor-pointer text-black hover:text-red-700 ml-2"} fontSize="small"/>
                                            </TableCell>
                                        );
                                    }
                                    if (column.key === "document_status") {
                                        return (
                                            <TableCell className="border" key={`${ridx}${column.key}`}>
                                                <div className="flex items-center">
                                                    <span className={`mr-2 ${
                                                        row[column.key] === 'approved' ? 'text-green-600' : 
                                                        row[column.key] === 'rejected' ? 'text-red-600' : 
                                                        'text-yellow-600'
                                                    }`}>
                                                        {column.format ? column.format(row[column.key]) : row[column.key]}
                                                    </span>
                                                        <VisibilityIcon 
                                                            className="cursor-pointer text-black hover:text-blue-700"
                                                            onClick={() => onViewDocument && onViewDocument({
                                                                ...row,
                                                                identity_document_id: row.identity_document_id
                                                            })}
                                                            fontSize="small"
                                                        />
                                                </div>
                                            </TableCell>
                                        );
                                    }
                                    if (column.key === "vehicle_status") {
                                        return (
                                            <TableCell className="border" key={`${ridx}${column.key}`}>
                                                <div className="flex items-center">
                                                    <span className={`mr-2 ${
                                                        row[column.key] === 'approved' ? 'text-green-600' :
                                                            row[column.key] === 'rejected' ? 'text-red-600' :
                                                                'text-yellow-600'
                                                    }`}>
                                                        {column.format ? column.format(row[column.key]) : row[column.key]}
                                                    </span>
                                                    <VisibilityIcon
                                                        className="cursor-pointer text-black hover:text-blue-700"
                                                        onClick={() => onViewVehicle && onViewVehicle({
                                                            ...row,
                                                            vehicle_id: row.vehicle_id
                                                        })}
                                                        fontSize="small"
                                                    />
                                                </div>
                                            </TableCell>
                                        );
                                    }
                                    if (column.name === "img") {
                                        return (
                                            <TableCell className="border" key={`${ridx}${column.key}`}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                    }}
                                                >
                                                    {Array.isArray(row[column.key]) &&
                                                        row[column.key].map((img: string, index: number) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    style={{
                                                                        width: "80px",
                                                                        height: "80px",
                                                                        border: "1px solid black",
                                                                        margin: "5px",
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        flexDirection: "column",
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={img}
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </TableCell>
                                        );
                                    }
                                    if (column.format && column.key in row) {
                                        return <TableCell className="border" key={`${ridx}${column.key}`}>{column.format(row[column.key])}</TableCell>;
                                    }
                                    return <TableCell className="border" key={`${ridx}${column.key}`}>{row[column.key]}</TableCell>;
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </table>
        </div>
    );
});

export default CommonTable;