import React, { memo } from "react";
import { TableContainer, Table, Paper, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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
}

const CommonTable = memo(function CommonTable({ columns, rows, handleOpenDialog, setCurrentData, softDelete }: Props) {
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
                                                    // Log dữ liệu row trước khi truyền
                                                    console.log("Row data before edit:", row);
                                                    
                                                    // Đảm bảo tất cả các trường dữ liệu được truyền đúng
                                                    // Tạo một đối tượng mới với các trường cần thiết
                                                    const dataToEdit = {
                                                        id: row.id,
                                                        fullname: row.fullname || "",
                                                        date_of_birth: row.date_of_birth || "",
                                                        gst_number: row.gst_number || "",
                                                        address: row.address || "",
                                                        city: row.city || "",
                                                        country: row.country || "",
                                                        phone_number: row.phone_number || "",
                                                        document_status: row.document_status || "",
                                                        user_id: row.user_id,
                                                        identity_document_id: row.identity_document_id,
                                                        vendor_id: row.vendor_id,
                                                        name: row.name || "",
                                                        email: row.email || "",
                                                        location: row.location || "",
                                                        vendorId: row.vendor_id
                                                    };
                                                    
                                                    console.log("Data to edit:", dataToEdit);
                                                    setCurrentData(dataToEdit);
                                                    handleOpenDialog();
                                                }} className={"cursor-pointer me-2 hover:text-yellow-400"} />
                                                <DeleteOutlineIcon onClick={() => softDelete(row.id)} className={"cursor-pointer hover:text-red-500"} />
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