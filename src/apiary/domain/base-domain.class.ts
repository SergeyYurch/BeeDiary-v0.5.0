export abstract class BaseDomain {
  id: number;
  createdAt: Date;
  protected constructor() {
    this.createdAt = new Date();
  }
}
