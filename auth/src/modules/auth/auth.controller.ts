import { Body, Controller, Get, Post, Delete, Req, Res, Next, Put, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthDTO, OrgRegisterDTO, UserRegisterDTO, shopRegisterDTO } from "./dtos/auth.dto";
import { AuthService } from "./auth.service";
import { REQUEST_ERROR, SUCCESS } from "src/shared/constants/httpCodes";
import { notFound, requestInvalid, success } from "src/helpers/http";
import { StorageService } from 'src/utils/azure/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
// import { compressImage } from 'src/utils/imgCompressor';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private azureStorageService: StorageService
    ) { }

    @Post('sendOtp')
    async sendOtp(
        @Req() request: Request,
        @Res() response: Response,
        @Body('email') email: string,
    ) {
        try {
            const data: any = await this.authService.sendOtp(email)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error));
        }
    }

    @Post('verifyOtp')
    async verifyOtp(
        @Req() request: Request,
        @Res() response: Response,
        @Body('email') email: string,
        @Body('otp') otp: number
    ) {
        try {
            const data: any = await this.authService.verifyOtp(email, otp)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            return response.status(REQUEST_ERROR).json(requestInvalid(error));
        }
    }

    @Post('login')
    async login(
        @Req() request: Request,
        @Res() response: Response,
        @Body('strEmailOrPhone') strEmailOrPhone: string,
        @Body('strPassword') strPassword: string
    ) {
        try {
            const data: any = await this.authService.login(strEmailOrPhone, strPassword)

            return response.status(SUCCESS).json((data))
        } catch (error) {
            throw error
        }
    }

    @Post('register')
    async register(
        @Req() request: Request,
        @Res() response: Response,
        @Body() registerDTO: UserRegisterDTO
    ) {
        try {
            const data: any = await this.authService.register(registerDTO)

            return response.status(SUCCESS).json((data))
        } catch (error) {
            throw error
        }
    }

    @Post('registerOrg')
    async registerOrg(
        @Req() request: Request,
        @Res() response: Response,
        @Body() registerDTO: OrgRegisterDTO
    ) {
        try {
            const data: any = await this.authService.orgRegister(registerDTO)

            return response.status(SUCCESS).json((data))
        } catch (error) {
            throw error
        }
    }


    @Post('logout')
    async logout(
        @Req() request: Request,
        @Res() response: Response,
        @Body('credential') credential: string
    ) {
        try {
            const data: any = await this.authService.logout(credential)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            throw error
        }
    }

    @Post('refresh')
    async refreshToken(
        @Req() request: Request,
        @Res() response: Response,
        @Body('refresh') refresh: any,
    ) {

        try {
            const data = await this.authService.validateRefreshToken(refresh);

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            throw error
        }
    }

    @Post('password/reset/send-otp')
    async sendResetPasswordOtp(
        @Req() request: Request,
        @Res() response: Response,
        @Body('credential') credential: string
    ) {
        try {
            const data: any = await this.authService.passwordResetOtp(credential)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            throw error
        }
    }

    @Post('password/reset/verify-otp')
    async verifyResetPasswordOtp(
        @Req() request: Request,
        @Res() response: Response,
        @Body('credential') credential: string,
        @Body('otp') otp: number
    ) {
        try {
            const data: any = await this.authService.verifyPasswordResetOtp(credential, otp)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            throw error
        }
    }

    @Post('password/reset')
    async resetPassword(
        @Req() request: Request,
        @Res() response: Response,
        @Body('credential') credential: string,
        @Body('newPassword') newPassword: string
    ) {
        try {
            const data: any = await this.authService.resetPassword(credential, newPassword)

            return response.status(SUCCESS).json(success(data))
        } catch (error) {
            throw error
        }
    }
}
