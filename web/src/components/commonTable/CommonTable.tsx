import React, { memo } from "react";
import { TableContainer, Table, Paper, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface Props{
    columns: any[];
    rows: any[];
    setCurrentData: (data: any) => void;
    handleOpenDialog: () => void;
    softDelete: (id: number) => void;
}

const CommonTable = memo(function CommonTable({ columns, rows, setCurrentData, handleOpenDialog, softDelete }: Props) {
    console.log(rows)
    return (
        <>
            <TableContainer sx={{boxShadow: "0px 0px 1px 1px rgba(0, 0, 0, 0.1)"}} className="rounded-xl !mx-0" component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow className="bg-gray-100">
                            {columns.map((column) => (
                                <TableCell className={"border"} width={column?.width} key={column.key}>
                                    {column.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, ridx) => {
                            return (
                                <TableRow key={`${ridx}`}>
                                    {columns.map((column) => {
                                        if (column.key === "action") {
                                            return (
                                                <TableCell className="border" key={`${ridx}${column.key}`}>
                                                    <EditIcon onClick={() => {
                                                        setCurrentData({
                                                            id: row.id,
                                                            name: row.name,
                                                            email: row.email,
                                                            location: row.location,
                                                            vendorId: row.vendor_id
                                                        })
                                                        handleOpenDialog()
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
                                        return <TableCell className="border" key={`${ridx}${column.key}`}>{row[column.key]}</TableCell>;
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
});

export default CommonTable;