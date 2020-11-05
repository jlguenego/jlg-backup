export enum REMOTE {
  INIT = "Init...",
  NOT_SET = "Remote not set",
  NOT_EXISTING_DIR = "Remote directory not existing",
  NOT_GIT_BARE_REPOS = "Remote directory is not bare git repository",
  GIT_BARE_REPOS = "Remote git repos",
}

export enum LOCAL {
  INIT = "Init...",
  NOT_SET = "Local not set",
  NOT_EXISTING_DIR = "Local directory not existing",
  NOT_GIT_REPOS = "Local directory is not a git repository",
  NOT_REMOTE = "Git repos without accessible remote.",
  GIT_CLONE_REPOS = "Clone git repos.",
}

export enum BACKUP {
  NOTHING_TO_ADD = "Nothing to add",
  NOTHING_TO_COMMIT = "Nothing to commit",
  CANNOT_PUSH = "Cannot push.",
  OK = "Backup ok",
}
