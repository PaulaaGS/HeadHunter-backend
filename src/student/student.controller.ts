import { Body, Controller, Get } from "@nestjs/common";
import { StudentService } from './student.service';
import { StudentDto } from './dto/student.dto';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('/list-all')
  getAll() {
    return this.studentService.listAll();
  }
}