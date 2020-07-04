import { test } from 'tape';
import subject from '@/lib/subject';

const mutableSubscriber = (t, value1, value2) => {
  let expected = value1;
  return (v) => {
    t.equal(v, expected);
    expected = value2;
  };
};

test('subject.subscribe triggers subscriber function', (t) => {
  const value = 'foo';
  subject(value).subscribe((v) => t.equal(v, value));
  t.end();
});

test('subject.next triggers subscriber function', (t) => {
  const [value1, value2] = ['foo', 'bar'];
  const testSubject = subject(value1);
  testSubject.subscribe(mutableSubscriber(t, value1, value2));
  testSubject.subscribe(mutableSubscriber(t, value1, value2));
  testSubject.next((value) => {
    t.equal(value, value1);
    return value2;
  });
  t.end();
});

test('subject.unsubscribe deregisters subscriber', (t) => {
  const [value1, value2] = ['foo', 'bar'];
  const testSubject = subject(value1);
  testSubject.subscribe(mutableSubscriber(t, value1, value2));
  const key = testSubject.subscribe((v) => t.equal(v, value1));
  testSubject.unsubscribe(key);
  testSubject.next(() => value2);
  t.end();
});
