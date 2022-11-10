import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../../roles/roles.model';
import { Stats } from '../../stats/models/stats.model';
import { User } from '../../users/user.model';
import { LocationDto } from '../dto/location.dto';
import { LocationsParam } from '../interfaces/location.params';

@Entity()
export class Locations {
    private readonly lockedDtoFields = [];

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column({ type: 'json', nullable: true })
    params: Array<LocationsParam>;

    @Column({ type: 'boolean' })
    deleted = false;

    // @OneToMany(() => User, (user) => user.)
    // users

    @OneToMany(() => Stats, (stats) => stats.location, {
        cascade: true,
    })
    stats: Array<Stats>;

    @OneToMany(() => User, (user) => user.location, {
        cascade: true,
    })
    users: Array<User>;

    @OneToMany(() => Roles, (role) => role.location, {
        cascade: true,
    })
    roles: Array<Roles>;

    constructor(params?: Partial<Locations>) {
        Object.assign(this, params);
    }

    toDto() {
        const dto = new LocationDto({ ...this });

        this.lockedDtoFields.forEach((field: string) => delete dto[field]);

        return dto;
    }
}
