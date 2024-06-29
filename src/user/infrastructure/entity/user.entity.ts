import { from } from "rxjs";
import { User } from "src/user/domain/entity/user";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  static fromDomain(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    return entity;
  }
}
