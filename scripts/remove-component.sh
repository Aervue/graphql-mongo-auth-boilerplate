#!/bin/bash
################ INPUT VARS ##############
COMPONENT=$1
##########################################


############# CHECKING INPUT PARAMS #####

if [ -z "$COMPONENT" ]; then
  echo 'Missing mandatory component folder name. Ex. yarn add-component-part User'
  exit 0
fi

#########################################

echo "Deleting existing component..."

DIRECTORY="../src/components/${COMPONENT}"
if [ -d "$DIRECTORY" ]; then
    echo "Component '$COMPONENT' has been FOUND"
    read -p "Press Enter To Continue to delete it or Ctrl + C to abort"
else
    echo "'$COMPONENT' not found";
    echo "Did not remove anything...";
    exit 0;
fi
echo $(pwd)
rm -R $(dirname $(pwd))/src/components/${COMPONENT}

echo "Component '$COMPONENT' has been DELETED"