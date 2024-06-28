import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository } from "src/user/domain/interface/repository/user.repository.interface";
import { IUserValidator } from "src/user/domain/interface/service/user.validator.interface";

@Injectable()
export class UserValidatorService implements IUserValidator {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository
  ) {}

  async validateUserExists(userId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("사용자가 존재하지 않습니다.");
    }
  }
}
