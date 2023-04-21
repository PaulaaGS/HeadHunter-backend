import {
  IsEmail, Max,
  MaxLength, Min
} from "class-validator";

export class HrDto {
  id: string;

  @IsEmail()
  @MaxLength(190)
  email: string;


  @MaxLength(60)
  fullName: string;


  @MaxLength(175)
  company: string;

  @Min(0)
  @Max(11)
  maxReservedStudents: number;
}

