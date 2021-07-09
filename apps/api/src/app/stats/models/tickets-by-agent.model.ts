import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TicketsByAgent{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    agent: string

    @Column()
    tickets: number

    

    // @JoinTable()
    // @ManyToMany(type => Roles, (roles) => roles.users, {cascade: true})
    // roles: Roles[]

}