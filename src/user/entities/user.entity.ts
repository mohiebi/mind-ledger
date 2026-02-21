import { Expose } from 'class-transformer';
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Task } from 'src/task/entities/task.entity';
import { Category } from 'src/finance/entities/category.entity';
import { Transaction } from 'src/finance/entities/transaction.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    id: string;

    @Column()
    @Expose()
    name: string;

    @Column({ unique: true })
    @Expose()
    email: string;

    @Column()
    password: string;

    @CreateDateColumn({ name: 'created_at' })
    @Expose()
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    @Expose()
    updatedAt: Date;

    /**
     * Relations
     */

    @OneToMany(() => Task, (task) => task.user, { cascade: true })
    @Expose()
    tasks: Task[];

    @OneToMany(() => Category, (category) => category.user, { cascade: true })
    @Expose()
    categories: Category[];

    @OneToMany(() => Transaction, (transaction) => transaction.user, {
        cascade: true,
    })
    transactions: Transaction[];
}
