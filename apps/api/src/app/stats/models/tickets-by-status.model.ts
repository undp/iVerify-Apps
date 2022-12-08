import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('status_ticket')
export class TicketsByStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @Column()
    tickets: number;

    // @JoinTable()
    // @ManyToMany(type => Roles, (roles) => roles.users, {cascade: true})
    // roles: Roles[]
}
