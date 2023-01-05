import { isEmpty } from 'radash';
import {
    Column,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Locations } from '../../locations/models/locations.model';
import { StatsDto } from '../dto/stats.dto';

@Entity('statistics')
export class Stats {
    private readonly lockedDtoFields = [];

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    locationId: string;

    @Column({ type: 'date' })
    day: string;

    @Column()
    countBy: string; // of CountBy enum

    @Column()
    category: string;

    @Column()
    count: number;

    @ManyToOne(() => Locations, (location) => location.stats, {
        nullable: false,
    })
    location: Location;

    toDto() {
        const dto = new StatsDto({ ...this });

        if (!isEmpty(this.lockedDtoFields)) {
            this.lockedDtoFields.forEach((field: string) => delete dto[field]);
        }

        return dto;
    }

    constructor(params?: Partial<Stats>) {
        Object.assign(this, params);
    }
}
