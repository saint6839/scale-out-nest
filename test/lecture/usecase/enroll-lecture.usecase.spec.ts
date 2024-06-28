import { Test, TestingModule } from "@nestjs/testing";
import {
  CAPACITY_EXCEPTION_MESSAGE,
  LectureDetail,
} from "src/lecture/domain/entity/lecture-detail";
import { LockMode } from "src/lecture/domain/enum/lock-mode.enum";
import { LectureDetailMapper } from "src/lecture/domain/mapper/lecture-detail.mapper";
import { LectureMapper } from "src/lecture/domain/mapper/lecture.mapper";
import { LectureDetailEntity } from "src/lecture/infrastructure/entity/lecture-detail.entity";
import { LectureEnrollmentHistoryEntity } from "src/lecture/infrastructure/entity/lecture-enrollment-history.entity";
import { LectureDetailRepository } from "src/lecture/infrastructure/repository/lecture-detail.repository";
import { LectureEnrollmentHistoryRepository } from "src/lecture/infrastructure/repository/lecture-enrollment-history.repository";
import { LectureRepository } from "src/lecture/infrastructure/repository/lecture.repository";
import { EnrollLectureDto } from "src/lecture/presentation/dto/request/enroll-lecture.dto";
import {
  ALREADY_ENROLLED_LECTURE_EXCEPTION_MESSAGE,
  EnrollLectureUseCase,
  NOT_EXIST_LECTURE_DETAIL_EXCEPTION_MESSAGE,
} from "src/lecture/usecase/enroll-lecture.usecase";
import { DataSource, EntityManager } from "typeorm";

