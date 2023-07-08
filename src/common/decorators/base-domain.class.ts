export abstract class BaseDomain {
  id: string;
  createdAt: Date;
  protected constructor() {
    this.createdAt = new Date();
  }
}
