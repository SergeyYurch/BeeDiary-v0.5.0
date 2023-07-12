export abstract class BaseDomain {
  id: string;
  createdAt: Date;
  constructor() {
    this.createdAt = new Date();
  }
}
