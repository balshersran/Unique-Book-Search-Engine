import express from 'express';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import db from './config/connection.js';
// import routes from './routes/index.js';
import type { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';

const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const startApolloServer = async () => {
  await server.start();
  await db();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/build')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }


  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
