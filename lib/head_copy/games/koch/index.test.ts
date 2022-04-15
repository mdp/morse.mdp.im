import { inclusiveSet, newestThreeSet } from ".";

test('abcdefg', () => {
  expect(newestThreeSet('abcdefgh'.split(''))).toEqual(
    [
        'abc'.split(''),
        'bcd'.split(''),
        'cde'.split(''),
        'def'.split(''),
        'efg'.split(''),
        'fgh'.split(''),
    ]
  );
  expect(inclusiveSet('abcdefgh'.split(''))).toEqual(
    [
        'abc'.split(''),
        'abcd'.split(''),
        'abcde'.split(''),
        'abcdef'.split(''),
        'abcdefg'.split(''),
        'abcdefgh'.split(''),
    ]
  );
  expect(newestThreeSet(['a', 'b', '<BT>', '-'])).toEqual(
    [
        ['a', 'b', '<BT>'],
        ['b', '<BT>', '-'],
    ]
  );
});