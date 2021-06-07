import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({timestamps: true})
export class Roles extends Document {

    @Prop({ require: true})
    name: string;

    @Prop()
    description: string;

    @Prop({ require: true})
    resource: string;

    @Prop({ default: null})
    createdBy: string;
  
    @Prop({ default: null})
    updatedBy: string;

    // @OneToMany('User', 'roles')
    // user: User[]
}


export const RolesSchema = SchemaFactory.createForClass(Roles);