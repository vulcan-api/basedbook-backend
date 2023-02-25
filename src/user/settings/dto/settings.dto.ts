import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class SettingsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  surname?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  facebook?: string;
  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  instagram?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  youtube?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  website?: string;
  @IsOptional()
  @IsNotEmpty()
  description?: string;
  @IsOptional()
  @IsBoolean()
  theme?: boolean;
}
