'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "./appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "./plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const { 
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID
 } = process.env;

export const getUserInfo = async ({userId} : getUserInfoProps) => {
    try {
        const { database } = await createAdminClient();
        const user = await database.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        )
        return parseStringify(user.documents[0]);
    } catch (error) {
        console.error('an error occurred while getting user info', error); 
    }
}

export const SignIn = async ({email, password} : signInProps) => {
    try {
        const { account } = await createAdminClient();

        const session = await account.createEmailPasswordSession(email, password); 
        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        const user = await getUserInfo({ userId: session.userId});
        return parseStringify(user);
    } catch (error) {
        console.error('Error',error)
    }
}

export const SignUp = async ({password, ...userData}: SignUpParams) => {
    let newUserAccount;
    try {
        const { email, firstName, lastName } = userData;
        const { account, database } = await createAdminClient();

        newUserAccount = await account.create(
            ID.unique(), 
            email, 
            password, 
            `${firstName} ${lastName}`
        );
        if(!newUserAccount){
            throw new Error('error creating user');
        }
        console.log("Creating Dwolla customer with data:", userData);
        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: 'personal'
        })
        console.log("Dwolla customer response:", dwollaCustomerUrl);
        if(!dwollaCustomerUrl){
            throw new Error('error creating dwolla customer');
        }
        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        const newUser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAccount.$id,
                dwollaCustomerId,
                dwollaCustomerUrl
            }
        )
        const session = await account.createEmailPasswordSession(email, password);

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        return parseStringify(newUser)
    } catch (error) {
        console.error('Error',error)
    }
}

export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const result = await account.get();
      const loggedInUser = await getUserInfo({userId: result.$id});
      return parseStringify(loggedInUser);
    } catch (error) {
      return null;
    }
}

export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient();
        (await cookies()).delete("appwrite-session");
        await account.deleteSession('current');
    } catch (error) {
        return null;
    }
}

export const createLinkToken = async (user: User) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id,
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ["auth", "transactions"] as Products[], // Add "transactions" to the products array
            language: "en",
            country_codes: ["US"] as CountryCode[],
            update: { reauthorization_enabled: true }, // Enable reauthorization
        };
        

        const response = await plaidClient.linkTokenCreate(tokenParams);
        return parseStringify({ linkToken:  response.data.link_token });
    } catch (error) {
        console.error("Error creating link token:", error);
    }
}

export const createBankAccount = async ({
    bankId,
    userId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId
} : createBankAccountProps) => {
    try {
        const {database} = await createAdminClient();
        const bankAccount = await database.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(),
            {
                bankId,
                userId,
                accountId,
                accessToken,
                fundingSourceUrl,
                shareableId
            }
        )
        return parseStringify(bankAccount);
    } catch (error) {
        console.error('throwing error while creating bank account',error);
    }
}

export const exchangePublicToken = async ({publicToken, user} : exchangePublicTokenProps) => {
    try {
        const response = await plaidClient.itemPublicTokenExchange({public_token: publicToken});
        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;
        
        // get account information from plaid using access token
        const accountResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        })

        const accountsData = accountResponse.data.accounts[0];

        // Create a processor token for Dwolla usiing access token and account ID
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountsData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
        }

        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;
        
        // Create a funding source URL for the account using the Dwolla customer ID, 
        // processor token and bank name
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountsData.name
        })
        // If the funding source URL is not created, return an error
        if (!fundingSourceUrl) {
            throw Error;
        }

        //Create a bank account using the user ID, item ID, account ID, access token,
        // funding source URL, and processor token
        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountsData.account_id,
            accessToken,
            fundingSourceUrl,
            shareableId: encryptId(accountsData.account_id)
        });

        // Revalidate the path to reflect the changes
        revalidatePath('/');
        return parseStringify({
            publicTokenExchange: 'complete'
        })
    } catch (error) {
        console.error('an error occurred while exchanging public token', error);
    }
}

export const getBanks = async ({userId} : getBanksProps) => {
    try {
        const { database } = await createAdminClient();
        const banks = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        )
        return parseStringify(banks.documents);
    } catch (error) {
        console.error('an error occurred while getting banks by user id', error);
    }
}

export const getBank = async ({documentId} : getBankProps) => {
    try {
        const { database } = await createAdminClient();
        const bank = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('$id', [documentId])]
        )
        return parseStringify(bank.documents[0]);
    } catch (error) {
        console.error('an error occurred while getting banks by user id', error);
    }
}