export const typeDefs = `#graphql
type Status {
  os: String,
  arch: String,
  platform: String,
  release: String,
  machine: String,
  memory: Int,
  uptime: Int,
  user: {
    uid: Int,
    gid: Int,
    username: String,
    homedir: String,
    shell: String
  },
  network: {
    address: String,
    netmask: String,
    family: String,
    mac: String,
    internal: Boolean,
    cidr: String
  }
}




type Query {
  status(secret:String!):Status
}
type Mutation {

}

`;
