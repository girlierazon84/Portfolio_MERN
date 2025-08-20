import bcrypt from 'bcrypt'
import Logger from './Logger'

const saltRounds = 10;

const createPassword = (plaintextPassword: string) => {
    bcrypt.hash(plaintextPassword, saltRounds)
    .then(hash => {
        Logger.info(`Password created successfully`);
        return hash;
    })
    .catch(error => {
        Logger.error(`Error creating password: ${error}`);
        throw error;
    });
}

const hashPassword = async (password: string): Promise<string> => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        Logger.info(`Password hashed successfully`);
        return hash;
    } catch (error) {
        Logger.error(`Error hashing password: ${error}`);
        throw error;
    }
};

const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
    try {
        const match = await bcrypt.compare(password, hash);
        Logger.info(`Password comparison successful`);
        return match;
    } catch (error) {
        Logger.error(`Error comparing passwords: ${error}`);
        throw error;
    }
};

export { 
    createPassword, 
    hashPassword, 
    comparePasswords 
};
