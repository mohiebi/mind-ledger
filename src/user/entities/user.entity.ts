import { Task } from 'src/task/entities/task.entity';
import {
    Column,
    CreateDateColumn,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

export class User {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];
}
