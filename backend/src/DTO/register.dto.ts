import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    ValidateIf,
  } from 'class-validator'
  
  export enum Provider {
    LOCAL  = 'local',
    GOOGLE = 'google',
    APPLE  = 'apple',
  }
  
  export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    readonly username: string
  
    @IsEmail()
    @IsNotEmpty()
    readonly email: string
  
    @ValidateIf(o => !o.provider || o.provider === Provider.LOCAL)
    @IsString()
    @IsNotEmpty()
    readonly password?: string
  
    @IsOptional()
    @IsString()
    readonly phone?: string
  
    @IsOptional()
    @IsString()
    readonly country?: string
  
    @IsOptional()
    @IsEnum(Provider)
    readonly provider?: Provider
  
    @IsOptional()
    @IsString()
    readonly providerId?: string
  }