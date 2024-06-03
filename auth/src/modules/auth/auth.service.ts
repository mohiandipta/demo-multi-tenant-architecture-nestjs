
import { Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from "./jwt.strategy";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthDTO, OrgRegisterDTO, UserRegisterDTO, shopRegisterDTO } from "./dtos/auth.dto";
import { LoginInfo } from "./entities/auth.entity";
import { UserInfoService } from "../users/services/userInfo.service";
import { RoleService } from "../role/services/role.service";
import { hashPassword } from "src/utils/bcrypt";
import { sendMail } from "src/utils/sendEmail";
import { randomNumGenerate } from "src/utils/generateOTP";
import { OrganizationService } from "../organization/services/organization.service";
import { sendSms } from "src/utils/sendSMS";
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(LoginInfo)
        private loginInfoRepository: Repository<LoginInfo>,
        private userInfoService: UserInfoService,
        private roleService: RoleService,
        private orgService: OrganizationService,
        private readonly jwtService: JwtService
    ) { }

    // generates refresh tokens only
    private async generateRefreshToken(existingUser: any): Promise<string> {
        const oldRefToken = existingUser.strRefresh_token;
        if (!oldRefToken) {
            throw new InternalServerErrorException('Refresh token not found in the existing user.');
        }

        try {
            const decodedRefToken: any = this.jwtService.decode(oldRefToken);

            if (!decodedRefToken) {
                throw new InternalServerErrorException('Invalid refresh token in the decoded token.');
            }

            const { email, intId, password } = decodedRefToken;

            const payload = {
                email: email,
                intId: intId,
                password: password,
                roleId: existingUser.intRoleId,
                organizationId: existingUser.intOrganizationId,
            };

            const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '30d' });
            await this.loginInfoRepository.update(existingUser.intId, { strRefresh_token: refreshToken });

            return refreshToken;
        } catch (error) {
            throw error
        }
    }

    // generates access token only
    private async generateAccessToken(existingUser: any): Promise<string> {
        const oldRefToken = existingUser.strRefresh_token;
        if (!oldRefToken) {
            throw new InternalServerErrorException('Refresh token not found to generate Access token');
        }

        try {
            const decodedRefToken: any = this.jwtService.decode(oldRefToken);

            if (!decodedRefToken) {
                throw new InternalServerErrorException('Invalid refresh token in the decoded token.');
            }

            const { email, intId, password } = decodedRefToken;

            const payload = {
                email: email,
                intId: intId,
                password: password,
                roleId: existingUser.intRoleId,
                organizationId: existingUser.intOrganizationId,
            };

            const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1h' });

            await this.loginInfoRepository.update(existingUser.intId, { strAccess_token: accessToken, dteLastLogin: new Date() });


            return accessToken;
        } catch (error) {
            console.error('Error generating access token:', error);
            throw error
        }
    }

    async sendOtp(email: string) {
        try {
            const existingUser = await this.loginInfoRepository.findOne({ where: { strEmail: email } });

            if (existingUser) {
                const otp = randomNumGenerate.generateOTP();
                existingUser.intOtp = otp;
                await this.loginInfoRepository.save(existingUser)
                sendMail(email, 'Warranty Wizard OTP', `<h1>Warranty Wizard OTP</h1><p>Hi User,</p><p>Your OTP is - ${otp} to continue your registration</p><p>Thanks</p><p> Warranty Wizard.</p>`)
            } else {
                const otp = randomNumGenerate.generateOTP();
                await this.loginInfoRepository.save({
                    strEmail: email,
                    intOtp: otp
                })
                sendMail(email, 'Warranty Wizard OTP', `<h1>Warranty Wizard OTP</h1><p>Hi User,</p><p>Your OTP is - ${otp} to continue your registration</p><p>Thanks</p><p> Warranty Wizard.</p>`)
            }

            return { statusCode: 200, message: 'OTP sent successfully' };
        } catch (error) {
            console.error('Authentication error:', error);
            throw error
        }
    }

    credentialType(identifier: string) {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const isPhoneNumber = /^\d+$/.test(identifier);

        if (isEmail) {
            return 'email';
        } else if (isPhoneNumber) {
            return 'phone';
        } else {
            return 'invalid';
        }
    }

    async passwordResetOtp(credential: string) {
        try {
            const cred = this.credentialType(credential);
            const otp = randomNumGenerate.generateOTP();

            if (cred === 'email') {
                const existingUser = await this.loginInfoRepository.findOne({ where: { strEmail: credential } });
                if (!existingUser) {
                    throw new NotFoundException('User not found with this email');
                }
                existingUser.intOtp = otp;
                await this.loginInfoRepository.save(existingUser);

                const emailSubject = 'Warranty Wizard Password Reset OTP';
                const emailBody = `<h1>Password Reset OTP</h1><p>Your one-time password (OTP) to reset your password: <strong>${otp}</strong></p><p>If you didn't request this, please ignore this email.</p><p>Thank you for choosing Warranty Wizard.</p>`;
                sendMail(credential, emailSubject, emailBody);

                return { statusCode: 200, message: 'OTP sent successfully' };
            } else if (cred === 'phone') {
                const existingUser = await this.loginInfoRepository.findOne({ where: { strPhone: credential } });
                if (!existingUser) {
                    throw new NotFoundException('User not found with this phone number');
                }
                await this.loginInfoRepository.update({ strPhone: credential }, { intOtp: otp });

                const message = `Warranty Wizard Password Reset OTP: ${otp}\n\nUse this code to reset your password. If you didn't request this, contact support.\n\n- - Warranty Wizard.`;
                sendSms(credential, message);

                return { statusCode: 200, message: 'OTP sent successfully' };
            } else {
                return { message: 'Invalid input. Please provide a valid email or phone number.' };
            }
        } catch (error) {
            throw error
        }
    }

    async verifyPasswordResetOtp(credential: string, intOtp: number) {
        try {
            const credType = this.credentialType(credential);

            if (credType === 'email' || credType === 'phone') {
                const userField = credType === 'email' ? 'strEmail' : 'strPhone';
                const info = await this.loginInfoRepository.findOne({ where: { [userField]: credential } });

                if (!info) {
                    throw new NotFoundException(`User not found with this ${credType}`);
                }

                if (info.intOtp !== intOtp) {
                    return { statusCode: 400, message: 'OTP does not match' };
                }

                return { statusCode: 200, message: 'OTP matched successfully' };
            } else {
                return { statusCode: 400, message: 'Invalid input. Please provide a valid email or phone number.' };
            }
        } catch (error) {
            throw error
        }
    }

    async resetPassword(credential: string, newPassword: string) {
        try {
            const credType = this.credentialType(credential);

            if (credType === 'email' || credType === 'phone') {
                const userField = credType === 'email' ? 'strEmail' : 'strPhone';
                const userInfo = await this.loginInfoRepository.findOne({ where: { [userField]: credential } });

                if (!userInfo) {
                    throw new NotFoundException(`User not found with this ${credType}`);
                }
                // Clear the OTP after successful use
                userInfo.intOtp = null;
                const hashedPassword = await hashPassword(newPassword);
                userInfo.strPassword = hashedPassword;
                await this.loginInfoRepository.save(userInfo);
                await this.userInfoService.updatePassword(userInfo.intUserId, hashedPassword);

                return { statusCode: 200, message: 'Password updated successfully' };
            } else {
                return { statusCode: 400, message: 'Invalid input. Please provide a valid email or phone number.' };
            }
        } catch (error) {
            throw error
        }
    }

    async verifyOtp(email: string, otpToVerify: number) {
        try {
            const user = await this.loginInfoRepository.findOne({ where: { strEmail: email } });

            if (user && user.intOtp === otpToVerify) {
                return { statusCode: 200, message: 'OTP verified successfully' };
            } else {
                return { statusCode: 400, message: 'Invalid OTP' };
            }
        } catch (error) {
            console.error('Verification error:', error);
            throw error
        }
    }

    async login(strEmailOrPhone: string, strPassword: string) {
        try {
            if (!strEmailOrPhone || !strPassword) {
                throw new UnauthorizedException('Email/Phone and password are required.')
            }
            let user: any
            let isEmailLogin = false
            if (strEmailOrPhone.includes('@')) {
                isEmailLogin = true
                user = await this.userInfoService.findByEmail(strEmailOrPhone)
            } else {
                user = await this.userInfoService.findByPhone(strEmailOrPhone)
            }

            if (!user) {
                throw new UnauthorizedException('user not found with this email or phone!');
            }

            const passwordMatched = await compare(strPassword, user.strPassword)
            if (!passwordMatched) {
                throw new UnauthorizedException('invalid password!');
            }

            const existingUser = await this.loginInfoRepository.findOne({
                where: isEmailLogin ? { strEmail: strEmailOrPhone } : { strPhone: strEmailOrPhone },
            });

            if (!existingUser) {
                throw new InternalServerErrorException('User data not found in the login repository.');
            }

            const userToken = {
                ...existingUser,
                intRoleId: user.intRoleId,
                intOrganizationId: user.intOrganizationId
            }

            const refreshToken = await this.generateRefreshToken(userToken);
            const accessToken = await this.generateAccessToken(userToken);

            const role = await this.roleService.findById(user.intRoleId)
            const organizationInfo = await this.orgService.findById(user.intOrganizationId)

            if (!organizationInfo) throw new NotFoundException('Organization not found');

            return {
                statusCode: 200,
                message: "login success!",
                data: {
                    userId: user.intId,
                    name: `${user.strFirstName} ${user.strLastName}`,
                    role: role.strRoleName,
                    email: user?.strEmail,
                    phone: user?.strPhone,
                    serviceId: organizationInfo?.data?.intServiceId,
                    imgURL: user?.strImageURL,
                    intOrganizationId: user?.intOrganizationId,
                    strAccess_token: accessToken,
                    strRefresh_token: refreshToken,
                }
            };

        } catch (error) {
            console.error('Authentication error:', error);
            throw error
        }
    }

    async register(registerDTO: UserRegisterDTO) {
        try {
            if (!registerDTO.strEmail || !registerDTO.strPassword || !registerDTO.strPhone || !registerDTO.strUserName || !registerDTO.strFirstName || !registerDTO.strLastName) {
                throw new UnauthorizedException('Invalid credentials!');
            }
            const isUserEmailExist = await this.userInfoService.findByEmail(registerDTO.strEmail)
            if (isUserEmailExist) {
                throw new UnauthorizedException('user already exist with this email!');
            }

            const isUserPhoneExist = await this.userInfoService.findByPhone(registerDTO.strPhone)
            if (isUserPhoneExist) {
                throw new UnauthorizedException('user already exist with this phone!');
            }

            const hashedPassword = await hashPassword(registerDTO.strPassword)
            const user = await this.userInfoService.createUserInfo({
                strUserName: registerDTO.strUserName,
                strFirstName: registerDTO.strFirstName,
                strLastName: registerDTO.strLastName,
                strEmail: registerDTO.strEmail,
                strPassword: hashedPassword,
                intRoleId: registerDTO.intRoleId,
                strPhone: registerDTO.strPhone,
                strImageURL: registerDTO.strImageURL,
                dteCreatedAt: new Date(),
                dteLastLoginAt: new Date(),
                blnIsActive: true,
                intOrganizationId: registerDTO.intOrganizationId,
            })

            // find RoleName to generate strRefresh_token
            const role = await this.roleService.findById(user.intRoleId)
            const payload = {
                email: user.strEmail,
                intId: user.intId,
                password: user.strPassword,
                role: role.strRoleName,
                concernId: user.intConcernId,
            }
            const expiresIn = '30d';
            const strRefresh_token = await this.jwtService.signAsync(payload, { expiresIn })

            const newUser = this.loginInfoRepository.create({
                intUserId: user.intId,
                strEmail: user.strEmail,
                strPhone: user.strPhone,
                strPassword: user.strPassword,
                dteLastLogin: new Date(),
                strRefresh_token: strRefresh_token,
            });
            await this.loginInfoRepository.save(newUser);

            sendMail(user.strEmail, "Account Created", `<h1>Account Created</h1><p>Hi ${user.strFirstName} ${user.strLastName},</p><p>Your account has been created successfully.</p><p>Thanks</p><p>Akij Bicycle Ltd.</p>`)

            return {
                statusCode: 200,
                message: "account created!",
                data: user
            }
        } catch (error) {
            throw error
        }
    }

    async orgRegister(registerDTO: OrgRegisterDTO) {
        try {
            if (!registerDTO.strEmail || !registerDTO.strPassword || !registerDTO.strPhone || !registerDTO.strUserName || !registerDTO.regOrg.strOrganizationName || !registerDTO.regOrg.strIndustryType || !registerDTO.regOrg.intServiceId || !registerDTO.intRoleId || !registerDTO.strFirstName || !registerDTO.strLastName) {
                throw new UnauthorizedException('Invalid credentials!');
            }
            const isUserEmailExist = await this.userInfoService.findByEmail(registerDTO.strEmail)
            if (isUserEmailExist) {
                throw new UnauthorizedException('user already exist with this email!');
            }

            const isUserPhoneExist = await this.userInfoService.findByPhone(registerDTO.strPhone)
            if (isUserPhoneExist) {
                throw new UnauthorizedException('user already exist with this phone!');
            }

            const org = await this.orgService.create(registerDTO.regOrg)

            const hashedPassword = await hashPassword(registerDTO.strPassword)
            const user = await this.userInfoService.createUserInfo({
                strUserName: registerDTO.strUserName,
                strFirstName: registerDTO.strFirstName,
                strLastName: registerDTO.strLastName,
                strEmail: registerDTO.strEmail,
                strPassword: hashedPassword,
                intRoleId: registerDTO.intRoleId,
                strPhone: registerDTO.strPhone,
                strImageURL: registerDTO.strImageURL,
                dteCreatedAt: new Date(),
                dteLastLoginAt: new Date(),
                blnIsActive: true,
                intOrganizationId: org.intId,
            })
            // find RoleName to generate strRefresh_token
            const role = await this.roleService.findById(user.intRoleId)
            const payload = {
                email: user.strEmail,
                intId: user.intId,
                password: user.strPassword,
                role: role.strRoleName,
                organizationId: user.intOrganizationId,
            }
            const expiresIn = '30d';
            const strRefresh_token = await this.jwtService.signAsync(payload, { expiresIn })

            this.loginInfoRepository.update({ strEmail: user.strEmail }, {
                intUserId: user.intId,
                strEmail: user.strEmail,
                strPhone: user.strPhone,
                strPassword: user.strPassword,
                dteLastLogin: new Date(),
                strRefresh_token: strRefresh_token,
            });

            sendMail(user.strEmail, "Account Created", `<h1>Account Created</h1><p>Hi ${user.strFirstName} ${user.strLastName},</p><p>Your account has been created successfully.</p><p>Thanks</p><p> Warranty Wizard.</p>`)

            return {
                statusCode: 200,
                message: "account created!",
                data: user
            }
        } catch (error) {
            throw error
        }
    }

    async shopRegister(registerDTO: shopRegisterDTO) {
        try {
            if(!registerDTO.strOwnerName || !registerDTO.strShopName || !registerDTO.strPhone || !registerDTO.strPassword ){
                throw new UnauthorizedException('Invalid credentials!');
            }
            const isUserPhoneExist = await this.userInfoService.findByPhone(registerDTO.strPhone)
            if (isUserPhoneExist) {
                throw new UnauthorizedException('User already exist with this phone!');
            }

            const hashedPassword = await hashPassword(registerDTO.strPassword)
            const user = await this.userInfoService.createUserInfo({
                strUserName: registerDTO.strShopName,
                strFirstName: registerDTO.strOwnerName,
                strEmail: `${registerDTO.strPhone}@email.com`,
                strLastName: "",
                strPassword: hashedPassword,
                intRoleId: 4,
                strPhone: registerDTO.strPhone,
                strImageURL: registerDTO.strImageURL,
                dteCreatedAt: new Date(),
                dteLastLoginAt: new Date(),
                blnIsActive: true,
                intOrganizationId: registerDTO.intOrganizationId
            })

            // find RoleName to generate strRefresh_token
            const role = await this.roleService.findById(user.intRoleId)
            const payload = {
                email: user.strEmail,
                intId: user.intId,
                password: user.strPassword,
                role: role.strRoleName,
                organizationId: user.intOrganizationId,
            }
            const expiresIn = '30d';
            const strRefresh_token = await this.jwtService.signAsync(payload, { expiresIn })

            const newUser = this.loginInfoRepository.create({
                intUserId: user.intId,
                strEmail: user.strEmail,
                strPhone: user.strPhone,
                strPassword: user.strPassword,
                dteLastLogin: new Date(),
                strRefresh_token: strRefresh_token,
            });
            await this.loginInfoRepository.save(newUser);

            return {
                statusCode: 200,
                message: "account created!",
                data: user
            }
        } catch (error) {
            throw error
        }
    }

    async validateRefreshToken(refreshToken: any) {
        try {
            const decodedToken = this.jwtService.verify(refreshToken);

            if (decodedToken && decodedToken.intId) {

                const existingUser = await this.loginInfoRepository.findOne({
                    where: {
                        strEmail: decodedToken.email,
                    },
                });

                if (!existingUser) {
                    throw new InternalServerErrorException('User not found in the login repository.');
                }

                const user = await this.userInfoService.findByPhone(existingUser.strPhone);
                if (!user) {
                    throw new NotFoundException('User not found');
                }

                const userToken = {
                    ...existingUser,
                    intRoleId: user.intRoleId,
                    intOrganizationId: user.intOrganizationId
                }
                const newRefreshToken = await this.generateRefreshToken(userToken);
                const newAccessToken = await this.generateAccessToken(userToken);

                return {
                    strAccess_token: newAccessToken,
                    strRefresh_token: newRefreshToken,
                };
            }
        } catch (error) {
            throw error
        }
    }

    async logout(credential: string) {
        try {
            const credType = this.credentialType(credential);

            if (credType === 'email' || credType === 'phone') {
                const userField = credType === 'email' ? 'strEmail' : 'strPhone';
                const existingUser = await this.loginInfoRepository.findOne({ where: { [userField]: credential } });

                if (!existingUser) {
                    throw new NotFoundException(`User not found with this ${credType}`);
                }

                await this.loginInfoRepository.update(existingUser.intId, {
                    strAccess_token: null,
                });

                return { statusCode: 200, message: 'Logged out successfully' };
            } else {
                return { statusCode: 400, message: 'Invalid input. Please provide a valid email or phone number.' };
            }
        } catch (error) {
            throw error
        }
    }
}
