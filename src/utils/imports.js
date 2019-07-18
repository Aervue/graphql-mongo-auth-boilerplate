const fg = require('fast-glob')
const { mergeTypes } = require('merge-graphql-schemas')

// import components manually in components array for slightly faster cold boots
const components = fg.sync('*', { onlyDirectories: true, cwd: 'src/components' })

const mapSchema = components.map((name) => require('../components/' + name + '/_schema').schema)
const mapQuery = components.map((name) => require('../components/' + name + '/_query').queryResolvers)
const mapMutation = components.map((name) => require('../components/' + name + '/_mutation').mutationResolvers)

// const mapResolvers =
exports.typeDefs = mergeTypes(mapSchema, { all: false })
exports.resolvers = [...mapQuery, ...mapMutation]
