import { expect } from 'chai';
import 'mocha';
import { RawItemTP } from './RawItemTP';

it('generate soldDate properly', () => {
  const soldDate = RawItemTP.getDateBySDATE('1080310');
  console.debug(soldDate.toISOString());
  expect(soldDate.getFullYear()).eq(2019);
  expect(soldDate.getMonth()).eq(2);
  expect(soldDate.getDate()).eq(10);
});
