import { User } from '../../account/features/users/domain/user';
import { PaginatorInputType } from '../dto/input-models/paginator.input.type';
import { PaginatorViewModel } from '../dto/view-models/paginator.view.model';

export interface BaseControllerInterface<CreateDtoT, UpdateDtoT, ViewModelT> {
  create(createDto: CreateDtoT, user: User): Promise<ViewModelT>;
  findAll(
    user: User,
    paginatorParams: PaginatorInputType,
  ): Promise<PaginatorViewModel<ViewModelT>>;
  findOne(id: string): Promise<ViewModelT>;
  update(id: string, updateDto: UpdateDtoT): Promise<void>;
  remove(id: string): Promise<void>;
}
