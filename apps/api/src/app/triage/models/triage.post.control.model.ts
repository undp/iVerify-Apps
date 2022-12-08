import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { TriageControlStatuses } from '../enum/triage.control.statuses.enum';

@Entity('triage-posts-control')
export class TriagePostControl {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: TriageControlStatuses,
        default: TriageControlStatuses.IDLE,
        nullable: true,
    })
    status: string;

    @Column({ nullable: true, default: 0 })
    failedCount: number;

    @Column({ type: 'json', nullable: true })
    failResult: any;

    @Column({ type: 'json', nullable: false })
    post: any;

    @Column()
    listId: string;

    @Column({ nullable: false })
    locationId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
