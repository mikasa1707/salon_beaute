import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AvailablePersonnelDto {

    @IsNotEmpty()
    @IsDateString()
    date!: string;


    @IsNotEmpty()
    @IsString()
    heure!: string;


    @IsArray()
    @IsNumber({}, { each: true })
    prestationIds!: number[];

}