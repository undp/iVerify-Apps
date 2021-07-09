import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TicketsByStatus{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    status: string

    @Column()
    tickets: number

    

    // @JoinTable()
    // @ManyToMany(type => Roles, (roles) => roles.users, {cascade: true})
    // roles: Roles[]

}