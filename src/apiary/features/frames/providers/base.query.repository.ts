export abstract class BaseQueryRepository {
  abstract doesIdExist(id: number): Promise<boolean>;

  abstract isOwner(userId: string, id: string): Promise<boolean>;
}
