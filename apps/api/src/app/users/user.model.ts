import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({timestamps: true})
export class User extends Document {
    @Prop({ require: true})
    firstName: string;

    @Prop({ default: null})
    lastName: string;

    @Prop({ unique: true })
    email: string;

    @Prop({ default: null})
    phone: string;

    @Prop({ default: null})
    address: string;

    @Prop({ require: true, select: false })
    public password: string;

    @Prop({ default: null})
    createdBy: string;
  
    @Prop({ default: null})
    updatedBy: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
