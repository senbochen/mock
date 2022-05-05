import { createServer, Model, Factory } from 'miragejs'
export default function makeServer() {
  const server = createServer({
    models: {
      user: Model,
    },

    factories: {
      user: Factory.extend({
        title: (res) => {
          return `Build complete frontend features,even if your API doesn't exist.${res}`
        },
        name: 'mirage永远的Mock',
      }),
    },

    seeds(server) {
      server.createList('user', 4000)
    },
    routes() {
      this.namespace = 'api'
      this.get(
        '/users',
        (schema: Record<string, any>, request: Record<string, any>) => {
          const pageSize = Number(request.queryParams.pageSize)
          const currentSize = Number(request.queryParams.currentPage)
          const startItem = 0
          const endItem = currentSize * pageSize
          console.log(pageSize, currentSize, startItem, endItem)
          return schema.users.all().slice(startItem, endItem)
        },
      )
    },
  })

  return server
}
