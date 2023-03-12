import { User } from "./user";

export interface PullRequest {
  id: number;
  url: string;
  html_url: string;
  user: User;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string | null;
  requested_reviewers: [];
  labels: { name: string }[];
}
