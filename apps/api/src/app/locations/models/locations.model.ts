import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../roles/roles.model";
import { Stats } from "../../stats/models/stats.model";
import { User } from "../../users/user.model";

@Entity()
export class Locations {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column({ type: 'json' })
    params: Record<string, unknown>;

    @Column()
    deleted = false;

    // @OneToMany(() => User, (user) => user.)
    // users

    @OneToMany(() => Stats, (stats) => stats.location, {
        cascade: true
    })
    stats: Array<Stats>;

    @OneToMany(() => User, (user) => user.location, {
        cascade: true
    })
    users: Array<User>;

    @OneToMany(() => Roles, (role) => role.location, {
        cascade: true
    })
    roles: Array<Roles>;



    constructor(params?: Partial<Locations>) {
        Object.assign(this, params);
    }
}