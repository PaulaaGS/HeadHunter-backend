import { Body, Controller, Get, Post } from "@nestjs/common";
import { StudentService } from './student.service';
import { StudentDto } from './dto/student.dto';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('/list-all')
  signup(@Body() dto: StudentDto) {
    return this.studentService.listAll(dto);
  }
}