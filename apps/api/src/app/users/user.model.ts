import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document, Mongoose, Types , Schema as mongooseSchema} from 'mongoose';
import { Roles } from '../roles/roles.model';


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

    @Prop({ type: mongooseSchema.Types.ObjectId, ref: Roles.name})
    roles : mongooseSchema.Types.ObjectId;

}

export const UserSchema = SchemaFactory.createForClass(User);
