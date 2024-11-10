import { AuthenticationError, signToken } from "../services/auth";
import User from "../models/User";

interface UserArgs {
    username: string;
}
interface AddUserArgs {
    input:{
      username: string;
      email: string;
      password: string;
    }
  }

const resolvers = {
    Query: {
        user: async (_parent: any, { username }:UserArgs) => {
            await User.findOne({ username }).populate('Book');
        },
        users: async () =>{
            await User.find().populate('Book');
        } ,
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id }).populate('thoughts');
            }
            throw new AuthenticationError('Could not authenticate user.');
          },
    },

    Mutation: {
        addUser: async (_parent: any, { input }:AddUserArgs) => {
            await User.create({ ...input });

            const token = signToken(user.username, user.email, user._id);
        }
    }
}

export default resolvers;