import {
  instanceToPlain,
  plainToClass,
  ClassConstructor,
} from 'class-transformer';

type SHelperType<V, T> = V extends Array<any> ? Array<T> : T;

export function SerializeDto<T, V>(
  cls: ClassConstructor<T>,
  data: V,
): SHelperType<V, T> {
  const plainData = instanceToPlain(data);
  return plainToClass(cls, plainData) as SHelperType<V, T>;
}
