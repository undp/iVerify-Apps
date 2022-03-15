import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    meedanId: number

    @Column({type: 'date', nullable: true})
    creationDate: string

    @Column()
    wpId: number

    @Column()
    toxicFlag: boolean

    @Column()
    title: string 

    @Column()
    content: string

    @Column()
    wpUrl: string

    @Column({type: 'date'})
    publishDate: string

    @Column()
    tags: string

    @Column()
    threatLevel: string

    @Column()
    violationType: string

    @Column()
    claim: string

    @Column()
    justification: string

    @Column()
    evidence: string

    @Column()
    misinfoType: string

    @Column()
    hateSpeechType: string

    @Column()
    toxicScore: number

    @Column()
    obsceneScore: number

    @Column()
    identityScore: number

    @Column()
    threatScore: number

    @Column()
    explicitScore: number

    @Column()
    dToxicScore: number

    @Column()
    dObsceneScore: number

    @Column()
    dIdentityScore: number

    @Column()
    dThreatScore: number

    @Column()
    dExplicitScore: number

    @Column()
    dInsultScore: number

    @Column()
    sourceName: string

    @Column()
    sourceUrl: string

    @Column()
    notes: string

}