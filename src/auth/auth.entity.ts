import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 60,
    })
    email: string;

    @Column()
    pwdHash: string;

    @Column({
        nullable: true,
        default: null,
    })
    accessToken: string | null;

    @Column({
        nullable: true,
        default: null,
    })
    role: string | null;

}