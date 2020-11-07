# Why JLG Backup ?

To help my wife managing her data.

## What kind of business is she running ?

[She is an architect, specialized in historical monument.](https://www.guenego.com)

She runs a small business, and has about 4 employees.
She helps people building house, small shops, industrial building, city hall, schools, and she is specialized in historical monument restoration like churches, cassels, old farms, etc.

## What about her data ?

Of course she cares about her data, and is afraid to lose them.

### File types

- photos,
- office documents (Word, Excel, PDF, Powerpoint), and
- CAD document (AutoCAD, Sketchup, Revit, etc.),
- some images (Photoshop, etc.).

### Directory structure

She has one root directory containing project directories.

```
- D:\architecture
  - <year>_<sequence>_<description> (Ex: 2020_345_lagny, about 600 after 20 years)
  - <other-misc-directories> (about 10)
```

As described above, there is one layer of subdirectories that are all her projects, and some other misc directories (accounting, finance, marketing, prospection, misc, etc.)

She does not like the cloud and prefers to have all her files well localized in local hard drives.

### Constraints

- No Cloud, No Amazon, OVH, etc.
- No subscription anywhere.
- Free and open source
- OK to buy external storage (hard drive, USB key, etc.)
- No server running 24h a day. (Ecological and economical reason, fire risk, etc.)
- No Windows domain, Active Directory, etc.
- No manual things to manage with backup. My wife is not a computer scientist.
- Storage must retrieve previous versions of file and directories ([like git](https://git-scm.com/))
- the 500 projects takes 1.5 Terabits. The projects cannot be on a single PC but on a 5TB external hard drive.
- Any projects must be easily retrieved and modified.
- Working in one month on maximum 50 different projects.
- The data must be on two external drives, in two different building.
- Copy 2 external hard drive is possible. (rsync may be a good solution)

## Any existing solutions?

If you know some backup solution easy to setup that could make it, open source, free, satisfying all the above constraints, then do not hesitate to show a gist.

## Author

Jean-Louis GUENEGO <jlguenego@gmail.com>
