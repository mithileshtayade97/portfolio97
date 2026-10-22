import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PERSPECTIVES,
  THINKING_DISCIPLINES,
  VIDEOS,
  PROJECTS,
  getPerspectiveById,
  getDisciplineById,
  filterVideosBySource,
  getProjectBySlug,
  validateContactMessage,
  decodeSignalText,
} from './portfolioData.ts';

test('getPerspectiveById returns matching perspective or defaults to build', () => {
  assert.equal(getPerspectiveById('build').heroTitle, 'Ideas into code. Infrastructure into impact');
  assert.equal(getPerspectiveById('teach').label, 'Insight');
  assert.equal(getPerspectiveById('teach').heroTitle, 'Make technology practical.');
  assert.equal(getPerspectiveById('connect').heroTitle, 'Let the learning speak.');
  assert.equal(getPerspectiveById('unknown').id, 'build');
});

test('getDisciplineById returns matching discipline and 3 steps', () => {
  const teaching = getDisciplineById('teaching');
  assert.equal(teaching.title, 'Cloud & DeveOps.');
  assert.equal(teaching.steps.length, 3);
  assert.equal(teaching.steps[0].label, 'Code with purpose');
  assert.equal(getDisciplineById('nonexistent').id, 'engineering');
});

test('filterVideosBySource filters video items accurately by source', () => {
  const all = filterVideosBySource(VIDEOS, 'all');
  const channel = filterVideosBySource(VIDEOS, 'channel');
  const sheryians = filterVideosBySource(VIDEOS, 'sheryians');

  assert.equal(all.length, 6);
  assert.equal(channel.length, 3);
  assert.equal(sheryians.length, 3);
  assert.ok(channel.every((v) => v.source === 'channel'));
  assert.ok(sheryians.every((v) => v.source === 'sheryians'));
});

test('getProjectBySlug resolves all 5 portfolio case studies', () => {
  assert.equal(PROJECTS.length, 5);
  const lms = getProjectBySlug('sheryians-lms');
  assert.ok(lms);
  assert.equal(lms.title, 'Sheryians Learning Management System');
  assert.equal(getProjectBySlug('invalid-slug'), undefined);
});

test('validateContactMessage enforces name, email format, and message length', () => {
  assert.equal(
    validateContactMessage({ name: '', email: 'test@example.com', message: 'Hello Mithilesh!' }).valid,
    false
  );
  assert.equal(
    validateContactMessage({ name: 'Arjun', email: 'not-an-email', message: 'Hello Mithilesh!' }).valid,
    false
  );
  assert.equal(
    validateContactMessage({ name: 'Arjun', email: 'arjun@example.com', message: 'Short' }).valid,
    false
  );
  assert.equal(
    validateContactMessage({
      name: 'Arjun',
      email: 'arjun@example.com',
      message: 'Would love to collaborate on a new developer education project!',
    }).valid,
    true
  );
});

test('decodeSignalText preserves spaces and resolves full string at progress 1', () => {
  const target = 'Mithilesh Tayade';
  assert.equal(decodeSignalText(target, 1), target);
  const partial = decodeSignalText(target, 0.5);
  assert.equal(partial.length, target.length);
  assert.ok(partial.startsWith('Mithiles'));
  assert.equal(partial[9], ' ');
});
