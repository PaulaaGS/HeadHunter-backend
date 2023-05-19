import { Max, Min } from 'class-validator';
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../auth/auth.entity';
import { Student } from '../student/student.entity';

@Entity()
export class HR {
  @PrimaryColumn()
  @OneToOne(() => User, (user) => user.id)
  id: string;

  @Column({
    length: 60,
  })
  fullName: string;

  @Column({
    length: 175,
  })
  company: string;

  @Column({
    type: 'int',
  })
  @Min(1)
  @Max(999)
  maxReservedStudents: number;

  @OneToMany(() => Student, (student) => student.hr)
  students: Student[];
}