describe("EnrollLectureUseCase", () => {
  let enrollLectureUseCase: EnrollLectureUseCase;
  let lectureRepositoryMock: jest.Mocked<LectureRepository>;
  let lectureEnrollmentHistoryRepositoryMock: jest.Mocked<LectureEnrollmentHistoryRepository>;
  let lectureDetailRepositoryMock: jest.Mocked<LectureDetailRepository>;
  let lectureMapperMock: jest.Mocked<LectureMapper>;
  let lectureDetailMapperMock: jest.Mocked<LectureDetailMapper>;
  let dataSourceMock: jest.Mocked<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollLectureUseCase,
        {
          provide: LectureRepository.name,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: LectureEnrollmentHistoryRepository.name,
          useValue: {
            findByLectureDetailIdAndUserId: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: LectureDetailRepository.name,
          useValue: {
            findByIdWithLock: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: LectureMapper,
          useValue: {
            toDomainFromEntity: jest.fn(),
          },
        },
        {
          provide: LectureDetailMapper,
          useValue: {
            toDomainFromEntity: jest.fn(),
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

    enrollLectureUseCase =
      module.get<EnrollLectureUseCase>(EnrollLectureUseCase);
    lectureRepositoryMock = module.get(LectureRepository.name);
    lectureEnrollmentHistoryRepositoryMock = module.get(
      LectureEnrollmentHistoryRepository.name
    );
    lectureDetailRepositoryMock = module.get(LectureDetailRepository.name);
    lectureMapperMock = module.get(LectureMapper);
    lectureDetailMapperMock = module.get(LectureDetailMapper);
    dataSourceMock = module.get(DataSource);
  });

  describe("비관적락 동시 수강 신청시 테스트", () => {
    it("동시에 여러 강의에 대한 수강 신청이 들어올 때 각 강의의 수강 인원이 올바르게 증가하는지 테스트", async () => {
      // given
      const numberOfLectures = 3;
      const capacityPerLecture = 5;
      const initialEnrollment = 2;
      const numberOfConcurrentRequests = 10;

      const lectureDetails = Array(numberOfLectures)
        .fill(null)
        .map((_, index) => ({
          id: index + 1,
          lectureId: index + 1,
          enrollAt: new Date(),
          lectureAt: new Date(),
          capacity: capacityPerLecture,
          currentEnrollment: initialEnrollment,
        }));

      const enrollmentCounts = new Array(numberOfLectures).fill(
        initialEnrollment
      );

      lectureDetailRepositoryMock.findByIdWithLock.mockImplementation((id) => {
        return Promise.resolve({
          ...lectureDetails[id - 1],
          currentEnrollment: enrollmentCounts[id - 1],
        });
      });

      lectureDetailMapperMock.toDomainFromEntity.mockImplementation(
        (entity) => {
          return new LectureDetail(
            entity.id,
            entity.lectureId,
            entity.enrollAt,
            entity.lectureAt,
            entity.capacity,
            entity.currentEnrollment
          );
        }
      );

      lectureEnrollmentHistoryRepositoryMock.findByLectureDetailIdAndUserId.mockResolvedValue(
        null
      );

      lectureDetailRepositoryMock.update.mockImplementation((lectureDetail) => {
        enrollmentCounts[lectureDetail.id - 1] =
          lectureDetail.currentEnrollment;
        return Promise.resolve({} as LectureDetailEntity);
      });

      dataSourceMock.transaction.mockImplementation(
        jest.fn().mockImplementation((cb) => cb({} as EntityManager))
      );

      // when
      const enrollmentPromises = Array(numberOfConcurrentRequests)
        .fill(null)
        .map(async (_, index) => {
          const lectureId = (index % numberOfLectures) + 1;
          const userId = index + 1;
          try {
            await enrollLectureUseCase.execute(
              new EnrollLectureDto(lectureId, userId)
            );
          } catch (error) {
            // 수강 신청 실패
          }
        });

      await Promise.all(enrollmentPromises);

      // then
      enrollmentCounts.forEach((count, index) => {
        expect(count).toBeLessThanOrEqual(capacityPerLecture);
        expect(count).toBeGreaterThan(initialEnrollment);
      });
    });

    it("정원 이상의 사용자가 동시에 수강신청을 하였을때, 정원에 해당하는 숫자 만큼만 수강 신청에 성공하는지 테스트", async () => {
      // given
      const capacity = 10;
      const currentEnrollment = 5;
      const numberOfConcurrentRequests = 10;
      const lectureDetailEntity = {
        id: 1,
        lectureId: 1,
        enrollAt: new Date(),
        lectureAt: new Date(),
        capacity: capacity,
        currentEnrollment: currentEnrollment,
      };

      let enrollmentCount = currentEnrollment;
      let successCount = 0;

      lectureDetailRepositoryMock.findByIdWithLock.mockImplementation(() => {
        return Promise.resolve({
          ...lectureDetailEntity,
          currentEnrollment: enrollmentCount,
        });
      });

      lectureDetailMapperMock.toDomainFromEntity.mockImplementation(
        (entity) => {
          return new LectureDetail(
            entity.id,
            entity.lectureId,
            entity.enrollAt,
            entity.lectureAt,
            entity.capacity,
            entity.currentEnrollment
          );
        }
      );

      lectureEnrollmentHistoryRepositoryMock.findByLectureDetailIdAndUserId.mockResolvedValue(
        null
      );

      lectureDetailRepositoryMock.update.mockImplementation((lectureDetail) => {
        if (enrollmentCount < capacity) {
          enrollmentCount++;
          return Promise.resolve({} as LectureDetailEntity);
        } else {
          return Promise.reject(new Error(CAPACITY_EXCEPTION_MESSAGE));
        }
      });

      dataSourceMock.transaction.mockImplementation(
        jest.fn().mockImplementation((cb) => cb({} as EntityManager))
      );

      // when
      const enrollmentPromises = Array(numberOfConcurrentRequests)
        .fill(null)
        .map(async (_, index) => {
          try {
            await enrollLectureUseCase.execute(
              new EnrollLectureDto(1, index + 1)
            );
            successCount++;
          } catch (error) {
            // 수강 신청 실패
          }
        });

      await Promise.all(enrollmentPromises);

      // then
      expect(successCount).toBe(capacity - currentEnrollment);
      expect(enrollmentCount).toBe(capacity);
    });
  });

  describe("수강 신청 테스트", () => {
    it("수강 신청 성공 테스트", async () => {
      // given
      const dto = new EnrollLectureDto(1, 1);
      const lectureDetailEntity = {
        id: 1,
        lectureId: 1,
        enrollAt: new Date(),
        lectureAt: new Date(),
        capacity: 10,
        currentEnrollment: 5,
      };
      const lectureDetail = new LectureDetail(
        1,
        1,
        new Date(),
        new Date(),
        10,
        5
      );

      lectureDetailRepositoryMock.findByIdWithLock.mockResolvedValue(
        lectureDetailEntity
      );
      lectureDetailMapperMock.toDomainFromEntity.mockReturnValue(lectureDetail);
      lectureEnrollmentHistoryRepositoryMock.findByLectureDetailIdAndUserId.mockResolvedValue(
        null
      );
      dataSourceMock.transaction.mockImplementation(
        jest.fn().mockImplementation((cb) => cb({} as EntityManager))
      );

      // when
      await enrollLectureUseCase.execute(dto);

      // then
      expect(lectureDetailRepositoryMock.findByIdWithLock).toHaveBeenCalledWith(
        dto.lectureDetailId,
        expect.any(Object),
        LockMode.PESSIMISTIC_WRITE
      );
      expect(
        lectureEnrollmentHistoryRepositoryMock.findByLectureDetailIdAndUserId
      ).toHaveBeenCalledWith(
        lectureDetail.lectureId,
        dto.userId,
        expect.any(Object)
      );
      expect(lectureEnrollmentHistoryRepositoryMock.create).toHaveBeenCalled();
      expect(lectureDetailRepositoryMock.update).toHaveBeenCalled();
    });

    it("존재하지 않는 강의 상세 정보로 수강 신청 시 예외 발생 테스트", async () => {
      // given
      const dto = new EnrollLectureDto(1, 1);
      lectureDetailRepositoryMock.findByIdWithLock.mockResolvedValue(null);
      dataSourceMock.transaction.mockImplementation(
        jest.fn().mockImplementation((cb) => cb({} as EntityManager))
      );

      // when & then
      await expect(enrollLectureUseCase.execute(dto)).rejects.toThrow(
        NOT_EXIST_LECTURE_DETAIL_EXCEPTION_MESSAGE
      );
    });

    it("이미 수강 신청한 강의에 대해 중복 신청 시 예외 발생 테스트", async () => {
      // given
      const dto = new EnrollLectureDto(1, 1);
      const lectureDetailEntity = {
        id: 1,
        lectureId: 1,
        enrollAt: new Date(),
        lectureAt: new Date(),
        capacity: 10,
        currentEnrollment: 5,
      };
      const lectureDetail = new LectureDetail(
        1,
        1,
        new Date(),
        new Date(),
        10,
        5
      );

      lectureDetailRepositoryMock.findByIdWithLock.mockResolvedValue(
        lectureDetailEntity
      );
      lectureDetailMapperMock.toDomainFromEntity.mockReturnValue(lectureDetail);
      lectureEnrollmentHistoryRepositoryMock.findByLectureDetailIdAndUserId.mockResolvedValue(
        {} as LectureEnrollmentHistoryEntity
      );
      dataSourceMock.transaction.mockImplementation(
        jest.fn().mockImplementation((cb) => cb({} as EntityManager))
      );

      // when & then
      await expect(enrollLectureUseCase.execute(dto)).rejects.toThrow(
        ALREADY_ENROLLED_LECTURE_EXCEPTION_MESSAGE
      );
    });

    it("수강 신청 시작 시간 이전에 신청 시 예외 발생 테스트", async () => {
      // given
      const dto = new EnrollLectureDto(1, 1);
      const futureDate = new Date(Date.now() + 1000 * 60 * 60);
      const lectureDetailEntity = {
        id: 1,
        lectureId: 1,
        enrollAt: futureDate,
        lectureAt: futureDate,
        capacity: 10,
        currentEnrollment: 5,
      };
      const lectureDetail = new LectureDetail(
        1,
        1,
        futureDate,
        futureDate,
        10,
        5
      );

      lectureDetailRepositoryMock.findByIdWithLock.mockResolvedValue(
        lectureDetailEntity
      );
      lectureDetailMapperMock.toDomainFromEntity.mockReturnValue(lectureDetail);
      dataSourceMock.transaction.mockImplementation(
        jest.fn().mockImplementation((cb) => cb({} as EntityManager))
      );

      // when & then
      await expect(enrollLectureUseCase.execute(dto)).rejects.toThrow(
        "수강 신청 시간이 아닙니다."
      );
    });

    it("수강 신청 인원 초과 시 예외 발생 테스트", async () => {
      // given
      const dto = new EnrollLectureDto(1, 1);
      const lectureDetailEntity = {
        id: 1,
        lectureId: 1,
        enrollAt: new Date(),
        lectureAt: new Date(),
        capacity: 10,
        currentEnrollment: 10,
      };
      const lectureDetail = new LectureDetail(
        1,
        1,
        new Date(),
        new Date(),
        10,
        10
      );

      lectureDetailRepositoryMock.findByIdWithLock.mockResolvedValue(
        lectureDetailEntity
      );
      lectureDetailMapperMock.toDomainFromEntity.mockReturnValue(lectureDetail);
      dataSourceMock.transaction.mockImplementation(
        jest.fn().mockImplementation((cb) => cb({} as EntityManager))
      );

      // when & then
      await expect(enrollLectureUseCase.execute(dto)).rejects.toThrow(
        CAPACITY_EXCEPTION_MESSAGE
      );
    });

    it("수강 신청 시 트랜잭션 에러 발생 시 예외 발생 테스트", async () => {
      // given
      const dto = new EnrollLectureDto(1, 1);
      const lectureDetailEntity = {
        id: 1,
        lectureId: 1,
        enrollAt: new Date(),
        lectureAt: new Date(),
        capacity: 10,
        currentEnrollment: 5,
      };
      const lectureDetail = new LectureDetail(
        1,
        1,
        new Date(),
        new Date(),
        10,
        5
      );

      lectureDetailRepositoryMock.findByIdWithLock.mockResolvedValue(
        lectureDetailEntity
      );
      lectureDetailMapperMock.toDomainFromEntity.mockReturnValue(lectureDetail);
      dataSourceMock.transaction.mockImplementation(
        jest.fn().mockImplementation(() => {
          throw new Error();
        })
      );

      // when & then
      await expect(enrollLectureUseCase.execute(dto)).rejects.toThrow();
    });
  });
});
