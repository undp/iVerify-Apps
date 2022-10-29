import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Locations } from '../../locations/models/locations.model';

@Entity()
export class Stats {
    @PrimaryGeneratedColumn()
    id: number;

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
}
