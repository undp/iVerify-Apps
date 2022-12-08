import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('channels_tickets')
export class TicketsByChannel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    channel: string;

    @Column()
    tickets: number;

    // @JoinTable()
    // @ManyToMany(type => Roles, (roles) => roles.users, {cascade: true})
    // roles: Roles[]
}
