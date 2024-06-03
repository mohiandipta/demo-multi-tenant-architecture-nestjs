import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePersonalAccessTokenDto } from '../dto/create-personal-access-token.dto';
import { UpdatePersonalAccessTokenDto } from '../dto/update-personal-access-token.dto';
import { PersonalAccessToken } from '../entities/personal-access-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PersonalAccessTokenService {
  private jwtOptions: JwtSignOptions;

  constructor(
    @InjectRepository(PersonalAccessToken)
    private personalAccessTokenRepository: Repository<PersonalAccessToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtOptions = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h', // Default expiration if needed
    };
  }

  async create(createPersonalAccessTokenDto: CreatePersonalAccessTokenDto) {
    try {
      const tokenData = await this.findOne(createPersonalAccessTokenDto.intOrgId)
      if (tokenData) {
        throw new ConflictException('Parsonal Access Token already exist for this organization')
      }

      const tokenPayload = {
        intOrgId: createPersonalAccessTokenDto.intOrgId,
        intLastActionBy: createPersonalAccessTokenDto.intLastActionBy,
        strExpireAt: createPersonalAccessTokenDto.strExpireAt,
        strTokenName: createPersonalAccessTokenDto.strTokenName,
      }
      // console.log("Service", createPersonalAccessTokenDto)
      const personalAccessToken = await this.jwtService.signAsync(tokenPayload, { ...this.jwtOptions, expiresIn: createPersonalAccessTokenDto.strExpireAt });

      // Calculate the token validity date
      const tokenValidityInMs = this.convertExpireStringToMs(createPersonalAccessTokenDto.strExpireAt);
      const dteTokenValidity = new Date(Date.now() + tokenValidityInMs);
      
      const personalAccessTokenData: CreatePersonalAccessTokenDto = {
        ...createPersonalAccessTokenDto,
        dteTokenValidity,
        strDescription: createPersonalAccessTokenDto.strDescription,
        strToken: personalAccessToken
      }

      const pat = await this.personalAccessTokenRepository.save(personalAccessTokenData)

      return pat
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async findAll() {
    return ""
  }

  async findOne(id: number) {
    try {
      const tokenData = await this.personalAccessTokenRepository.findOneBy({ intOrgId: id })
      if (!tokenData) throw new NotFoundException('tokenData can not be found by this Org!');

      return tokenData
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  update(id: number, updatePersonalAccessTokenDto: UpdatePersonalAccessTokenDto) {
    return `This action updates a #${id} personalAccessToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} personalAccessToken`;
  }

  private convertExpireStringToMs(expireString: string): number {
    // Convert the expiration string to milliseconds
    const timeValue = parseInt(expireString.slice(0, -1), 10);
    const timeUnit = expireString.slice(-1).toLowerCase();

    switch (timeUnit) {
      case 's': return timeValue * 1000;
      case 'm': return timeValue * 60 * 1000;
      case 'h': return timeValue * 60 * 60 * 1000;
      case 'd': return timeValue * 24 * 60 * 60 * 1000;
      default: throw new Error('Invalid expiration string');
    }
  }
}
