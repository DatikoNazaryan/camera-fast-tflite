import _ from 'lodash';

export default function mergeUniqueLast(list1: any[], list2: any[], iteratee?: string | (() => any)): typeof list1 {
  return _.chain([...list1, ...list2])
    .reverse()
    .uniqBy(iteratee || 'id')
    .reverse()
    .value();
}
