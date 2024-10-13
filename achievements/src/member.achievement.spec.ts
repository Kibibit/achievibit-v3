import { DateTime } from 'luxon';

import { PullRequest, Shall } from './dev-tools/mocks';
import { member } from './member.achievement';

describe('member achievement', () => {
  it('should not be granted if PR opened less than 2 weeks ago', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.createdOn = DateTime.now().minus({ days: 13 }).toJSDate();

    member.check(pullRequest, testShall);
    expect(testShall.grantedAchievements).toBeUndefined();
  });

  it('should be granted if PR opened more than 2 weeks ago', () => {
    const testShall = new Shall();
    const pullRequest = new PullRequest();

    pullRequest.createdOn = DateTime.now().minus({ days: 15 }).toJSDate();

    member.check(pullRequest, testShall);
    expect(testShall.grantedAchievements.creator).toMatchSnapshot();
  });
});
