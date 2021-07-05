

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CountBy } from './count-by.enum';

@Entity()
export class Stats{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    startDate: Date

    @Column()
    endDate: Date

    @Column()
    countBy: string // of CountBy enum

    @Column()
    category: string

    @Column()
    count: number
}