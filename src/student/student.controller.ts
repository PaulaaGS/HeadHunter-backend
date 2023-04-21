import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.entity';
import {
  CreateStudentResponse,
  GetListOfStudentsResponse,
  GetOneStudentResponse,
  UpdateStudentResponse,
} from '../interfaces/student';

@Controller('student')
export class StudentController {
  constructor(@Inject(StudentService) private studentService: StudentService) {}

  @Get('/')
  getListOfStudents(): Promise<GetListOfStudentsResponse> {
    return this.studentService.getListOfStudents();
  }

  @Get('/:id')
  getOneStudent(@Param('id') id: string): Promise<GetOneStudentResponse> {
    return this.studentService.getOneStudent(id);


  }
  /**metoda GET /available-list do pobrania listy dostępnych studentów
   dodanie logiki w student service, żeby pobrać kursantów bez przypisanego HR lub rezerwacja przedawniona (10 dni od zarezerwowania) */


  @Get('/available-list')
  getAvailableStudent(): Promise<GetListOfStudentsResponse[]> {

    return this.studentService.getAvailableStudent()
  }






  @Delete('/:id')
  removeStudent(@Param('id') id: string): Promise<void> {
    return this.studentService.removeStudent(id);
  }

  @Post('/')
  createStudent(@Body() newStudent: Student): Promise<CreateStudentResponse> {
    return this.studentService.createStudent(newStudent);
  }

  @Put('/:id')
  updateStudent(
    @Param('id') id: string,
    @Body() updatedStudent: Student,
  ): Promise<UpdateStudentResponse> {
    return this.studentService.updateStudent(id, updatedStudent);
  }

  @Post('/import')
  importStudentsCsv(@Body() csvFile: string) {
    return this.studentService.importStudentsCsv(csvFile);
  }
}
