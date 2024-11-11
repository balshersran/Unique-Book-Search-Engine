import { AuthenticationError, signToken } from "../services/auth.js";
import { User } from "../models/index.js";

interface UserArgs {
    username: string;
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
}

const resolvers = {
    Query: {
        user: async (_parent: any, { username }: UserArgs) => {
            await User.findOne({ username }).populate('Book');
        },
        users: async () => {
            await User.find().populate('Book');
        },
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('thoughts');
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
        saveBook: async (_parent: any, { bookId }: SavedBookArgs, context: any) => {
            const user = await User.findOneAndUpdate(
                { _id: context.user.id },
                { $addToSet: { savedBooks: bookId } },
                { runValidators: true, new: true },
            )
            return user;
        },
        deleteBook: async (_parent: any , { bookId }: SavedBookArgs, context: any) => {
            if(context.user) {
                const book = await User.findOne({
                    _id: bookId,
                });

                if(!book) {
                    throw new Error('Book not found');
                }
                
                await User.findOneAndUpdate(
                    { _id: context.user.id },
                    { $pull: { savedBooks: book.id}}
                );

                return book;
            }
            return;
        }
    }
}

export default resolvers;