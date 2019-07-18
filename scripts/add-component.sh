#!/bin/bash
################ INPUT VARS ##############
COMPONENT=$1
##########################################


############# CHECKING INPUT PARAMS #####

if [ -z "$COMPONENT" ]; then
  echo 'Missing mandatory component name. Ex. yarn add-component User'
  exit 0
fi

#########################################

echo "Creating new component..."

DIRECTORY="../src/components/${COMPONENT}"
if [ -d "$DIRECTORY" ]; then
    echo "Component '$COMPONENT' already exists"
    read -p "Press Enter To Continue or Ctrl + C to abort"
fi

mkdir -p ../src/components/${COMPONENT}

cd ../src/components/${COMPONENT}

cat > _model.js <<EOF
const mongoose = require('mongoose')

const ${COMPONENT}Schema = new mongoose.Schema({

})

module.exports = mongoose.model('${COMPONENT}', ${COMPONENT}Schema)
EOF

cat > _schema.js <<EOF
const { gql } = require('apollo-server-express')

const schema = gql\`
type ${COMPONENT}Example {
  name: String
}

input ${COMPONENT}ExampleInput {
  name: String
}

type Query {
  get${COMPONENT}Example(input: ${COMPONENT}ExampleInput): ${COMPONENT}Example
}


type Mutation {
  add${COMPONENT}Example(input: ${COMPONENT}ExampleInput): ${COMPONENT}Example
}
\`

exports.schema = schema
EOF

cat > _query.js <<EOF
const ${COMPONENT} = require('./_model')

const queryResolvers = {
  Query: {

  }
}

exports.queryResolvers = queryResolvers
EOF

cat > _mutation.js <<EOF
const ${COMPONENT} = require('./_model')

const mutationResolvers = {
  Mutation: {

  }
}

exports.mutationResolvers = mutationResolvers
EOF

echo "Component '$COMPONENT' has been CREATED"