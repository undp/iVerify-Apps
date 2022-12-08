import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Locations } from '../locations/models/locations.model';
import { User } from '../users/user.model';
import { RolesDto } from './dto/role.dto';

@Entity('profiles')
export class Roles {
    private readonly lockedDtoFields = ['location', 'users', 'uniqueParam'];

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ nullable: false })
    locationId: string;

    @Column({})
    name: string;

    @Column()
    description: string;

    @Column()
    resource: string;

    @Column({ unique: true, nullable: true })
    uniqueParam: string;

    @Column()
    createdBy: string;

    @Column()
    updatedBy: string;

    @JoinTable()
    @ManyToMany(() => User, (user) => user.roles)
    users: User[];

    @ManyToOne(() => Locations, (location) => location.roles, {
        nullable: false,
    })
    location: Location;

    @BeforeInsert()
    prepareUniqFieldParam() {
        this.uniqueParam = `${this.locationId}|${this.name}`;
    }

    toDto() {
        const dto = new RolesDto({ ...this });

        this.lockedDtoFields.forEach((field: string) => delete dto[field]);

        return dto;
    }
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
