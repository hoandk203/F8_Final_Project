import { PartialType } from "@nestjs/mapped-types";
import { CreateDriverDto } from "./create-driver.dto";

export class UpdateDriverDto extends PartialType(CreateDriverDto) {
    fullname?: string;
    gstNumber?: string;
    address?: string;
    city?: string;
    country?: string;
    phoneNumber?: string;
    identityDocumentId?: number;
    status?: 'idle' | 'busy';
}