import { PaginatorInputType } from '../dto/input-models/paginator.input.type';

export interface BaseQueryRepositoryInterface<DomainModelT, EntityT> {
  findEntityById(id: number): Promise<EntityT>;

  getAllDomainModels(paginatorParams: PaginatorInputType): Promise<{
    pageNumber: number;
    count: any;
    pageSize: number;
    breeds: DomainModelT[];
  }>;

  getDomainModel(id: string): Promise<DomainModelT>;

  doesIdExist(id: number): Promise<boolean>;

  isOwner(userId: string, id: string): Promise<boolean>;
}
