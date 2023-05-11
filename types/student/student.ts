import { ExpectedTypeWork } from '../../src/enums/expected-type-work';
import { ExpectedContractType } from '../../src/enums/expected-contract-type';
import { Student as StudentEntity } from '../../src/student/student.entity';

export interface GetOneStudentResponse {
  id: string;
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  expectedTypeWork: ExpectedTypeWork;
  targetWorkCity: string;
  expectedContractType: ExpectedContractType;
  expectedSalary: string;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
}

export type Student = StudentEntity;

export interface AvailableStudent {
  id: string;
  name: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  expectedTypeWork: ExpectedTypeWork;
  targetWorkCity: string;
  expectedContractType: ExpectedContractType;
  expectedSalary: string;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
}
