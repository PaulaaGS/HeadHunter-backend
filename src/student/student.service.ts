import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { Repository } from 'typeorm';
import {
  CreateStudentResponse,
  GetListOfStudentsResponse,
  UpdateStudentResponse,
} from '../interfaces/student';
import { StudentDto } from './dto/student.dto';
import * as Papa from 'papaparse';
import { MulterDiskUploadedFiles } from '../interfaces/multer-files';
import * as path from 'path';
import { unlink } from 'node:fs/promises';
import { storageDir } from '../utils/storage-csv';
import { readFile } from 'fs/promises';
import { filterGithubUrls } from '../utils/filter-github-urls';
import { Criteria } from '../interfaces/criteria';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async getListOfStudents(): Promise<GetListOfStudentsResponse> {
    return await this.studentRepository.find();
  }

  async getListOfStudentsFiltered(
    criteria: Criteria,
  ): Promise<GetListOfStudentsResponse> {
    const queryBuilder = this.studentRepository.createQueryBuilder('student');

    if (criteria.courseEngagement) {
      queryBuilder.andWhere('student.courseEngagement >= :courseEngagement', {
        courseEngagement: criteria.courseEngagement,
      });
    }

    if (criteria.courseCompletion) {
      queryBuilder.andWhere('student.courseCompletion >= :courseCompletion', {
        courseCompletion: criteria.courseCompletion,
      });
    }

    if (criteria.projectDegree) {
      queryBuilder.andWhere('student.projectDegree >= :projectDegree', {
        projectDegree: criteria.projectDegree,
      });
    }

    if (criteria.teamProjectDegree) {
      queryBuilder.andWhere('student.teamProjectDegree >= :teamProjectDegree', {
        teamProjectDegree: criteria.teamProjectDegree,
      });
    }

    if (criteria.expectedTypeWork && criteria.expectedTypeWork.length > 0) {
      queryBuilder.andWhere(
        'student.expectedTypeWork IN (:...expectedTypeWork)',
        {
          expectedTypeWork: criteria.expectedTypeWork,
        },
      );
    }

    if (
      criteria.expectedContractType &&
      criteria.expectedContractType.length > 0
    ) {
      queryBuilder.andWhere(
        'student.expectedContractType IN (:...expectedContractType)',
        { expectedContractType: criteria.expectedContractType },
      );
    }

    if (criteria.expectedSalary) {
      if (criteria.expectedSalary.min) {
        queryBuilder.andWhere('student.expectedSalary >= :minSalary', {
          minSalary: criteria.expectedSalary.min,
        });
      }

      if (criteria.expectedSalary.max) {
        queryBuilder.andWhere('student.expectedSalary <= :maxSalary', {
          maxSalary: criteria.expectedSalary.max,
        });
      }
    }

    if (criteria.canTakeApprenticeship !== undefined) {
      queryBuilder.andWhere(
        'student.canTakeApprenticeship = :canTakeApprenticeship',
        {
          canTakeApprenticeship: criteria.canTakeApprenticeship,
        },
      );
    }

    if (criteria.monthsOfCommercialExp) {
      queryBuilder.andWhere(
        'student.monthsOfCommercialExp >= :monthsOfCommercialExp',
        {
          monthsOfCommercialExp: criteria.monthsOfCommercialExp,
        },
      );
    }

    return await queryBuilder.getMany();
  }

  async getOneStudent(id: string): Promise<Student> {
    return await this.studentRepository.findOneByOrFail({ id });
  }

  async removeStudent(id: string): Promise<void> {
    await this.studentRepository.delete(id);
  }

  async createStudent(newStudent: Student): Promise<CreateStudentResponse> {
    return await this.studentRepository.save(newStudent);
  }

  async updateStudent(
    id: string,
    updatedStudent: Student,
  ): Promise<UpdateStudentResponse> {
    await this.studentRepository.update(id, updatedStudent);
    return this.getOneStudent(id);
  }

  async handleStudentParsingAndSavingToDatabase(csvFile: string) {
    const arrayOfCsvHeaders = [
      'courseCompletion',
      'courseEngagement',
      'projectDegree',
      'teamProjectDegree',
    ];
    const csvParsed: StudentDto[] = Papa.parse(csvFile, {
      header: true,
      transform: function (value, header) {
        if (arrayOfCsvHeaders.includes(header)) {
          return Number(value.replace(',', '.')).toFixed(2);
        } else {
          return value;
        }
      },
    }).data;

    for (const studentCsvData of csvParsed) {
      if (
        !(
          studentCsvData.email.includes('@') &&
          Number(studentCsvData.courseCompletion) <= 5 &&
          Number(studentCsvData.courseCompletion) >= 0 &&
          Number(studentCsvData.courseEngagement) <= 5 &&
          Number(studentCsvData.courseEngagement) >= 0 &&
          Number(studentCsvData.projectDegree) <= 5 &&
          Number(studentCsvData.projectDegree) >= 0 &&
          Number(studentCsvData.teamProjectDegree) <= 5 &&
          Number(studentCsvData.teamProjectDegree) >= 0
        )
      ) {
        continue;
      }

      studentCsvData.bonusProjectUrls = filterGithubUrls(
        studentCsvData.bonusProjectUrls,
      );

      const studentData = new StudentDto();
      studentData.email = studentCsvData.email;
      studentData.courseCompletion = studentCsvData.courseCompletion;
      studentData.courseEngagement = studentCsvData.courseEngagement;
      studentData.projectDegree = studentCsvData.projectDegree;
      studentData.teamProjectDegree = studentCsvData.teamProjectDegree;
      studentData.bonusProjectUrls = studentCsvData.bonusProjectUrls;

      // compulsory data to insert into Student table
      studentData.firstName = '';
      studentData.lastName = '';
      studentData.githubUsername = studentCsvData.email; // Unique index
      studentData.projectUrls = [];

      const student = await this.studentRepository
        .createQueryBuilder('S')
        .select(['S.id', 'S.email'])
        .where('S.email = :email', { email: studentData.email })
        .getOne();

      let studentId: string | null = null;
      if (student) {
        await this.studentRepository
          .createQueryBuilder('S')
          .update()
          .set(studentCsvData)
          .where('id = :id', { id: student.id })
          .execute();
      } else {
        const newStudent = await this.studentRepository
          .createQueryBuilder('S')
          .insert()
          .values(studentData)
          .execute();
        studentId = newStudent.identifiers[0].id;
      }
      // @TODO option: Consider from this place, sending (registration) email with userId if studentId !== null
    }
  }

  async importStudentsCsv(
    file: MulterDiskUploadedFiles,
  ): Promise<{ success: true }> {
    // console.log(req);
    const csvFile = file?.csvFile?.[0] ?? null;
    try {
      if (!csvFile || csvFile.mimetype !== 'text/csv') {
        throw new NotAcceptableException('CSV file not found');
      }

      try {
        const filePath = path.join(
          storageDir(),
          'import-file',
          csvFile.filename,
        );
        const fileContent = await readFile(filePath, { encoding: 'utf8' });
        await this.handleStudentParsingAndSavingToDatabase(fileContent);
      } catch (err) {
        throw new InternalServerErrorException(
          `CSV file couldn't be read. ${err}`,
        );
      }
    } catch (e) {
      throw e;
    } finally {
      try {
        if (csvFile) {
          await unlink(
            path.join(storageDir(), 'import-file', csvFile.filename),
          );
        }
      } catch (e2) {
        throw new InternalServerErrorException("CSV file couldn't be removed");
      }
    }

    return {
      success: true,
    };
  }
}
