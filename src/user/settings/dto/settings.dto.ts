import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
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
  facebook?: string;

  @IsOptional()
  instagram?: string;

  @IsOptional()
  youtube?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  profileDesc?: string;

  @IsOptional()
  @IsBoolean()
  darkTheme?: boolean;
}
