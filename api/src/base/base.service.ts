

import { Repository } from "typeorm";
import { Base } from "./base.entity";



export class BaseService {
    constructor(protected repository: Repository<Base>) {}

    handleFind(query, condition= {active: true}){
        query.where(condition)
        return query
    }

    handleSelect(){
        return this.repository.createQueryBuilder()
    }

    handleOrder(query){
        return query.orderBy("id", "DESC")
    }

    getList(){
        let query = this.handleSelect()
        query= this.handleFind(query)
        query= this.handleOrder(query)
        return query.getRawMany()
    }
    create(data) {
        this.repository
            .createQueryBuilder()
            .insert()
            .values(data).execute()
        return data
    }

    updateOne(id, data) {
        this.repository
            .createQueryBuilder()
            .update()
            .set(data)
            .where("id = :id", { id })
            .execute()

        return data
    }

    softDelete(id) {
        return this.updateOne(id, {active: false})
    }
}
