import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop()
    firstName: string;

    @Prop({ unique: true })
    lastName: string;

    @Prop({ unique: true })
    email: string;

    @Prop()
    phone: string;

    @Prop()
    address: string;

    @Prop({ require: true, select: false })
    public password: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
