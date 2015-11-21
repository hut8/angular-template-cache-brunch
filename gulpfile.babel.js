/**
 * @author john
 * @version 11/20/15 9:09 PM
 */

import gulp from 'gulp'
import conChangelog from 'gulp-conventional-changelog'

gulp.task(changelog)

function changelog () {
  return gulp.src('changelog.md')
    .pipe(conChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'))
}

