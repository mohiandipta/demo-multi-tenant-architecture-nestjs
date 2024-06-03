import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserInfoDTO } from "../dtos/userInfo.dto";
import { UserInfo } from "../entities/userInfo.entity";
@Injectable()
export class UserInfoService {
  constructor(
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>
  ) { }

  async findAll(intOrganizationId: number) {
    try {
      const userInfo = await this.userInfoRepository.findBy({ intOrganizationId: intOrganizationId });
      if (userInfo.length === 0) throw new NotFoundException('User not found');

      return userInfo
    } catch (error) {
      return error.response
    }
  }

  async findById(intId: number) {
    try {
      const userInfo = await this.userInfoRepository.findOneBy({ intId: intId });
      if (userInfo === null) throw new NotFoundException('User not found');

      return {
        statusCode: 200,
        data: userInfo
      }
    } catch (error) {
      return error.response
    }
  }

  async findServiceMan(organizationId: number) {
    try {
      const userInfo = await this.userInfoRepository.find({ where: [{ intRoleId: 3, intOrganizationId: organizationId }] });

      if (userInfo.length === 0) throw new NotFoundException('User not found');

      return {
        statusCode: 200,
        data: userInfo
      }
    } catch (error) {
      return error.response
    }
  }

  async findRetailer(organizationId: number) {
    try {
      const userInfo = await this.userInfoRepository.find({ where: [{ intRoleId: 4, intOrganizationId: organizationId }] });

      if (userInfo.length === 0) throw new NotFoundException('User not found');

      return {
        statusCode: 200,
        data: userInfo
      }
    } catch (error) {
      return error.response
    }
  }

  async findByEmail(strEmail: string) {
    try {
      const userInfo = await this.userInfoRepository.findOneBy({ strEmail });

      return userInfo
    } catch (error) {
      return error.response
    }
  }

  async findByPhone(strPhone: string) {
    try {
      const userInfo = await this.userInfoRepository.findOneBy({ strPhone });

      return userInfo
    } catch (error) {
      return error.response
    }
  }

  async findOneUser(strEmail: string) {
    try {
      const user = await this.userInfoRepository.findOne({ where: [{ strEmail: strEmail }] })

      return user
    } catch (error) {
      return error.response
    }
  }

  async createUserInfo(userInfoDTO: UserInfoDTO) {
    try {
      const userInfo = await this.userInfoRepository.save(userInfoDTO)
      if (!userInfo) throw new NotFoundException('User can not be created. Please try again');

      return userInfo
    } catch (error) {
      return error.response
    }
  }

  async updateUserInfo(intId: number, userInfoDTO: UserInfoDTO) {
    try {
      const userInfo = await this.userInfoRepository.findOneBy({ intId });
      if (!userInfo) throw new NotFoundException('User not found');

      const info = await this.userInfoRepository.update(intId, userInfoDTO)
      if (!info) throw new NotFoundException('User can not be updated. Please try again');

      return info;
    }

    catch (error) {
      return error.response
    }
  }
  async updatePassword(intId: number, strPassword: string) {
    try {
      const userInfo = await this.userInfoRepository.findOneBy({ intId });
      if (!userInfo) throw new NotFoundException('User not found');

      const info = await this.userInfoRepository.update(intId, { strPassword: strPassword })
      if (!info) throw new NotFoundException('Password can not be updated. Please try again');

      return info;
    } catch (error) {
      return error.response
    }
  }

  async updateImage(intId: number, strImageURL: string) {
    try {
      const userInfo = await this.userInfoRepository.findOneBy({ intId });
      if (!userInfo) throw new NotFoundException('User not found');

      const info = await this.userInfoRepository.update(intId, { strImageURL: strImageURL })
      if (!info) throw new NotFoundException('Image can not be updated. Please try again');

      return info;
    } catch (error) {
      return error.response
    }
  }

  async updateRole(intId: number, intRoleId: number) {
    try {
      const userInfo = await this.userInfoRepository.findOneBy({ intId });
      if (!userInfo) throw new NotFoundException('User not found');

      const info = await this.userInfoRepository.update(intId, { intRoleId: intRoleId })
      if (!info) throw new NotFoundException('Role can not be updated. Please try again');

      return info;
    } catch (error) {
      return error.response
    }
  }

  async deleteUserInfo(intId: number) {
    try {
      const userInfo = await this.userInfoRepository.findOneBy({ intId });
      if (!userInfo) throw new NotFoundException('User not found');

      const info = await this.userInfoRepository.delete(intId);
      if (!info) throw new NotFoundException('User can not be deleted. Please try again');

      return info;
    }
    catch (error) {
      return error.response
    }
  }

}
