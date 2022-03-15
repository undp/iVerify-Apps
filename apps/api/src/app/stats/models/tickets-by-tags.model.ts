import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TicketsByTag{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    tag: string

    @Column()
    tickets: number

    

    // @JoinTable()
    // @ManyToMany(type => Roles, (roles) => roles.users, {cascade: true})
    // roles: Roles[]

}