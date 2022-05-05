#!/bin/bash

usage() {
  echo "Usage:"
  echo -e "\tbuild.sh [-t <target environment>]"
  echo -e "\nDescription:"
  echo -e "\tBuild current branch for target environment."
  echo -e "\t-t <target environment>\t\tSpecify which environment to build.\n"
  exit -1
}

# TARGET_BRANCH="test"

# while getopts 'ht:' OPT; do
#   case $OPT in
#     h)
#       usage;;
#     t)
#       TARGET_BRANCH="$OPTARG"
#       if [ -z "$TARGET_BRANCH" ]; then
#         usage
#       fi
#       ;;
#     ?)
#       usage;;
#   esac
# done

# if [[ "$TARGET_BRANCH" != "test" ]] && [[ "$TARGET_BRANCH" != "staging" ]] ; then
#   echo "The environment name must be \"test\" or \"staging\"."
#   exit -1
# fi

CURRENT_BRANCH=`git symbolic-ref --short -q HEAD`

# while true; do
#   echo -n -e "\n\033[31mPlease make sure your branch(\033[32m$CURRENT_BRANCH\033[31m) is up to date and your workspace is clean!\nAre you sure to continue? (Y or N)\033[0m "
#   read Input
#   case $Input in
#     Y|y|YES|yes)
#     break;;
#     N|n|NO|no)
#     exit;;
#   esac
# done

DATETIME=`date "+%Y-%m-%d %H:%M:%S"`

if [ "$CURRENT_BRANCH" == "$TARGET_BRANCH" ]; then
  echo -e "\n\033[33mOops, you are now on the branch '$CURRENT_BRANCH'.\033[0m"
  exit -1
# else
#   echo -e "\n\033[32mCurrent branch is '$CURRENT_BRANCH'.\033[0m"
fi

git checkout $SOURCE_BRANCH
git branch -D $TARGET_BRANCH
git checkout -b $TARGET_BRANCH

if [ $? -eq 0 ]; then

  if [ $TARGET_BRANCH == 'staging' ]; then
    npm run build:prod
  else
    npm run build:test
  fi

  if [ $? -eq 0 ]; then

    rm -f $PACKAGE_NAME.zip
    zip -r $PACKAGE_NAME.zip $PACKAGE_NAME

    if [ $? -eq 0 ]; then

      git add $PACKAGE_NAME.zip
      git commit -m"build: $DATETIME"
      git push --set-upstream origin $TARGET_BRANCH -f

      if [ $? -eq 0 ]; then
        git checkout $CURRENT_BRANCH
        echo -e "\n\033[32mBuild succeed.\033[0m"
      fi

    fi
  fi
fi
