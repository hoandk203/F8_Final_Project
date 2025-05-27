import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VnpayCallbackDto {
    @IsNotEmpty()
    @IsString()
    vnp_Amount: string;

    @IsNotEmpty()
    @IsString()
    vnp_BankCode: string;

    @IsNotEmpty()
    @IsString()
    vnp_BankTranNo: string;

    @IsNotEmpty()
    @IsString()
    vnp_CardType: string;

    @IsNotEmpty()
    @IsString()
    vnp_OrderInfo: string;

    @IsNotEmpty()
    @IsString()
    vnp_PayDate: string;

    @IsNotEmpty()
    @IsString()
    vnp_ResponseCode: string;

    @IsNotEmpty()
    @IsString()
    vnp_TmnCode: string;

    @IsNotEmpty()
    @IsString()
    vnp_TransactionNo: string;

    @IsNotEmpty()
    @IsString()
    vnp_TransactionStatus: string;

    @IsNotEmpty()
    @IsString()
    vnp_TxnRef: string;

    @IsNotEmpty()
    @IsString()
    vnp_SecureHash: string;

    @IsNotEmpty()
    @IsString()
    returnUrl: string;
} 