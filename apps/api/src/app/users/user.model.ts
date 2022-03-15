
import { Roles } from '../roles/roles.model';

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    phone: string

    @Column()
    address: string

    @Column()
    password: string

    @Column({default: null})
    createdBy: string

    @JoinTable()
    @ManyToMany(type => Roles, (roles) => roles.users, {cascade: true})
    roles: Roles[]

}
// @Schema({timestamps: true})
// export class User extends Document {
//     @Prop({ require: true})
//     firstName: string;

//     @Prop({ default: null})
//     lastName: string;

//     @Prop({ unique: true })
//     email: string;

//     @Prop({ default: null})
//     phone: string;

//     @Prop({ default: null})
//     address: string;

//     @Prop({ require: true, select: false })
//     public password: string;

//     @Prop({ default: null})
//     createdBy: string;
  
//     @Prop({ default: null})
//     updatedBy: string;

//     @Prop({ type: mongooseSchema.Types.ObjectId, ref: Roles.name})
//     roles : mongooseSchema.Types.ObjectId;

// }

// export const UserSchema = SchemaFactory.createForClass(User);
