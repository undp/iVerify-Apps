
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.model';

@Entity()
export class Roles{
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @Column()
    description: string

    @Column()
    resource: string

    @Column()
    createdBy: string

    @Column()
    updatedBy: string

    @Column()
    @ManyToMany(type => User, user => user.roles)
    users: User[]
}

// @Schema({timestamps: true})
// export class Roles extends Document {

//     @Prop({ require: true})
//     name: string;

//     @Prop()
//     description: string;

//     @Prop({ require: true})
//     resource: string;

//     @Prop({ default: null})
//     createdBy: string;
  
//     @Prop({ default: null})
//     updatedBy: string;

    // @OneToMany('User', 'roles')
    // user: User[]
// }


// export const RolesSchema = SchemaFactory.createForClass(Roles);