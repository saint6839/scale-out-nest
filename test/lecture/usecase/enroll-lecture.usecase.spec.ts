import { Test, TestingModule } from "@nestjs/testing";
import { Lecture } from "src/lecture/domain/entity/lecture";
import { LectureEnrollmentHistory } from "src/lecture/domain/entity/lecture-enrollment-history";
import { LectureMapper } from "src/lecture/domain/mapper/lecture.mapper";
import { LectureEntity } from "src/lecture/infrastructure/entity/lecture.entity";
import { LectureEnrollmentHistoryRepository } from "src/lecture/infrastructure/repository/lecture-enrollment-history.repository";
import { LectureRepository } from "src/lecture/infrastructure/repository/lecture.repository";
import { EnrollLectureDto } from "src/lecture/presentation/dto/request/enroll-lecture.dto";
import {
  ALREADY_ENROLLED_LECTURE_EXCEPTION_MESSAGE,
  EnrollLectureUseCase,
  NOT_EXIST_LECTURE_EXCEPTION_MESSAGE,
} from "src/lecture/usecase/enroll-lecture.usecase";
import { DataSource, EntityManager } from "typeorm";

describe("EnrollLectureUseCase", () => {
  let useCase: EnrollLectureUseCase;
  let lectureRepositoryMock: jest.Mocked<LectureRepository>;
  let lectureEnrollmentHistoryRepositoryMock: jest.Mocked<LectureEnrollmentHistoryRepository>;
  let lectureMapperMock: jest.Mocked<LectureMapper>;
  let dataSourceMock: jest.Mocked<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollLectureUseCase,
        {
          provide: LectureRepository.name,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: LectureEnrollmentHistoryRepository.name,
          useValue: {
            findByLectureIdAndUserId: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: LectureMapper,
          useValue: {
            toDomainFromEntity: jest.fn(),
            toDtoFromDomain: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<EnrollLectureUseCase>(EnrollLectureUseCase);
    lectureRepositoryMock = module.get(LectureRepository.name);
    lectureEnrollmentHistoryRepositoryMock = module.get(
      LectureEnrollmentHistoryRepository.name
    );
    lectureMapperMock = module.get(LectureMapper);
    dataSourceMock = module.get(DataSource);
  });
  describe("동시 수강 신청", () => {
    it("여러 사람이 동시에 수강 신청을 할 때 가용 인원 수만큼만 신청에 성공하는지, 가용 인원 초과 요청건들은 실패하는지 테스트", async () => {
      // given
      const lectureId = 1;
      const capacity = 3;
      const totalAttempts = 5;
      const lectureEntity = { id: lectureId, capacity } as LectureEntity;
      const lecture = new Lecture(
        0,
        lectureId,
        "강의명",
        new Date(),
        capacity,
        0
      );

      lectureRepositoryMock.findById.mockResolvedValue(lectureEntity);
      lectureEnrollmentHistoryRepositoryMock.findByLectureIdAndUserId.mockResolvedValue(
        null
      );
      lectureMapperMock.toDomainFromEntity.mockReturnValue(lecture);
      lectureRepositoryMock.update.mockImplementation((updatedLecture) => {
        return Promise.resolve({
          ...lectureEntity,
          currentEnrollment: updatedLecture.currentEnrollment,
        } as LectureEntity);
      });

      dataSourceMock.transaction.mockImplementation(
        jest.fn().mockImplementation((cb) => cb({} as EntityManager))
      );

      // when
      const enrollmentPromises = Array.from(
        { length: totalAttempts },
        (_, index) =>
          useCase.execute(new EnrollLectureDto(index + 1, lectureId))
      );

      // then
      const results = await Promise.allSettled(enrollmentPromises);
      const successfulEnrollments = results.filter(
        (result) => result.status === "fulfilled"
      );
      const failedEnrollments = results.filter(
        (result) => result.status === "rejected"
      );

      expect(successfulEnrollments.length).toBe(capacity);
      expect(failedEnrollments.length).toBe(totalAttempts - capacity);
      failedEnrollments.forEach((result) => {
        expect(result.status).toBe("rejected");
      });
    });
  });

  describe("수강 신청", () => {
    it("강의가 존재하고 수강 신청이 성공하면 강의 정보를 반환한다", async () => {
      // given
      const lectureId = 1;
      const userId = 1;
      const dto = new EnrollLectureDto(userId, lectureId);
      const lectureEntity = { id: lectureId } as LectureEntity;
      const lecture = new Lecture(0, lectureId, "강의명", new Date(), 30, 0);
      const updatedLecture = new Lecture(
        0,
        lectureId,
        "강의명",
        new Date(),
        30,
        1
      );
      const updatedLectureEntity = {
        id: lectureId,
        currentEnrollment: 1,
      } as LectureEntity;

      lectureRepositoryMock.findById.mockResolvedValue(lectureEntity);
      lectureEnrollmentHistoryRepositoryMock.findByLectureIdAndUserId.mockResolvedValue(
        null
      );
      lectureMapperMock.toDomainFromEntity
        .mockReturnValueOnce(lecture)
        .mockReturnValueOnce(updatedLecture);
      lectureRepositoryMock.update.mockResolvedValue(updatedLectureEntity);
      dataSourceMock.transaction.mockImplementation(
        jest.fn().mockImplementation((cb) => cb({} as EntityManager))
      );

      // when
      await useCase.execute(dto);

      // then
      expect(lectureRepositoryMock.findById).toHaveBeenCalledWith(
        lectureId,
        expect.any(Object)
      );
      expect(
        lectureEnrollmentHistoryRepositoryMock.findByLectureIdAndUserId
      ).toHaveBeenCalledWith(lectureId, userId, expect.any(Object));
      expect(lectureEnrollmentHistoryRepositoryMock.create).toHaveBeenCalled();
      expect(lectureRepositoryMock.update).toHaveBeenCalled();
      expect(lectureMapperMock.toDtoFromDomain).toHaveBeenCalledWith(
        updatedLecture
      );
    });

    it("강의가 존재하지 않으면 예외를 던진다", async () => {
      // given
      const dto = new EnrollLectureDto(1, 1);
      lectureRepositoryMock.findById.mockResolvedValue(null);
      dataSourceMock.transaction.mockImplementation(
        jest.fn().mockImplementation((cb) => cb({} as EntityManager))
      );

      // when & then
      await expect(useCase.execute(dto)).rejects.toThrow(
        NOT_EXIST_LECTURE_EXCEPTION_MESSAGE
      );
    });

    it("이미 수강 신청한 강의면 예외를 던진다", async () => {
      // given
      const dto = new EnrollLectureDto(1, 1);
      const lectureEntity = { id: 1 } as LectureEntity;
      lectureRepositoryMock.findById.mockResolvedValue(lectureEntity);
      lectureEnrollmentHistoryRepositoryMock.findByLectureIdAndUserId.mockResolvedValue(
        {} as LectureEnrollmentHistory
      );
      dataSourceMock.transaction.mockImplementation(
        jest.fn().mockImplementation((cb) => cb({} as EntityManager))
      );
      // when & then
      await expect(useCase.execute(dto)).rejects.toThrow(
        ALREADY_ENROLLED_LECTURE_EXCEPTION_MESSAGE
      );
    });
  });
});
