import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as otpGenerator from 'otp-generator';
import { EmailVerification } from './entities/email-verification.entity';

@Injectable()
export class OtpService {
    constructor(
        @Inject('OTP_REPOSITORY')
        public otpRepo: Repository<EmailVerification>,
    ) {}

    async generateOtp(email: string): Promise<string> {
        // Xóa các OTP cũ
        await this.otpRepo.delete({ email });

        const code = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        await this.otpRepo.save({
            email,
            code,
            expires_at: expiresAt,
        });

        return code;
    }

    async validateOtp(email: string, code: string): Promise<boolean> {
        const record = await this.otpRepo.findOne({
            where: { email, code, is_used: false },
        });

        if (!record || record.expires_at < new Date()) {
            throw new UnauthorizedException("Invalid OTP code");
        }

        // Đánh dấu đã sử dụng
        await this.otpRepo.update(record.id, { is_used: true });
        return true;
    }
}