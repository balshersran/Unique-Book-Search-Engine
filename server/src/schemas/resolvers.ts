import { AuthenticationError, signToken } from "../services/auth.js";
import  { User } from "../models/index.js";

interface UserArgs {
    user: {
        username: string;
        email: string;
        _id: string;
    }
}

interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    email: string;
    password: string;
}

interface SavedBookArgs {
    bookId: string;
    title: string;
    authors: String[];
    description: String;
    image: String;
    link: String;
}

const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },

    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            const user = await User.create({ ...input });

            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },
        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Could not authenticate user');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate password')
            }

            const token = signToken(user.username, user.password, user._id);

            return { token, user };
        },
        saveBook: async (_parent: any, { input }: {input: SavedBookArgs}, context: UserArgs) => {
            const user = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: input } },
                { new: true },
            )
            return user;
        },
        removeBook: async (_parent: any , { bookId }: { bookId: string }, context: UserArgs) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } }}
                );

                return updatedUser;
            }
            return;
        }
    }
}

export default resolvers;