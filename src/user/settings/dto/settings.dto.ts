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
  facebook?: string;
  @IsOptional()
  @IsNotEmpty()
  instagram?: string;

  @IsOptional()
  @IsNotEmpty()
  youtube?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  website?: string;
  @IsOptional()
  @IsNotEmpty()
  profileDesc?: string;
  @IsOptional()
  @IsBoolean()
  darkTheme?: boolean;
}
