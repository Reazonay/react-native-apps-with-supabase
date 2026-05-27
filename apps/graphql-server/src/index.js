import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Workout {
    id: ID!
    title: String!
    durationInMinutes: Int!
    difficulty: String!
  }

  type ServiceStatus {
    ok: Boolean!
    message: String!
  }

  type Query {
    adminWorkouts: [Workout!]!
    upcomingWorkouts: [Workout!]!
    serviceStatus: ServiceStatus!
  }
`;

const adminWorkouts = [
  {
    id: 'plan-001',
    title: 'Starter Strength Plan',
    durationInMinutes: 30,
    difficulty: 'Beginner'
  },
  {
    id: 'plan-002',
    title: 'Performance Split',
    durationInMinutes: 55,
    difficulty: 'Advanced'
  }
];

const upcomingWorkouts = [
  {
    id: 'w-001',
    title: 'Lower Body Strength',
    durationInMinutes: 45,
    difficulty: 'Intermediate'
  },
  {
    id: 'w-002',
    title: 'Core Stability Circuit',
    durationInMinutes: 20,
    difficulty: 'Beginner'
  }
];

const resolvers = {
  Query: {
    adminWorkouts: () => adminWorkouts,
    upcomingWorkouts: () => upcomingWorkouts,
    serviceStatus: () => ({ ok: true, message: 'GraphQL server is ready.' })
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

const { url } = await startStandaloneServer(server, {
  listen: { port },
  cors: {
    origin: '*',
    credentials: false
  }
});

console.log(`GraphQL server running at ${url}`);
