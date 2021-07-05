import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TicketsByChannel{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    channel: string

    @Column()
    tickets: number

    

    // @JoinTable()
    // @ManyToMany(type => Roles, (roles) => roles.users, {cascade: true})
    // roles: Roles[]

}