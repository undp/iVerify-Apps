import { Injectable, BadRequestException,NotFoundException, ConflictException } from '@nestjs/common';
import { InfoLogger } from '../logger/info-logger.service';
import { dbServiceMessages } from '../../constant/messages';
import { PaginationQueryDto } from '../users/dto/paginationQuery.dto';


@Injectable()
export class DatabaseService {
    constructor(private infoLogger: InfoLogger) {
        this.infoLogger.setContext('DatabseServices');
    }

    async create(model, dto) {
        try {
            const createObj = await new model(dto);
            return await createObj.save(createObj);
        } catch (e) {
            this.infoLogger.error("Error in create service: ", e);
            if (e.message.includes("E11000")) throw new ConflictException(dbServiceMessages.duplicateEntry);
            return false;
        }
    }

    async findOne(model, options) {
        return await model.findOne(options).exec();
    }

    async findByIdAndUpdate(model, ID: number, dto, relation = null) {
        try {
            const updateData = await model.findByIdAndUpdate(ID, dto);
            if (updateData) {
                return await model.findOne({ id: ID }).exec();
            } else {
                return false;
            }
        } catch (e) {
            throw new BadRequestException(dbServiceMessages.updateError)
        }
    }

    async findByIdAndRemove(model, ID: number) {
        const findObj = await model.findOne({ id: ID }).exec();
        if (findObj) {
            try {
                return await model.findByIdAndRemove(ID);
            } catch (e) {
                throw new BadRequestException(dbServiceMessages.deleteError);
            }
        } else {
            throw new NotFoundException(dbServiceMessages.invalidRecordForDelete);
        }
    }


    async findAll(model, options) {
        return await model.find(options).exec();
    }


    public async paginate(model, paginationQuery: PaginationQueryDto) {
        const { limit, offset } = paginationQuery;
        console.log(limit)
        console.log(offset)
        try {
            return await model.find()
                .skip(Number(offset))
                .limit(Number(limit))
                .exec();
        } catch (e) {
            this.infoLogger.error("Error in paginate service: ", e);
            throw new BadRequestException(dbServiceMessages.pageDataError)
        }
    }
}