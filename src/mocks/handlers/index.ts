import { authHandlers } from './auth';
import { scenarioHandlers } from './scenarios';
import { usersHandlers } from './users';

export const handlers = [...authHandlers, ...scenarioHandlers, ...usersHandlers];
