import { ExpectedContractType } from '../enums/expected-contract-type';
import { ExpectedTypeWork } from '../enums/expected-type-work';

export interface Student {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  githubUsername: string;
  portfolioUrls: string[];
  projectUrls: string[];
  bio: string;
  expectedTypeWork: ExpectedTypeWork;
  targetWorkCity: string;
  expectedContractType: ExpectedContractType;
  expectedSalary: string;
  canTakeApprenticeship: boolean;
  monthsOfCommercialExp: number;
  education: string;
  workExperience: string;
  courses: string;
  courseCompletion: number;
  courseEngagment: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string[];
}

export type GetListOfStudentsResponse = Student[];

export type GetOneStudentResponse = Student;

export type CreateStudentResponse = Student;

export type UpdateStudentResponse = Student;
