export enum REMOTE {
  NOT_SET = "remote not set",
  NOT_EXISTING_DIR = "remote directory not existing",
  NOT_GIT_BARE_REPOS = "remote directory is not bare git repository",
  GIT_BARE_REPOS = "success! (remote directory - bare repos).",
}

export enum LOCAL {
  NOT_SET = "local not set",
  NOT_EXISTING_DIR = "local directory not existing",
  NOT_GIT_REPOS = "local directory is not a git repository",
  NOT_REMOTE = "git repos without accessible remote.",
  GIT_CLONE_REPOS = "success! (git repos with remote configured).",
}
