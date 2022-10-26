import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TicketsBySource {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    source: string;

    @Column()
    tickets: number;

    // @JoinTable()
    // @ManyToMany(type => Roles, (roles) => roles.users, {cascade: true})
    // roles: Roles[]
}
