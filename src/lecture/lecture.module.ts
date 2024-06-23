import { ILectureRepository } from "./domain/interface/repository/lecture.repository.interface";
import { CreateLectureUseCase } from "./usecase/create-lecture.usecase";
import { LectureRepository } from "./infrastructure/repository/lecture.repository";
import { Module } from "@nestjs/common";
import { LectureMapper } from "./domain/mapper/lecture.mapper";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LectureEntity } from "./infrastructure/entity/lecture.entity";
import { LectureController } from "./presentation/controller/lecutre.controller";

@Module({
  imports: [TypeOrmModule.forFeature([LectureEntity])],
  providers: [
    {
      provide: LectureRepository.name,
      useClass: LectureRepository,
    },
    {
      provide: CreateLectureUseCase.name,
      useClass: CreateLectureUseCase,
    },
    LectureMapper,
  ],
  controllers: [LectureController],
})
export class LectureModule {}
