# JLG Backup

<div align="center">
  <img src="./client/src/assets/logo.png" width="300" />
</div>

Regularely backup your things on an external hard drive.

## Requirements

- Windows 10
- git
- Node.js

And also:

- Windows admin right for installing a windows service.

## Installation

```
npm i -g jlg-backup
jlg-backup i
```

This will install and start a windows service.

Open a browser to access the **JLG Backup interface**.

```
http://localhost:55555
```

## Configuration

You need to configure the following:

- **Backup directory**: Windows path of an existing directory, where you want to store the backups. Generally on an external hard drive. (ex: `E:\all-my-backups`)
- **Project directory**: Windows path of an existing directory, where you want to work on some projects. Generally on the PC you are working on. (ex: `C:\all-my-projects`)
- **Backup time interval**: Interval in second after which a backup is automatically run by the JLG Backup Windows service. (ex: `3600` for running the backup every hour)

Make sure both the _backup directory_ and _project directory_ exist.

## Usage

### Add data to backup

Start creating a directory under the _project directory_:

Example

```
cd /d C:\all-my-projects
mkdir my_first_project
```

Add some files inside `my_first_project`.

### Backup now!

Then on the JLG Backup interface (`http://localhost:55555`) just click the button **Backup now!**

You can also wait for the interval in second... it will backup automatically.

### What the backup is technically doing?

1. The directory `C:\all-my-projects\my_first_project` is transformed in a local git repository A.
2. The backup create a remote git repository B just under the _backup directory_ (`E:\all-my-backups\my_first_project`). If the remote repository was already existing, it is cloned into A.
3. The local git directory A is always pushed in the remote git repository B.

In fact, every time a backup will be performed, each directory directly located under the _project directory_ will be transformed in a git repository if it is not already a git repository, and a remote git repository with the same name will be created under the _backup directory_, if not already existing.

Reciprocally, if a remote git repository B already exists under the _backup directory_, it will be cloned with git if an empty directory with the same name is under the _project directory_.

### Remove the project

```
cd /d C:\all-my-projects
rmdir /q /s my_first_project
```

### Retrieving a backup

```
cd /d C:\all-my-projects
mkdir my_first_project
```

Then open the JLG Backup web interface (`http://localhost:55555`) and press the button **Backup now!**

Then look inside the project directory. You will find it again!

## Why?

To help my wife managing her data.

[See here the exact use case.](./doc/why.md)

## Who ?

Anyone that needs running periodically backup, open source and free.

## TODO

- path type
- unit/e2e test in angular project.
- keyword
- input directory (ergo)

## Contributors are welcome!

You may participate to complete this project. You can improve this doc, or check the code (memory leak, etc.), create new usefull business cases, etc.

## Author

Jean-Louis GUENEGO <jlguenego@gmail.com>
