import { Action } from "./../enums/action";
import { PullRequest } from "./pull_request";
import { Repository } from "./repository";

export type Payload = {
  action: Action;
  pull_request: PullRequest;
  repository: Repository;
};
